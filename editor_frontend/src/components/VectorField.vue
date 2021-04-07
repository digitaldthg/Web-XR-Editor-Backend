<template>
  <div class="vector-field-wrapper">
    <label v-if="title != null">{{title}}</label>
    <div class="vector">
      <template v-if="edit">
        <div class="vector-field width-10">
          <input class="value" type="number" ref="axisX" @input="e => Change(e,'x')" :value="GetValue(object, path + '.x', 0)">
          <input class="value" type="number" ref="axisY" @input="e => Change(e,'y')" :value="GetValue(object, path + '.y', 0)">
          <input class="value" type="number" ref="axisZ" @input="e => Change(e,'z')" :value="GetValue(object, path + '.z', 0)">
        </div>
        <div class="flex width-2">
          <button class="icon-button" @click="ToggleEdit(false)"><CloseIcon /></button>
        </div>
      </template>
      <template v-if="!edit">
        <div class="vector-field width-10" @click="ToggleEdit(true)">
          <div class="value">x : {{RoundNumbers(GetValue(object, path + ".x", 0))}}</div>
          <div class="value">y : {{RoundNumbers(GetValue(object, path + ".y", 0))}}</div>
          <div class="value">z : {{RoundNumbers(GetValue(object, path + ".z", 0))}}</div>
        </div>
        <div class="flex width-2">
          <button class="icon-button edit-button" @click="ToggleEdit(true)"><EditIcon/></button>
          <slot />
        </div>
      </template>
    </div>
  </div>
</template>
<script>

import DataBehaviourMixin from '../Controller/DataBehaviourMixin';
import EditIcon from '../Images/Icons/edit.svg';
import CloseIcon from '../Images/Icons/close.svg';

export default {
  name : "VectorField",
  components :{EditIcon,CloseIcon},
  mixins : [DataBehaviourMixin],
  props:[
    "object",
    "path",
    "title"
  ],
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
    Change(e, axis){
      var value = e.target.value;
      var vector3 = {
        x : isNaN(parseFloat(this.$refs.axisX.value)) ? 0 : parseFloat(this.$refs.axisX.value),
        y : isNaN(parseFloat(this.$refs.axisY.value)) ? 0 : parseFloat(this.$refs.axisY.value),
        z : isNaN(parseFloat(this.$refs.axisZ.value)) ? 0 : parseFloat(this.$refs.axisZ.value),
      }
      this.SetValue({object : this.$props.object, path : this.$props.path + ".x", value : parseFloat(this.$refs.axisX.value) });
      this.SetValue({object : this.$props.object, path : this.$props.path + ".y", value : parseFloat(this.$refs.axisY.value) });
      this.SetValue({object : this.$props.object, path : this.$props.path + ".z", value : parseFloat(this.$refs.axisZ.value) });    

      this.$emit("change", vector3);
    },
    SetValueFromOutside(vector3){
      this.SetValue({object : this.$props.object, path : this.$props.path + ".x", value : vector3.x});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".y", value : vector3.y});
      this.SetValue({object : this.$props.object, path : this.$props.path + ".z", value : vector3.z});
    },
    RoundNumbers(number){
      //console.log(number);
      return parseFloat(number).toFixed(2);
    }
  },
  
}
</script>

<style scoped>
.vector{
  display: flex;
  position: relative;
}
.value {
  width: 33%;
}
input{
  
}

button{
  margin:0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
}

.vector-field {
  justify-content: space-between;
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