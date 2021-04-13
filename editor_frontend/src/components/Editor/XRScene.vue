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

import {EventManager} from '../../Events/EventManager.js';

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
    //Create Primitive first
    this.CreatePrimitives();

    this.InitWebXR();



    EventManager.$on("Select", this.HandleModelSelection.bind(this));
    EventManager.$on("Deselect", this.HandleModelDeselection.bind(this));
  },
  watch:{
    "$store.state.currentProjekt" : function(){
      var slide = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex];
      var elementsNotInScene = slide.SlideElements.filter(sElement => !this.attachedModels.hasOwnProperty(sElement.id));

      var primitiveElements = elementsNotInScene.filter(el => el.element.Type.Type === "Primitive");

      primitiveElements.map(element => {

        console.log("element primitive" , element.element.Primitive.PrimitiveType);

        this.AddSingleModelToScene(element, this.library.Cube);
      });

      var elementsToLoad = elementsNotInScene.filter(el => el.element.Type.Type === "Object3D").filter(el => {console.log(el); return el;}).map(el => {
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

        elementsNotInScene.filter(el => el.element.Type.Type === "Object3D").map(elementNotInScene =>{
          console.log("add Single Element Model to Scene", elementNotInScene);
          this.AddSingleModelToScene(elementNotInScene, this.library[elementNotInScene.Name])    
        });
      }



      console.log("elementsToLoad" , elementsToLoad);

      console.log("slide" , slide.SlideElements);

    },
    "$store.state.slideIndex" : function(){
      console.log("slideIndex changed");

      this.DetatchCurrentSlideModels();
      this.AppendCurrentSlideModels();
    }
  },
  methods : {
    CreatePrimitives(){
      this.library.Cube = {scene : new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial())};
      this.library.Cone= {scene : new THREE.Mesh(new THREE.ConeGeometry(.5,1,32), new THREE.MeshNormalMaterial())};
      this.library.Cylinder= {scene :  new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,1,32), new THREE.MeshNormalMaterial())};
      this.library.Sphere= {scene :  new THREE.Mesh(new THREE.SphereGeometry(.5,16,16), new THREE.MeshNormalMaterial())};
      this.library.Torus= {scene :  new THREE.Mesh(new THREE.TorusGeometry(.314,.15,12,32), new THREE.MeshNormalMaterial())};
      this.library.Plane= {scene :  new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.MeshNormalMaterial())};
    },
    HandleModelSelection(slideElement){
      console.log(slideElement ,this);

      this.Select(Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement));
    },
    HandleModelDeselection(slideElement){
      console.log("deselect" , slideElement ,this.selected);
      this.Deselect(Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement))
    },
    InitWebXR(){

      var xr = new webXRScene("xr-scene");
      xr.Renderer.instance.setClearColor(0xffffff,1);
      // var box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshNormalMaterial());
      // box.position.set(0,.5,0);
      // xr.Scene.add(box);
  
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
      // const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      // const helper = new THREE.CameraHelper( camera );
      // xr.Scene.add( helper );
      

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
      console.log(progress);

      this.progress = progress;
    },

    ChangeObjectByGizmo(){
      console.log(event, this.selected );
          var mode = this.$store.state.xr.transformControls.getMode();
          var slideElements = this.selected.userData.slideElements;
          switch(mode){
            case "translate":

              EventManager.$emit("ChangeTransform3D", {
                  type : "position",
                  object : this.selected
                });

              console.log( this.selected.userData.slideElements);
              var slideElements = this.selected.userData.slideElements;
              this.SetValue({
                object : slideElements, 
                path : "slideElements.Offset", 
                value : this.selected.position 
              });
      

            break;
            case "scale":
              console.log(this.selected.scale);
              EventManager.$emit("ChangeTransform3D", {
                  type : "scale",
                  object : this.selected
                });
              this.SetValue({
                object : slideElements, 
                path : "slideElements.Scale", 
                value : this.selected.scale
              });

            break;
            case "rotate":

              console.log(this.selected.quaternion);
              EventManager.$emit("ChangeTransform3D", {
                type : "quaternion",
                object : this.selected
              });

              this.SetValue({
                object : slideElements, 
                path : "slideElements.Rotation", 
                value : this.selected.quaternion
              });
              console.log(this.selected.rotation);
            break;
          }
    },
    AddSingleModelToScene(item, libraryItem){
      var slideElements = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex].SlideElements;
      var sElement = slideElements.find(element => element === item);

      console.log("libraryItem" ,libraryItem);

      this.attachedModels[item.id] = libraryItem;


        console.log("this.attachedModels[item.id]" , this.attachedModels[item.id]);

      //make a copy of the object
      this.attachedModels[item.id].scene = this.attachedModels[item.id].scene.clone();
      this.attachedModels[item.id].position = new THREE.Vector3(0,0,0);
      this.attachedModels[item.id].scale = new THREE.Vector3(1,1,1);
      this.attachedModels[item.id].quaternion = new THREE.Quaternion(0,0,0,1);

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
      var slideElements = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$store.state.slideIndex].SlideElements;
      
      var otherElements = slideElements.filter(el => el.element.Type.Type != "Object3D");

      var primitiveElements = otherElements.filter(el => el.element.Type.Type === "Primitive");

      primitiveElements.map(element => {

        console.log("element primitive" , element.element.Primitive.PrimitiveType);

        this.AddSingleModelToScene(element, this.library[element.element.Primitive.PrimitiveType]);
      });

      console.log("otherElements" , otherElements);
      
      var elementsToLoad = slideElements.filter(el => {console.log("el" ,el.element.Type.Type === "Object3D"); return el.element.Type.Type === "Object3D";}).map(slideElement => {
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
      
      console.log("stack" , elementsToLoad);
      
      this.$store.state.xr.Loader.loadStack({
        stack : elementsToLoad,
        progress : this.LoadProgress
      }).then(library => {
        
        console.log("library has loaded" , library);

        this.library = Object.assign(this.library, library);

        console.log("this.library");

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

      if(this.selected != null){
        this.Deselect(this.selected);
      }
      Object.keys(this.attachedModels).map(item => {
        this.$store.state.xr.Scene.remove(this.attachedModels[item].scene);

        //clear all active Objects in scene
        this.$store.state.xr.Controls.ActiveObjects = [];

        delete this.attachedModels[item];
      });


    },
    Select(mesh){
      if(mesh.parent === null){
        console.warn("Selected mesh is not present in scene any more!");
        return;
      }
      console.log("OnSelect Mesh: " , mesh);

      var parent = Utils.GetParent(mesh);
      if(parent === this.selected){return;}

      console.log("select", parent);

      if(this.selected != null){
        EventManager.$emit("3DDeselect" , this.selected);
        this.selected.userData.selected = false;
        this.$store.state.xr.transformControls.detach(this.selected);
      }

      this.selected = parent;
      this.selected.userData.selected = true;
      this.$store.state.xr.transformControls.attach(this.selected);

      EventManager.$emit("3DSelect" , this.selected);
    },
    Deselect(mesh){
      if(mesh != this.selected){return;}

      this.selected.userData.selected = false;
      this.$store.state.xr.transformControls.detach(this.selected);
      EventManager.$emit("3DDeselect" , this.selected);

      this.selected = null;

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