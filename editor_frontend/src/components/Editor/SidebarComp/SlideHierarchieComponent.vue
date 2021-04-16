<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Hierarchie"/>

    <template v-if="toggleOpen && slide != null">
      <div class="row">
        <div class="hierarchie">
          <div @click="SelectItem(SlideElements)" @contextmenu="OpenContextMenu" :class="'flex flex-between hierarchie-item hierarchie-item-selected-' + (selection === SlideElements.id)" v-for="SlideElements in slide.SlideElements" v-bind:key="SlideElements.id">
            <div class="flex justify-center hierarchie-item-col width-1">
             
              <template v-if="SlideElements.element.Type.Type == 'Object3D'">
                <ItemIcon />
              </template>
              <template v-if="SlideElements.element.Type.Type == 'Primitive'">
                <PrimitiveIcon />
              </template>
              
              <template v-if="SlideElements.element.Type.Type == 'Text'">
                <TextIcon />
              </template>
            </div>
            <div class="hierarchie-item-col align-left width-8 flex justify-center ">
              {{SlideElements.Name === "" ? "Kein Modelname" : SlideElements.Name}}
              ({{SlideElements.id}})

            </div>
            <div class="hierarchie-item-col flex width-3 flex justify-center ">
              <input class="hidden" :checked="GetVisibility(SlideElements)" type="checkbox" :id="'visibility-'+SlideElements.id" @change="e => ToggleVisibility(e.target.checked, SlideElements)"/>
              <label :for="'visibility-'+SlideElements.id">
                <template v-if="!GetVisibility(SlideElements)"><EyeClosedIcon /></template>
                <template v-if="GetVisibility(SlideElements)"><EyeIcon /></template>
              </label>
              <button @click="e => DeleteSlideElement(SlideElements)"><TrashIcon /></button>
              
            </div>

            
            <!-- <VectorField :object="SlideElements" path="SlideElements.Offset" />
            <VectorField :object="SlideElements" path="SlideElements.Scale" />
            <QuaternionField :object="SlideElements" path="SlideElements.Rotation" />
             -->
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ToggleMixin from '../../../Controller/ToggleMixin'
import QuaternionField from '../../QuaternionField.vue'
import VectorField from '../../VectorField.vue'
import SidebarCompHeader from './SidebarCompHeader.vue';

import mainConfig from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

import ItemIcon from '../../../Images/Icons/item.svg';
import EyeClosedIcon from '../../../Images/Icons/eyeClosed.svg';
import EyeIcon from '../../../Images/Icons/eye.svg';
import TrashIcon from '../../../Images/Icons/trash.svg';
import PrimitiveIcon from '../../../Images/Icons/primitive.svg';
import TextIcon from '../../../Images/Icons/text.svg';
import Utils from '../../../Common/Utils';

import {EventManager} from '../../../Events/EventManager.js';
import ProjectMixin from '../../../Controller/ProjectMixin';

export default {
  components: { 
    VectorField, 
    SidebarCompHeader, 
    QuaternionField , 
    ItemIcon, 
    EyeIcon, 
    EyeClosedIcon,
    TrashIcon,
    PrimitiveIcon,
    TextIcon
  },
  mixins:[ToggleMixin, IOMixin, ProjectMixin],
  name : "SlideHierarchie",
  data(){
    return {
      //slide : null,
      selection : null
    }
  },
  watch:{
    "$store.state.currentProjekt" : function(){
      console.log(this.$store.state.currentProjekt);
    },
    // "$route.params.slideIndex" : function(){
    //   console.log(this.$store.state.currentProjekt);
    //   this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    // },
    // "$route.params.slideContainerIndex" : function(){
    //   console.log(this.$store.state.currentProjekt);
    //   this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    // }
  },
  mounted(){
    //this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    console.log(this.$store.state.currentProjekt);
    EventManager.$on("3DSelect" , this.HandleSelection);
    EventManager.$on("3DDeselect" , this.HandleDeselection);
  },
  unmounted(){
    EventManager.$on("Select" , this.HandleSelection);
    EventManager.$on("Deselect" , this.HandleDeselection);
  },
  methods :{
    SelectItem(slideElement){
      
      if(this.selection === slideElement.id){

        EventManager.$emit("Deselect" , slideElement);

        return;
      }

      EventManager.$emit("Select" ,slideElement);
    },
    HandleSelection(element){
      this.selection = element.userData.slideElements.id;
    },
    HandleDeselection(element){
      this.selection = null;
    },
    OpenContextMenu(e){
      e.preventDefault(e);
      console.log("contextMenu");
    },
    ToggleVisibility(visible , slideElement){

      const modelInScene = Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement);
      modelInScene.visible = visible;
      console.log(visible, Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement) );
    },
    GetVisibility(slideElement){
      if(this.$store.state.xr == null){return false;}

      const visibleModel = Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement);
      if(visibleModel == null){return null}
      return visibleModel.visible;
    },
    GetSelectedState(slideElement){
      const selectionModel = Utils.GetSceneReference(this.$store.state.xr.Scene, slideElement);
      if(selectionModel === null){return false;}
      console.log(selectionModel);

      if(selectionModel.userData.hasOwnProperty("selected")){
        return selectionModel.userData.selected;
      }else{
        return false;
      }
    },
    // GetSceneReference(slideElement){
    //   if(this.$store.state.xr === null){return null;}

    //   const {id} = slideElement;
    //   var sceneReference = null;
    //   this.$store.state.xr.Scene.traverse(child =>{
    //     if(child.userData.hasOwnProperty("slideElements")){
    //       if(child.userData.slideElements.id == id){
    //         sceneReference = child;
    //       }
    //     }
    //   });

    //   sceneReference = sceneReference != null ? Utils.GetParent(sceneReference) : sceneReference;

    //   return sceneReference;
    // },
    DeleteSlideElement(slideElement){

      const id = slideElement.id;

      this.Delete(mainConfig.CMS_BASE_URL + "/slide-elements/"+ id ).then(response => {

        const itemToDelete = Utils.GetParent(Utils.GetSceneReference(this.$store.state.xr.Scene,slideElement));
        if(itemToDelete != null){
          this.$store.state.xr.Scene.remove(itemToDelete);      
        }

      });
    }
  }
}
</script>

<style lang="scss" scoped>
.hierarchie-item {
  padding: .5rem 0;
  border-bottom: 1px dotted #aaa;
}

.hierarchie-item-selected-true {
  background: #ff98004f;
}
</style>