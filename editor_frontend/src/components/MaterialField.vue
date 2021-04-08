<template>
  <div class="material row">
    <h3>Materials</h3>
    <div class="material-slot" v-for="material in materials" v-bind:key="material.uuid">
      {{material.name}}
      {{material.type}}
      <div class="color-field" :style="'background:' + GetColorField(material.color)"></div>
    </div>
  </div>
</template>

<script>
import {Color} from 'three';

export default {
  name : "MaterialField",
  props:[
    "object",
  ],
  data(){
    return {
      materials : null
    }
  },
  computed:{
    
  },
  mounted(){
    console.log("MaterialField");
     this.$props.object.traverse(el =>{
      console.log(el.material);
      if(typeof(el.material) != "undefined"){

        console.log(this);
        if(this.materials == null){this.materials = {}}
        this.materials[el.uuid] = el.material;
      }
    })
  },
  methods:{
    GetColorField(color){
      var col = new Color(color);

      console.log(col, col.getHexString());
      return "#" + col.getHexString();
    }
  }
}
</script>

<style lang="scss">
.color-field{
  width:25px;
  height:25px;
}
</style>