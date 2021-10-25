<template>
  <div class="slide-component">
    <SidebarCompHeader name="Allgemeine Info"/>
    <template v-if="toggleOpen && $store.state.selectedMesh != null">
      <TextField title="Objektname" :object="$store.state.selectedMesh.userData.slideElements" path="slideElements.Name" htmlTag="h3"/>
    </template>
  </div>
</template>

<script>
import ToggleMixin from '../../../Controller/ToggleMixin';
import TextField from '../../TextField.vue';
import SidebarCompHeader from './SidebarCompHeader.vue';
//@group Sidebar Components
// Zeigt die Eigenschaften des Selektierten Objektes an
export default {
  name : "SelectedComponent",
  mixins: [ToggleMixin],
  components : {
    TextField,
    SidebarCompHeader

  }
}
</script>
        