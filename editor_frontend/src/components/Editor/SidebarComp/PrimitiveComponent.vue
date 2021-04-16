<template>
  <div class="slide-component-wrapper"  v-if="$store.state.selectedMesh != null">
    <div class="slide-component" v-if="$store.state.selectedMesh.userData.slideElements.element.Type.Type === 'Primitive'">
      <template>
          <SidebarCompHeader name="Primitive"/>

          <template v-if="toggleOpen">
            {{$store.state.selectedMesh.userData.slideElements.element.Primitive.PrimitiveType}}
            {{$store.state.selectedMesh.userData.slideElements.element.TextContent}}
            {{$store.state.selectedMesh.userData.slideElements.element}}

            <MaterialField />

            
          </template>
      </template>
    </div>
  </div>
</template>
<script>
import SidebarCompHeader from './SidebarCompHeader';
import ToggleMixin from '../../../Controller/ToggleMixin';
import ProjectMixin from '../../../Controller/ProjectMixin';
import SelectionMixin from '../../../Controller/SelectionMixin';

import MaterialField from '../../MaterialField';

export default {
  name : "PrimitiveComponent",
  mixins:[ToggleMixin,ProjectMixin,SelectionMixin],
  components : {
    SidebarCompHeader,
    MaterialField,
  },
  data(){
    return {
      
    }
  }
}
</script>
