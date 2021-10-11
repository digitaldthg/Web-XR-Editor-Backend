<template>
  <div :class="'slide-preview slide-preview-active-'+ active" @contextmenu="HandleRightClick">
    <button @click="ChangeSlide"  :style="{'background-image' : 'url('+ (slide.PreviewImage === null ? DefaultImage  : (config.CMS_BASE_URL + slide.PreviewImage.url)) + ')'}">      
      <!-- <template v-if="slide.PreviewImage != null">
        <img :src="config.CMS_BASE_URL + slide.PreviewImage.url" alt=""/>
      </template>
      <template v-else>
        <img :src="DefaultImage" />
      </template> -->
    </button>

    <div class="context-menu" v-if="contextMenuOpen">
      <button class="cta-button-small --warning" @click="HandleDelete">Löschen</button>
      <button class="cta-button-small --cancel" @click="CloseContextMenu">Abbrechen</button>
    </div>
  </div>
</template>

<script>
import config from '../../../../main.config';
import DefaultImage from '../../Images/placeholder.jpg';
import IOMixin from '../../Controller/IOMixin';

export default {
  name : "SlideLink",
  mixins:[IOMixin],
  props : ["slide","ChangeSlide", "index","active"],
  data(){
    return {
      DefaultImage : DefaultImage,
      config :config,
      contextMenuOpen : false
    }
  },
  methods:{
    HandleDelete(){

      if(this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides.length === 1){
        return;
      }

      const slideElementPromises = this.slide.SlideElements.map((sElement)=>{
        return this.Delete(config.CMS_BASE_URL + "/slide-elements/" + sElement.id);
      });

      Promise.all(slideElementPromises).then(()=>{
        return this.Delete(config.CMS_BASE_URL + "/slides/" + this.slide.id);
      }).then(()=>{
        return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then((res)=>{this.$store.commit("SetProjekt", res.data)});
      }).finally(()=>{
      });

    },
    HandleRightClick(e){
      e.preventDefault(e);
      this.contextMenuOpen = true;
    },
    CloseContextMenu(e){
      e.preventDefault(e);
      this.contextMenuOpen = false;
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

  button{
    border-radius: 15px;
    //background-color:transparent;
    background-size: cover;
    background-position: center;
  }

  &:before{
    content: "";
    display: block;
    pointer-events: none;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.5);
    position: absolute;
    width:100%;
    height:100%;
    z-index: 9;
  }
}

.slide-preview-active-true{
  position: relative;

  &:before{
    box-shadow: inset 0 0 0 4px rgba(0,0,0,.5);
  }
}
button{
  display: block;
}

.context-menu {
   left: 0;
  right: 0;
  background: #333;
    position: absolute;
  padding: 1rem;
  top: 0;
  bottom: 0;
  width: 100%;
  border-radius: 15px;
  font-weight: 700;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  button{
    font-size: 0.6rem;
    font-weight: 700;
  }
}
</style>