<template>
  <div class="material row">
    <label>{{title}}</label>
    <slider-picker :value="colors" @input="updateValue"></slider-picker>
  </div>
</template>

<script>
import {Color} from 'three';
import { Slider } from 'vue-color';


export default {
  name : "MaterialField",
  components : {
    'slider-picker': Slider
  },
  props:{
    onChange : null,
    title :{
      type : String,
      default : ""
    },
    value : {
      type : String,
      default :  "#ff0000"
    }
  },
  data(){
    return {
      materials : null,
      colors : "#ffffff"
    }
  },
  computed:{
    
  },
  mounted(){
    
    this.colors = this.$props.value != null ? this.$props.value : "#fff000"


    if(this.$store.state.selectedMesh != null){
      this.$store.state.selectedMesh.traverse(el =>{
        if(typeof(el.material) != "undefined"){
          if(this.materials == null){this.materials = {}}
          this.materials[el.uuid] = el.material;
        }
      })
    }
  },
  methods:{
    GetColorField(color){
      var col = new Color(color);

      console.log(col, col.getHexString());
      return "#" + col.getHexString();
    },
    updateValue(color){

      if(this.$props.onChange != null){
        this.$props.onChange(color);
      }else{
        this.$store.state.selectedMesh.material.color = new Color(color.hex);
      }

    }
  }
}
</script>

<style lang="scss">
.color-field{
  width:25px;
  height:25px;
}


.vc-slider {
  position: relative;
  width: 100%!important;
}

.material {
  padding: 1rem;
}
</style>