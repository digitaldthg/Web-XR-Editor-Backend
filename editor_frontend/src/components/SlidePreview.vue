<template>
  <div class="preview" v-if="this.$store.state.currentProjekt != null">
      <img class="preview-image" v-if="slide.PreviewImage != null" :src="this.GetImageUrl(slide.PreviewImage)"/>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";

export default {
  name: "SlidePreview",
  mixins: [IOMixin],
  props:["slide"],
  components:{

  },
  methods:{
      GetImageUrl(path) {
      return config.CMS_BASE_URL  + path.url;
    },
  },
  mounted() {

  },
};
</script>
<style scoped>
.preview {
    width:100%;
    height:100%;
}

.preview-image {
  width:100%;
    height:100%;
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
