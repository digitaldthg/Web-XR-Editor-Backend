<template>
  <main class="slide-scene-preview" >
    
    <template v-if="progress != null">
      <div class="progress-bar" v-if="progress.progress != 1">
        <div class="progress-bar-inner" :style="'width:' + progress.progress * 100 + '%'"></div>
      </div>
    </template>
    <div id="xr-scene"></div>

  </main>
</template>
<script>
import webXRScene from '../../webxr_scene/src/index';
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import config from '../../../../main.config';
import DataBehaviourMixin from '../../Controller/DataBehaviourMixin';
import Utils from '../../Common/Utils';


export default {
  name : "XRScene",
  props:["containerIndex", "slideIndex"],
   mixins : [DataBehaviourMixin],
  data(){
    return {
      attachedModels : {},
      progress : null,
      selected : null,
      library : {}
    }
  },
  mounted(){
    console.log("XRScene");
  
    this.InitWebXR();
  },
  watch:{
    "$store.state.currentProjekt" : function(){
      console.log("currentProjekt has changed in WebXRScene"  ,this.$store.state.currentProjekt);
      console.log("currentProjekt has changed in WebXRScene Attached Models",this.attachedModels);
      var slide = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex];

      var elementsNotInScene = slide.SlideElements.filter(sElement => !this.attachedModels.hasOwnProperty(sElement.id));

      console.log("elementsNotInScene" , this.library, elementsNotInScene);

      var elementsToLoad = elementsNotInScene.map(el => {
        return { name : el.Name , url: config.CMS_BASE_URL + el.element.Asset.url}
      }).filter(el => !this.library.hasOwnProperty(el.name) );


      if(elementsToLoad.length > 0){
        this.$store.state.xr.Loader.loadStack({
          stack : elementsToLoad,
          progress : this.LoadProgress
        }).then(loadedItems => {

          Object.keys(loadedItems).map(loadItem => {
            if(!this.library.hasOwnProperty(loadItem)){
              this.library[loadItem] = loadedItems[loadItem];
            }
          });

          elementsNotInScene.map(elementNotInScene =>{

            console.log("add Single Element Model to Scene", elementNotInScene);
            this.AddSingleModelToScene(elementNotInScene, this.library[elementNotInScene.Name])    
          });


          console.log("library" , this.library);
        });
      }else{
        console.log("elementsNotInScene but in library" , elementsNotInScene);

        elementsNotInScene.map(elementNotInScene =>{
          console.log("add Single Element Model to Scene", elementNotInScene);
          this.AddSingleModelToScene(elementNotInScene, this.library[elementNotInScene.Name])    
        });
      }



      console.log("elementsToLoad" , elementsToLoad);

      console.log("slide" , slide.SlideElements);

    },
    "$props.slideIndex" : function(){
      console.log("slideIndex changed");

      this.DetatchCurrentSlideModels();
      this.AppendCurrentSlideModels();
    }
  },
  methods : {
    InitWebXR(){

      var xr = new webXRScene("xr-scene");
      xr.Renderer.instance.setClearColor(0xffffff,1);
      var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial());
      box.position.set(0,.5,0);
      xr.Scene.add(box);
  
      var {CameraPosition, CameraTarget} = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex];
      console.log(CameraPosition);
      if(CameraPosition != null){
        xr.Controls.SetPosition(CameraPosition.x,CameraPosition.y,CameraPosition.z);
      }
      
      if(CameraTarget != null){
        xr.Controls.SetTarget(CameraTarget.x,CameraTarget.y,CameraTarget.z);
      }

      var AmbientLight = new THREE.AmbientLight(0xeeeeee, 1);
      xr.Scene.add(AmbientLight);

      var DirectionalLight = new THREE.DirectionalLight(0xffffff,1);
      xr.Scene.add(DirectionalLight);

      const size = 100;
      const divisions = 10;

      const gridHelper = new THREE.GridHelper( size, divisions );
      xr.Scene.add( gridHelper );

      //Extra Camera
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      const helper = new THREE.CameraHelper( camera );
      xr.Scene.add( helper );
      

      xr.transformControls = new TransformControls( xr.Camera.instance, xr.Renderer.instance.domElement );
			//this.transformControls.addEventListener( 'change', xr.Renderer.AnimationLoop );

			xr.transformControls.addEventListener( 'dragging-changed', ( event ) => {
          xr.Controls.enabled = ! event.value;


          console.log(event, this.selected);
          this.ChangeObjectByGizmo();
					//orbit.enabled = ! event.value;

				});
        //xr.transformControls.addEventListener( 'objectChange', this.ChangeObjectByGizmo);

      
			xr.Scene.add( xr.transformControls );

      this.$store.commit("ApplyXR" , xr);
      this.AppendCurrentSlideModels();

    },
    LoadProgress(progress){
      this.progress = progress;
    },

    ChangeObjectByGizmo(){
      console.log(event, this.selected );
          var mode = this.$store.state.xr.transformControls.getMode();
          var slideElements = this.selected.userData.slideElements;
          switch(mode){
            case "translate":
              this.SetValue({object : slideElements, path : "slideElements.Offset", value : this.selected.position});

              console.log( this.selected.userData.slideElements);
            break;
            case "scale":
              this.SetValue({object : slideElements, path : "slideElements.Scale", value : this.selected.scale});
              console.log(this.selected.scale);
            break;
            case "rotate":

              console.log(this.selected.quaternion);
              this.SetValue({object : slideElements, path : "slideElements.Rotation", value : {
                x : this.selected.quaternion.x, 
                y : this.selected.quaternion.y, 
                z : this.selected.quaternion.z, 
                w : this.selected.quaternion.w, 
                
                }});
              console.log(this.selected.rotation);
            break;
          }
    },
    AddSingleModelToScene(item, libraryItem){
      var slideElements = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex].SlideElements;
      var sElement = slideElements.find(element => element === item);

      console.log(libraryItem);

      this.attachedModels[item.id] = libraryItem;
      //make a copy of the object
      this.attachedModels[item.id].scene = this.attachedModels[item.id].scene.clone();
      this.attachedModels[item.id].position = new THREE.Vector3(0,0,0);
      this.attachedModels[item.id].scale = new THREE.Vector3(1,1,1);
      this.attachedModels[item.id].quaternion = new THREE.Quaternion();

      console.log("AddSingleModelToScene" , item, libraryItem);

      this.attachedModels[item.id].scene.traverse(child => {
        if(!child){return;}
        if(!child.hasOwnProperty("userData")){child.userData = {}}

        child.userData.slideElements = item;

        child.isUI = true;
        child.setState = this.SetStateOfObject;
        this.$store.state.xr.Controls.ActiveObjects.push(child);
      });

      
      this.attachedModels[item.id].scene.position = item.Offset != null ? new THREE.Vector3(item.Offset.x,item.Offset.y,item.Offset.z) : new THREE.Vector3(0,0,0);
      this.attachedModels[item.id].scene.scale = item.Scale != null ? new THREE.Vector3(item.Scale.x,item.Scale.y,item.Scale.z) : new THREE.Vector3(1,1,1);
      this.attachedModels[item.id].scene.quaternion = item.Rotation != null ? new THREE.Quaternion(item.Rotation.x,item.Rotation.y,item.Rotation.z,item.Rotation.w) : new THREE.Quaternion();
      this.$store.state.xr.Scene.add(this.attachedModels[item.id].scene);
    },
    AppendCurrentSlideModels(){
      var slideElements = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex].SlideElements;
      

      
      var elementsToLoad = slideElements.map(slideElement => {
        if(typeof(slideElement.element.Asset) == "undefined"){return null;}
        console.log(slideElement.element.Asset);

        var path = config.CMS_BASE_URL + slideElement.element.Asset.url;
        var name = slideElement.Name;

        console.log(slideElement);
        return {
          url : path,
          name : name
        }
      }).filter(el => el != null);


      console.log("stack" , elementsToLoad);

      elementsToLoad = elementsToLoad.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      this.$store.state.xr.Loader.loadStack({
        stack : elementsToLoad,
        progress : this.LoadProgress
      }).then(library => {
        
        this.library = library;

        slideElements.map(slideElement =>{
          if(typeof(library[slideElement.Name]) === "undefined"){return;}
          
          this.AddSingleModelToScene(slideElement, library[slideElement.Name])
        });


        this.$store.state.xr.Events.addEventListener("ui-mouse-down" , this.Select);
        this.$store.state.xr.Events.addEventListener("ui-hovered" , this.Hover);
      });
      
    },
    SetStateOfObject(state){
      //console.log(state);
    },

    DetatchCurrentSlideModels(){
      Object.keys(this.attachedModels).map(item => {
        this.$store.state.xr.Scene.remove(this.attachedModels[item].scene);

        delete this.attachedModels[item];
      });


    },
    Select(mesh){
      
      var parent = Utils.GetParent(mesh);
      if(parent === this.selected){return;}

      // var parent = mesh;
      // while(parent.parent.type === "Scene"){
      //   parent = parent.parent;
      // }

      console.log("select", parent);

      if(this.selected != null){
        this.$store.state.xr.transformControls.detach(this.selected);
      }

      this.selected = parent;
      this.$store.state.xr.transformControls.attach(this.selected);

    },
    Hover(mesh){
      //console.log("hover", mesh);
    }
  }
}
</script>


<style lang="scss" scoped>
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #9e9e9e;
  height: 5px;
}

.progress-bar-inner{
  height:100%;
  position: relative;
  background: #595fa8;
}
#xr-scene{
  pointer-events: all;
}

</style>