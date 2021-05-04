<template>
  <div class="toolbar">
    <div class="transforms">
      <label>Transform</label>
      <div class="flex button-group">
        <button class="cta-button" @click="ChangeMode('translate')">translate</button>
        <button class="cta-button" @click="ChangeMode('rotate')">rotate</button>
        <button class="cta-button" @click="ChangeMode('scale')">scale</button>
      </div>
    </div>
    

    <div class="width-1"></div>
    <div class="primitives">
       <label>Primitives</label>
      <div class="flex button-group">
        <button class="cta-button" @click="e=>AddPrimitive('Plane')">Plane</button>
        <button class="cta-button" @click="e=>AddPrimitive('Cube')">Cube</button>
        <button class="cta-button" @click="e=>AddPrimitive('Sphere')">Sphere</button>
        <button class="cta-button" @click="e=>AddPrimitive('Cylinder')">Cylinder</button>
        <button class="cta-button" @click="e=>AddPrimitive('Cone')">Cone</button>
        <button class="cta-button" @click="e=>AddPrimitive('Torus')">Torus</button>
      </div>
    </div>

    <div class="width-1"></div>
    <div class="primitives">
      <label>TextElement</label>
      <div class="flex">
        <button class="cta-button small-button" @click="e=>AddText()">Text</button>
      </div>
    </div>
    
    <div class="width-1"></div>
    
    <div class="flex">
      <SaveComponent />
    </div>


  </div>

</template>

<script>
import ProjectMixin from '../../../Controller/ProjectMixin';
import SaveComponent from '../SidebarComp/SaveComponent.vue';


export default {
  name : "Toolbar",
  components:{
    SaveComponent
  },
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
        FontSettings: {
          Content: "API Text Component",
          Color: "#000000",
          Alignment: "center",
          Justification: "center",
          LineHeight: 1,
          FontSize: 1,
          Width: 4,
          Height: 1.5,
          BackgroundColor: "#aaaaaa",
          BackgroundOpacity: 1,
          Padding: .2
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
  height:70px;
  background:#eee;
  z-index: 9;
  display: flex;
    align-items: center;
  justify-content: space-around;
}
</style>