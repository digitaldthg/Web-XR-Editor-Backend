<template>
  <div class="toolbar">
    <div class="flex transforms">
      <button class="small-button" @click="ChangeMode('translate')">translate</button>
      <button class="small-button" @click="ChangeMode('rotate')">rotate</button>
      <button class="small-button" @click="ChangeMode('scale')">scale</button>
    </div>
  </div>

</template>

<script>
export default {
  name : "Toolbar",
  mounted(){
    console.log("Toolbar");
  },
  methods:{

    ChangeMode(mode){
      switch (mode) {
        case "translate":
          this.$store.state.xr.transformControls.setMode("translate")
        break
        case "rotate":
          this.$store.state.xr.transformControls.setMode("rotate")
        break
        case "scale":
          this.$store.state.xr.transformControls.setMode("scale")
        break
      }
    }

  }
}
</script>

<style scoped>
.toolbar{
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:50px;
  background:#eee;
  z-index: 9;
  display: flex;
}
</style>