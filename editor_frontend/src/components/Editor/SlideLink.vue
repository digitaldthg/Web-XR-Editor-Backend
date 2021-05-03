<template>
  <div :class="'slide-preview slide-preview-active-'+ active">
    <button @click="ChangeSlide">
      
      <template v-if="slide.PreviewImage != null">
        <img :src="config.CMS_BASE_URL + slide.PreviewImage.url" alt=""/>
      </template>
      
      <template v-if="slide.PreviewImage === null">
       
        <img :src="DefaultImage" />
      </template>
    </button>
  </div>
</template>

<script>
import config from '../../../../main.config';
import DefaultImage from '../../Images/placeholder.jpg';

export default {
  name : "SlideLink",
  props : ["slide","ChangeSlide", "index","active"],
  data(){
    return {
      DefaultImage : DefaultImage,
      config :config
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-preview{
  position: relative;
  width:100px;
  min-width: 100px;
  margin: .5rem;
  border-radius: 1rem;
  display: flex;
  background: #aaa;
  img{
    border-radius: 1rem;
    min-width: 100%;
    position: relative;
    display: block;
    min-height: 100%;
  }
}

.slide-preview-active-true{
  position: relative;
  &:before{
    content: "";
    display: block;
    pointer-events: none;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 2px rgba(0,0,0,.5);
    position: absolute;
    width:100%;
    height:100%;
    z-index: 9;
  }
}
button{
  display: block;
}
</style>