<template>
  <div class="slide-component" v-if="">
    <SidebarCompHeader name="Primitive"/>

    <template v-if="toggleOpen">
     
    </template>
</div>
</template>
<script>
import SidebarCompHeader from './SidebarCompHeader';
import ToggleMixin from '../../../Controller/ToggleMixin';

export default {
  name : "PrimitiveComponent",
  mixins:[ToggleMixin],
  components : {
    SidebarCompHeader
  },
  data(){
    return {
      
    }
  },
  mounted(){
   
  }
}
</script>