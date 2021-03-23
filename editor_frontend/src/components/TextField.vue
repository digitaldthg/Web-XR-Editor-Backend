<template>
  <div class="text">
    <template v-if="edit">
      <input type="text" @input="e => Change(e)" :value="GetValue(object, path)">
      <button @click="ToggleEdit(false)">close</button>
    </template>
    <template v-if="!edit">
      <component class="html-tag" :is="GetElement">{{GetValue(object, path)}}</component>
      <button @click="ToggleEdit(true)">edit</button>
    </template>
  </div>
</template>
<script>

import DataBehaviourMixin from '../Controller/DataBehaviourMixin';

export default {
  name : "TextField",
  mixins : [DataBehaviourMixin],
  props:[
    "object",
    "path",
    "htmlTag"
  ],
  computed:{
    GetElement(){
      console.log(this.$props.htmlTag);
      return this.$props.htmlTag;
    }
  },
  data (){
    return {
      edit : false
    }
  },
  methods:{
    ToggleEdit(bool){
      this.edit = bool;
    },
    Change(e){
      var value = e.target.value;
      this.SetValue({object : this.$props.object, path : this.$props.path, value : value});
    }
  },
  
}
</script>

<style scoped>
.text{
  display: flex;
}

button{
  margin:0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
}

.html-tag, input{
  margin: 0;
  padding: 0;
  margin-right:.25rem;
}
</style>