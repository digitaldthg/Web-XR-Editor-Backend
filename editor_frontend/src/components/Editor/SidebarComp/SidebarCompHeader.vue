<template>
  <div class="header">
    {{name}}
  </div>  
</template>
<script>
export default {
  name : "SidebarCompHeader",
  props:["name"],
  mounted(){
    console.log("SidebarCompHeader");
  }
}
</script>

<style scoped>

</style>