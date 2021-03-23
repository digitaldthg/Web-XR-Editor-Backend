<template>
  <div class="vector">
    <template v-if="edit">
      <input type="number" @input="e => Change(e,'x')" :value="GetValue(object, path + '.x', 0)">
      <input type="number" @input="e => Change(e,'y')" :value="GetValue(object, path + '.y', 0)">
      <input type="number" @input="e => Change(e,'z')" :value="GetValue(object, path + '.z', 0)">

      <button @click="ToggleEdit(false)">close</button>
    </template>
    <template v-if="!edit">
      <div class="vector-field">
        <div class="value">x : {{GetValue(object, path + ".x", 0)}}</div>
        <div class="value">y : {{GetValue(object, path + ".y", 0)}}</div>
        <div class="value">z : {{GetValue(object, path + ".z", 0)}}</div>
      </div>
      <button class="edit-button" @click="ToggleEdit(true)">edit</button>
    </template>
  </div>
</template>
<script>

import DataBehaviourMixin from '../Controller/DataBehaviourMixin';

export default {
  name : "VectorField",
  mixins : [DataBehaviourMixin],
  props:[
    "object",
    "path",
  ],
  data (){
    return {
      edit : false
    }
  },
  mounted(){
    console.log("props" , this.$props.object, this.$props.path);
  },
  methods:{
    ToggleEdit(bool){
      this.edit = bool;
    },
    Change(e, axis){
      var value = e.target.value;
      this.SetValue({object : this.$props.object, path : this.$props.path + "." + axis, value : value});
    }
  },
  
}
</script>

<style scoped>
.vector{
  display: flex;
  position: relative;
}

input{
  padding:.5rem;
  width: 50px;
}

button{
  margin:0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
}

.vector-field {
  display: flex;
}
.value,input{
  border:0;
  white-space: nowrap;
  padding: .5rem;
  margin-right: .5rem;
  border-radius:5px;
  box-shadow: inset 0 0 .25rem 0 rgba(0,0,0,0.2);
}
/* 
.edit-button{
  position: absolute;
  top:0;
  right:0;
} */
</style>