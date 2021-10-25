<template>
  <div class="slide-component">
    <SidebarCompHeader name="Light Presets"/>
    <template v-if="toggleOpen">
      <button>AmbientLight (Default)</button>

    </template>
  </div>
</template>
<script>
import ToggleMixin from '../../../Controller/ToggleMixin';
import SidebarCompHeader from './SidebarCompHeader.vue';

//@group Sidebar Components
// Placeholder für eine Lichtpreset Component
export default {
  components: { SidebarCompHeader },
  mixins:[ToggleMixin],
  name : "LightPresets"
}
</script>