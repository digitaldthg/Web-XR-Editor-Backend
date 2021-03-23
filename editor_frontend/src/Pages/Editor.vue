<template>
  <div class="page-editor">
    <aside class="slide-container-navigation" :style="GetSlideContainerWidth">
      <nav  v-if="this.$store.state.currentProjekt != null">        
        <SlideContainerLink 
          :active="slideContainer.id === activeSlideContainerID" 
          v-for="(slideContainer,index) in this.$store.state.currentProjekt.slide_containers" 
          v-bind:key="slideContainer.id" 
          :slideContainer="slideContainer"
          :ChangeSlideContainer="e => ChangeSlideContainer(slideContainer.id, index)"
        />
        <div class="slide-container">
          <div class="slide-container-inner">
            <button @click="AddContainer">
              +
            </button>
          </div>
        </div>
      </nav>
    </aside>
    <main class="slide-scene-preview" id="xr-scene">

    </main>

    <div class="slide-bottom-navigation" :style="GetBottomWidth">
      <div class="slide-navigation">
        <div class="slide-navigation-button">
          <button class="slide-nav-button" @click="PrevSlide">prev</button>
        </div>
        <nav class="slide-navigation-wrapper" v-if="this.$store.state.currentProjekt != null">
          <SlideLink 
            v-for="(slide,slideIndex) in this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides" 
            v-bind:key="slide.id"
            :slide="slide"
            :index="slideIndex"
            :active="slide.id === activeSlideID"
            :ChangeSlide="e => ChangeSlide(slide.id)"/>
          
          <div class="add-slide">
            <button @click="e => AddSlide(this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex])">+</button>
          </div>
        </nav>
        <div class="slide-navigation-button">
          <button  class="slide-nav-button" @click="NextSlide">next</button>
        </div>
      </div>
      <div class="slide-navigation"></div>
    </div>

    <aside class="slide-components" :style="GetComponentsWidth">
      <template v-if="this.$store.state.currentProjekt != null">
        <div class="slide-component-settings">
          <SidebarContainerSettings :slideContainer="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex]"/>

          <SlideSettings :slide="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides[activeSlideIndex]"/>

          <SlideHierarchie :slide="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides[activeSlideIndex]"/>
        </div>
        <SaveComponent />

      </template>
    </aside>
  </div>
</template>
<script>

import SlideContainerLink from '../Components/Editor/SlideContainerLink';
import SlideLink from '../Components/Editor/SlideLink';
import IOMixin from "../Controller/IOMixin";
import ProjectMixin from '../Controller/ProjectMixin';
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";
import config from '../../../main.config';

//Components für die Sidebar
import SidebarContainerSettings from '../Components/Editor/SidebarComp/SlideContainerSettings';
import SaveComponent from '../Components/Editor/SidebarComp/SaveComponent';
import SlideSettings from '../Components/Editor/SidebarComp/SlideSettingsComponent';
import SlideHierarchie from '../Components/Editor/SidebarComp/SlideHierarchieComponent.vue';


//XR
import webXRScene from '../webxr_scene/src/index';

export default {
  name : "EditorPage",
  mixins: [IOMixin, DataBehaviourMixin,ProjectMixin],
  components:{
    SlideContainerLink,
    SlideLink,
    SidebarContainerSettings,
    SaveComponent,
    SlideSettings,
    SlideHierarchie
  },
  data(){
    return {
      slideContainerWidth: 50,
      slideComponentsWidth :400,
      activeSlideContainerID : null,
      activeSlideContainerIndex : null,
      activeSlideID : null,
      activeSlideIndex : null
    }
  },
  watch : {
    "$store.state.user" : function(){
      this.Init();
    },
    "$store.state.currentProjekt" : function(){
      if(this.$store.state.currentProjekt == null) {return}
      if(this.$store.state.currentProjekt.slide_containers == null) {return}

      var slide_id = this.$store.state.currentProjekt.slide_containers[0].Slides.length === 0 ? null : this.$store.state.currentProjekt.slide_containers[0].Slides[0].id;
      this.activeSlideID = slide_id;
      this.activeSlideIndex = 0;

      this.activeSlideContainerID = this.$store.state.currentProjekt.slide_containers[0].id;
      this.activeSlideContainerIndex = 0;
    }
  },
  computed : {
    GetSlideContainerWidth: function(){
      return {
        width: this.slideContainerWidth + "px"
      };
    },
    GetComponentsWidth : function(){
      return {
       
        width : this.slideComponentsWidth + "px"
      };
    },
    GetBottomWidth : function(){

      var sidebarComponentsPercentage = this.slideComponentsWidth / window.innerWidth * 100;
      var sidebarContainerPercentage = this.slideContainerWidth / window.innerWidth * 100;


      return {
        left : this.slideContainerWidth + "px",
        width: (100 - sidebarComponentsPercentage - sidebarContainerPercentage) + "%"
      };
    }
  },
  mounted(){
    console.log("editor page has mounted");
    if(this.$store.state.user != null){
      this.Init();
    }
  },
  methods : {
    ChangeSlideContainer(id, index){

      this.activeSlideContainerID = id;
      this.activeSlideContainerIndex = index;

      var slide_id = this.$store.state.currentProjekt.slide_containers[index].Slides.length === 0 ? null : this.$store.state.currentProjekt.slide_containers[index].Slides[0].id;
      this.activeSlideID = slide_id;


      console.log(this.activeSlideID);
    },
    ChangeSlide(id){

      console.log(id);
      this.activeSlideID = id;

      this.activeSlideIndex = this.$store.state.currentProjekt.slide_containers[this.activeSlideContainerIndex].Slides.findIndex(slide => slide.id === this.activeSlideID);

    },
    NextSlide(){
      var currentIndex = this.activeSlideIndex;
      var maxLength = this.$store.state.currentProjekt.slide_containers[this.activeSlideContainerIndex].Slides.length - 1;

      if(currentIndex < maxLength){
        this.activeSlideIndex = this.activeSlideIndex + 1;
      }else{
        this.activeSlideIndex = 0;
      }
      
      this.activeSlideID = this.$store.state.currentProjekt.slide_containers[this.activeSlideContainerIndex].Slides[this.activeSlideIndex].id;

      console.log(this.activeSlideIndex);
    },
    PrevSlide(){
      var currentIndex = this.activeSlideIndex;
      var maxLength = this.$store.state.currentProjekt.slide_containers[this.activeSlideContainerIndex].Slides.length - 1;

      if(currentIndex >= 1){
        this.activeSlideIndex = this.activeSlideIndex - 1;
      }else{
        this.activeSlideIndex = maxLength;
      }
      this.activeSlideID = this.$store.state.currentProjekt.slide_containers[this.activeSlideContainerIndex].Slides[this.activeSlideIndex].id;
    },
    Init(){
       this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(
        (response) => {

          this.$store.commit("SetProjekt", response.data);

          this.InitWebXR();
          

        }
      );
    },
    InitWebXR(){

      console.log(webXRScene);
      const webXRScene = new webXRScene("xr-scene");
    }
    
  }
}
</script>

<style lang="scss">
  .slide-container-navigation nav{
    padding: .5rem;
  }

  .slide-navigation-wrapper{
    display: flex;
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .slide-navigation{
    display: flex;
  }

  .slide-nav-button{
    padding: 1rem;
    height: 100%;
    background: #fff;
  }
  
  .add-slide{
    width:100px;
    min-width:100px;
    background:greenyellow;
    text-align: center;
    line-height: 100px;
  }
  .slide-component-settings {
    flex: 1;
  }

  .slide-navigation-wrapper::-webkit-scrollbar{display:none}
</style>