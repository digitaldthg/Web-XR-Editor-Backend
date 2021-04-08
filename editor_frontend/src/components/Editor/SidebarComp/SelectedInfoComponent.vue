<template>
  <div class="slide-component">
    <SidebarCompHeader name="Selected Objekt"/>

    <template v-if="toggleOpen">
      <template v-if="slideElements != null">
        <TextField title="Name" :object="slideElements.userData.slideElements" path="slideElements.Name" htmlTag="h3"/>
        <VectorField title="Position" @change="vec=>Transform('position' , vec)" :object="slideElements.userData.slideElements" path="slideElements.Offset" />
        <VectorField title="Scale" @change="vec=>Transform('scale' , vec)" :object="slideElements.userData.slideElements" path="slideElements.Scale" />
        <QuaternionField title="Rotation" @change="quat=>Transform('quaternion' , quat)" :object="slideElements.userData.slideElements" path="slideElements.Rotation" />
            
        <MaterialField :object="slideElements" />
      </template>
      <template v-if="slideElements === null">
        Nichts ausgewählt
      </template>
    </template>
</div>
</template>
<script>
import SidebarCompHeader from './SidebarCompHeader';
import {EventManager} from '../../../Events/EventManager';
import ToggleMixin from '../../../Controller/ToggleMixin';
import SelectionMixin from '../../../Controller/SelectionMixin';
import VectorField from '../../VectorField.vue';
import QuaternionField from '../../QuaternionField.vue';
import TextField from '../../TextField.vue';
import MaterialField from '../../MaterialField.vue';

import {Quaternion} from 'three';

export default {
  name : "SelectedInfoComponent",
  mixins:[ToggleMixin, SelectionMixin],
  components : {
    SidebarCompHeader,
    VectorField, 
    QuaternionField, 
    TextField,
    MaterialField
  },
  // data(){
  //   return {
  //     slideElements : null
  //   }
  // },
  mounted(){
    // EventManager.$on("3DSelect", this.Select3D);
    // EventManager.$on("3DDeselect", this.Deselect3D);
    EventManager.$on("ChangeTransform3D", this.TransformFrom3D);
  },
  computed:{
    GetPosition(){
      return this.slideElements.position;
    },
    GetRotation(){
      return this.slideElements.rotation;
    }
  },
  methods:{
    TransformFrom3D(event3D){
      console.log("event3D" , event3D);

      this.Transform(event3D.type, event3D.object[event3D.type]);
    },
    Transform(transformType , value){

      if(transformType === "quaternion"){
        this.slideElements.quaternion = new Quaternion(value.x,value.y,value.z,value.w);
        return;
      }

      this.slideElements[transformType].x = value.x; 
      this.slideElements[transformType].y = value.y; 
      this.slideElements[transformType].z = value.z;
      
    },
    // Select3D(mesh){
    //   this.slideElements = mesh;
    // },
    // Deselect3D(){
    //   this.slideElements = null;
    // }
  }
}
</script>