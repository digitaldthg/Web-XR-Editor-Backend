<template>
  <div class="preview" v-if="this.$store.state.currentProjekt != null">
    <button @click="e => DeleteSlide(slide)">delete</button>
    {{slide.id}}
    <TextField 
      htmlTag="p" 
      :object="slide" 
      path="slide.Name"/>
      <img class="preview-image" v-if="slide.PreviewImage != null" :src="this.GetImageUrl(slide.PreviewImage)"/>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import TextField from '../Components/TextField';
//@group UI
// Zeigt ein einzelnes Slide an und kann es auch löschen
export default {
  name: "SlidePreview",
  mixins: [IOMixin],
  props:["slide", "DeleteSlide"],
  components:{
    TextField
  },
  methods:{
    GetImageUrl(path) {
      return config.CMS_BASE_URL  + path.url;
    },
  }
};
</script>
<style scoped>
.preview {
    width:100%;
    height:120px;
}

.preview-image {
  width:100%;
  height: auto;
  margin-bottom: 10px;
}

.visible-true {
  border-width: 5px;
}

.visible-false {
  border-width: 1px;
}

.title-text {
  position: absolute;
  top: 5px;
  width: 90px;
}


</style>
