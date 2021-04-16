<template>
  <div class="toolbar">
    <div class="flex transforms">
      <button class="small-button" @click="ChangeMode('translate')">translate</button>
      <button class="small-button" @click="ChangeMode('rotate')">rotate</button>
      <button class="small-button" @click="ChangeMode('scale')">scale</button>
    </div>
    

    <div class="width-1"></div>
    <div class="flex primitives">
      <button class="small-button" @click="e=>AddPrimitive('Plane')">Plane</button>
      <button class="small-button" @click="e=>AddPrimitive('Cube')">Cube</button>
      <button class="small-button" @click="e=>AddPrimitive('Sphere')">Sphere</button>
      <button class="small-button" @click="e=>AddPrimitive('Cylinder')">Cylinder</button>
      <button class="small-button" @click="e=>AddPrimitive('Cone')">Cone</button>
      <button class="small-button" @click="e=>AddPrimitive('Torus')">Torus</button>
    </div>

    <div class="width-1"></div>
    <div class="flex primitives">
      <button class="small-button" @click="e=>AddText()">Text</button>
    </div>


  </div>

</template>

<script>
import ProjectMixin from '../../../Controller/ProjectMixin';

export default {
  name : "Toolbar",
  mixins:[
    ProjectMixin
  ],
  mounted(){
    console.log("Toolbar");
  },
  methods:{
    AddPrimitive(primitiveType){
      console.log(primitiveType);

      var Element = {
        Name : primitiveType + " Primitive",
        Type: {
          Type: "Primitive"
        },
        Primitive: {
          PrimitiveType: primitiveType
        }
      }
       
      this.AddElement(Element);
    },
    AddText(){
      var Element = {
        Name : "Text",
        TextContent : "Default Text",
        FontSettings: {
          Color : "#000000",
          Content : "API Text Component",
          Alignment : "left",
          Justification : "start",
          FontSize : 1,
          LineHeight : 1,
          BackgroundColor : "#aaaaaa",
          BackgroundOpacity : 1,
          Padding : .2
        },
        Type: {
          Type: "Text"
        }
      }
       
      this.AddElement(Element);
    },
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