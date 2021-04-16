<template>
  <div :class="'header header-open-'+ this.$parent.toggleOpen">
    <button class="align-left" @click="Toggle">
      <template v-if="!this.$parent.toggleOpen">&raquo;</template>
      <template v-if="this.$parent.toggleOpen">&darr;</template> {{name}}</button>
  </div>  
</template>
<script>
export default {
  name : "SidebarCompHeader",
  props:["name"],
  mounted(){
    
  },
  methods:{
    Toggle: function(){
      console.log(this.$parent.toggleOpen);
      this.$parent.ChangeVisibility(!this.$parent.toggleOpen);
    }
  }
}
</script>

<style scoped>

</style>