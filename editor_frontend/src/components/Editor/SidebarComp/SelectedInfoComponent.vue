<template>
  <div class="slide-component">
    <SidebarCompHeader name="Selected Objekt"/>

    <template v-if="toggleOpen">
      <template v-if="SlideElements != null">
        {{SlideElements.userData.slideElements.Name}}
        {{GetPosition.x}}
        {{GetPosition.y}}
        {{GetPosition.z}}

        <VectorField @change="vec=>Transform('position' , vec)" :object="SlideElements" path="SlideElements.Offset" />
        <VectorField @change="vec=>Transform('scale' , vec)" :object="SlideElements" path="SlideElements.Scale" />
        <QuaternionField @change="quat=>Transform('rotation' , quat)" :object="SlideElements" path="SlideElements.Rotation" />
            

      </template>
      <template v-if="SlideElements === null">
        Nichts ausgewählt
      </template>
    </template>
</div>
</template>
<script>
import SidebarCompHeader from './SidebarCompHeader';
import {EventManager} from '../../../Events/EventManager';
import ToggleMixin from '../../../Controller/ToggleMixin';
import VectorField from '../../VectorField.vue';
import QuaternionField from '../../QuaternionField.vue';

export default {
  name : "SelectedInfoComponent",
  mixins:[ToggleMixin],
  components : {SidebarCompHeader,VectorField, QuaternionField},
  data(){
    return {
      SlideElements : null
    }
  },
  mounted(){
    console.log("mounted SelectedInfoComponent", EventManager);

    EventManager.$on("3DSelect", this.Select3D);
    EventManager.$on("3DDeselect", this.Deselect3D);
    EventManager.$on("ChangeTransfrom3D", this.TransformFrom3D);
  },
  computed:{
    GetPosition(){
      return this.SlideElements.position;
    },
    GetRotation(){
      return this.SlideElements.rotation;
    }
  },
  methods:{
    TransformFrom3D(event3D){
      
      this.Transform(event3D.type, event3D.object[event3D.type]);
    },
    Transform(transformType , value){

      console.log(value);

      this.SlideElements[transformType].x = value.x; 
      this.SlideElements[transformType].y = value.y; 
      this.SlideElements[transformType].z = value.z;
      
      if(transformType === "rotation"){
        this.SlideElements[transformType].w = value.w;
      }
      console.log(transformType, value);
    },
    Select3D(mesh){
      this.SlideElements = mesh;
    },
    Deselect3D(){
      this.SlideElements = null;
    }
  }
}
</script>