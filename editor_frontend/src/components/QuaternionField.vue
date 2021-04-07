<template>
  <div class="quaternion">
    <template v-if="edit">
      <input type="number" ref="axisX" @input="e => Change(e,'x')" :value="GetValue(object, path + '.x', 0)">
      <input type="number" ref="axisY" @input="e => Change(e,'y')" :value="GetValue(object, path + '.y', 0)">
      <input type="number" ref="axisZ" @input="e => Change(e,'z')" :value="GetValue(object, path + '.z', 0)">
      <input type="number" ref="axisW" @input="e => Change(e,'w')" :value="GetValue(object, path + '.w', 1)">

      <button @click="ToggleEdit(false)">close</button>
      <slot />
    </template>
    <template v-if="!edit">
      <div class="quaternion-field">
        <div class="value">x : {{RoundNumbers(GetValue(object, path + ".x", 0))}}</div>
        <div class="value">y : {{RoundNumbers(GetValue(object, path + ".y", 0))}}</div>
        <div class="value">z : {{RoundNumbers(GetValue(object, path + ".z", 0))}}</div>
        <div class="value">z : {{RoundNumbers(GetValue(object, path + ".w", 1))}}</div>
      </div>
      <button class="edit-button" @click="ToggleEdit(true)">edit</button>

      <slot />
    </template>
  </div>
</template>
<script>

import DataBehaviourMixin from '../Controller/DataBehaviourMixin';

export default {
  name : "QuaternionField",
  mixins : [DataBehaviourMixin],
  props:[
    "object",
    "path",
    "value"
  ],
  watch:{
    "$props.value" : function(){
      console.log(this.$props.value);
    }
  },
  data (){
    return {
      edit : false
    }
  },
  mounted(){
    //console.log("props" , this.$props.object, this.$props.path);
  },
  methods:{
    ToggleEdit(bool){
      this.edit = bool;
    },
    Change(e){
      var quat = {
        x : isNaN(parseFloat(this.$refs.axisX.value)) ? 0 : parseFloat(this.$refs.axisX.value),
        y : isNaN(parseFloat(this.$refs.axisY.value)) ? 0 : parseFloat(this.$refs.axisY.value),
        z : isNaN(parseFloat(this.$refs.axisZ.value)) ? 0 : parseFloat(this.$refs.axisZ.value),
        w : isNaN(parseFloat(this.$refs.axisW.value)) ? 0 : parseFloat(this.$refs.axisW.value),
      }

      this.SetValue({object : this.$props.object, path : this.$props.path + ".x", value : this.$refs.axisX.value});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".y", value : this.$refs.axisY.value});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".z", value : this.$refs.axisZ.value});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".w", value : this.$refs.axisW.value});

      this.$emit("change" , quat);
    },
    SetValueFromOutside(quaternion){
      this.SetValue({object : this.$props.object, path : this.$props.path + ".x", value : quaternion.x});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".y", value : quaternion.y});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".z", value : quaternion.z});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".w", value : quaternion.w});
    },
    RoundNumbers(number){
      return parseFloat(number).toFixed(2);
    }
  },
  
}
</script>

<style scoped>
.quaternion{
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

.quaternion-field {
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