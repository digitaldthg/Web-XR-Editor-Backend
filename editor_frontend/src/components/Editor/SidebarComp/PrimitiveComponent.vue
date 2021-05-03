<template>
  <div class="slide-component-wrapper"  v-if="$store.state.selectedMesh != null">
    <div class="slide-component" v-if="$store.state.selectedMesh.userData.slideElements.element.Type.Type === 'Primitive'">
      <template>
          <SidebarCompHeader name="Primitive"/>

          <template v-if="toggleOpen">
            <Dropdown 
              title="PrimitiveType"
              :options="[
                'Cube', 
                'Cone', 
                'Cylinder', 
                'Sphere', 
                'Torus', 
                'Plane'
              ]"
              :value="$store.state.selectedMesh.userData.slideElements.element.Primitive.PrimitiveType"
              @onChange="HandlePrimitiveChange"
            />

            <!-- {{$store.state.selectedMesh.userData.slideElements.element}} -->

            <MaterialField title="Farbe" :onChange="ChangeColor" :value="$store.state.selectedMesh.userData.slideElements.element.Color" />

            
          </template>
      </template>
    </div>
  </div>
</template>
<script>
import {Color} from 'three';
import SidebarCompHeader from './SidebarCompHeader';
import ToggleMixin from '../../../Controller/ToggleMixin';
import ProjectMixin from '../../../Controller/ProjectMixin';
import SelectionMixin from '../../../Controller/SelectionMixin';

import MaterialField from '../../MaterialField';
import DataBehaviourMixin from '../../../Controller/DataBehaviourMixin';
import TextField from '../../TextField.vue';
import Dropdown from '../SidebarComp/Dropdown';

export default {
  name : "PrimitiveComponent",
  mixins:[ToggleMixin,ProjectMixin,SelectionMixin, DataBehaviourMixin],
  components : {
    SidebarCompHeader,
    MaterialField,
    TextField,
    Dropdown
  },
  data(){
    return {
      
    }
  },
  methods:{
    HandlePrimitiveChange(value){
      console.log("newPrimitive" , value);
      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.Primitive.PrimitiveType", 
        value : value,
        asObject: false
      });


    },
    ChangeColor(color){

      this.$store.state.selectedMesh.material.color = new Color(color.hex);
      
      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.Color", 
        value : color.hex,
        asObject: false
      });

    }
  }
}
</script>
