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


export default {
  name : "XRScene",
  props:["containerIndex", "slideIndex"],
   mixins : [DataBehaviourMixin],
  data(){
    return {
      attachedModels : {},
      progress : null,
      selected : null
    }
  },
  mounted(){
    console.log("XRScene");
  
    this.InitWebXR();
  },
  watch:{
    "$store.state.currentProjekt" : function(){
      console.log("currentProjekt has changed in WebXRScene"  ,this.$store.state.currentProjekt);
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
      xr.Scene.add(box)

console.log(xr, this.$store.state.currentProjekt);
  
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

    AppendCurrentSlideModels(){
      var slideElements = this.$store.state.currentProjekt.slide_containers[this.$props.containerIndex].Slides[this.$props.slideIndex].SlideElements;
      var elementsToLoad = slideElements.map(slideElement => {
        var path = config.CMS_BASE_URL + slideElement.element.Asset.url;
        var name = slideElement.Name;

        console.log(slideElement);
        return {
          url : path,
          name : name
        }

      });

      this.$store.state.xr.Loader.loadStack({
        stack : elementsToLoad,
        progress : this.LoadProgress
      }).then(library => {
          

        Object.keys(library).map(item => {
          this.attachedModels[item] = library[item];

          this.attachedModels[item].scene.traverse(child => {
            if(!child || child.type != "Mesh"){return;}
            if(!child.hasOwnProperty("userData")){child.userData = {}}

            child.userData.item = item;
            var sElement = slideElements.find(element => element.Name === item);
            
            child.userData.slideElements = sElement;
            
            child.isUI = true;
            child.setState = this.SetStateOfObject;
            this.$store.state.xr.Controls.ActiveObjects.push(child);


          });

          var sElement = slideElements.find(element => element.Name === item);

          this.attachedModels[item].scene.position = sElement.Offset != null ? new THREE.Vector3(sElement.Offset.x,sElement.Offset.y,sElement.Offset.z) : new THREE.Vector3(0,0,0);
          this.attachedModels[item].scene.scale = sElement.Scale != null ? new THREE.Vector3(sElement.Scale.x,sElement.Scale.y,sElement.Scale.z) : new THREE.Vector3(1,1,1);
          this.attachedModels[item].scene.quaternion = sElement.Rotation != null ? new THREE.Quaternion(sElement.Rotation.x,sElement.Rotation.y,sElement.Rotation.z,sElement.Rotation.w) : new THREE.Quaternion();
          this.$store.state.xr.Scene.add(this.attachedModels[item].scene);
        });


        this.$store.state.xr.Events.addEventListener("ui-mouse-down" , this.Select);
        this.$store.state.xr.Events.addEventListener("ui-hovered" , this.Hover);
      });
      console.log(slideElements, this.$store.state.xr);
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
      
      if(mesh === this.selected){return;}
      console.log("select", mesh);

      if(this.selected != null){
        this.$store.state.xr.transformControls.detach(this.selected);
      }

      this.selected = mesh;
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