<template>
  <div class="row">
    <label :for="id">{{title}}</label>
    <select :id="id" @input="onChange" @change="onChange">
      <option :selected="option === value" :value="option" v-for="option in options" :key="option">{{option}}</option>
    </select>
  </div>
</template>

<script>
export default {
  name :"Dropdown",
  props : {
    title : {
      type : String,
      default : ""
    },
    options : {
      type : Array,
      default : [],
    },
    value : {
      type : String,
      default : ""
    },

  },
  data(){
    return {
      id : null,
    }
  },
  mounted(){
    this.id = this._uid;
  },
  methods : {
    onChange(e){
      this.$emit("onChange" , e.target.value);
    }
  }
}
</script>

<style lang="scss" scoped>

select {
  width:100%;
  -webkit-appearance: none;
  appearance: none;
  color: dimgray;
  border: 1px solid dimgray;
  line-height: 1;
  outline: 0;
  padding: 0.65em 2.5em 0.55em 0.75em;
  border-radius: 3px;
  background-color: var(--baseBg);
  background-image: linear-gradient(dimgray, dimgray),
    linear-gradient(-135deg, transparent 50%, #bae1ff 50%),
    linear-gradient(-225deg, transparent 50%, #bae1ff 50%),
    linear-gradient(#bae1ff 42%, #006fc2 42%);
  background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
  background-size: 1px 100%, 20px 22px, 20px 22px, 20px 100%;
  background-position: right 20px center, right bottom, right bottom, right bottom;   
}

select:hover {
  background-image: linear-gradient(#006fc2, #006fc2),
    linear-gradient(-135deg, transparent 50%, #006fc2 50%),
    linear-gradient(-225deg, transparent 50%, #006fc2 50%),
    linear-gradient(#006fc2 42%, #bae1ff 42%);
}

select:active {
  background-image: linear-gradient(#006fc2,#006fc2),
    linear-gradient(-135deg, transparent 50%, #006fc2 50%),
    linear-gradient(-225deg, transparent 50%, #006fc2 50%),
    linear-gradient(#006fc2 42%, #bae1ff 42%);
  color: #bae1ff;
  border-color:#006fc2;
  background-color:#006fc2;
}

</style>