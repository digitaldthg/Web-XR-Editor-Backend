
import SlideContainerLink from '../Components/Editor/SlideContainerLink';
import SlideLink from '../Components/Editor/SlideLink';
import IOMixin from "../Controller/IOMixin";
import ProjectMixin from '../Controller/ProjectMixin';
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";
import config from '../../../main.config';


import Toolbar from '../Components/Editor/Toolbar/Toolbar';

//Components für die Sidebar
import SidebarContainerSettings from '../Components/Editor/SidebarComp/SlideContainerSettings';
import FilesComponent from '../Components/Editor/SidebarComp/FilesComponent';
import SaveComponent from '../Components/Editor/SidebarComp/SaveComponent';
import SlideSettings from '../Components/Editor/SidebarComp/SlideSettingsComponent';
import SlideHierarchie from '../Components/Editor/SidebarComp/SlideHierarchieComponent.vue';
import LightPresets from '../Components/Editor/SidebarComp/LightPresetsComponent.vue';

import SelectedComponent from '../Components/Editor/SidebarComp/SelectedComponent.vue';
import TransformComponent from '../Components/Editor/SidebarComp/TransformComponent.vue';

import PrimitiveComponent from '../Components/Editor/SidebarComp/PrimitiveComponent.vue';
import TextComponent from '../Components/Editor/SidebarComp/TextComponent.vue';

import NextIcon from '../Images/Icons/next.svg';
import PreviousIcon from '../Images/Icons/previous.svg';


//XR
import XRScene from '../Components/Editor/XRScene.vue';

export default {
  name : "EditorPage",
  mixins: [IOMixin, DataBehaviourMixin,ProjectMixin],
  components:{
    SlideContainerLink,
    SlideLink,
    SidebarContainerSettings,
    SaveComponent,
    SlideSettings,
    SlideHierarchie,
    XRScene,
    LightPresets,
    Toolbar,
    FilesComponent,
    TransformComponent,
    SelectedComponent,
    PrimitiveComponent,
    TextComponent,
    PreviousIcon,
    NextIcon
  },
  data(){
    return {
      slideContainerWidth: 50,
      slideComponentsWidth :400,
      activeSlideContainerID : null,
      activeSlideContainerIndex : null,
      activeSlideIndex : null,
      activeTab : "object"
    }
  },
  watch : {
    "$store.state.user" : function(){
      this.Init();
    },
    
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
    console.log("editor page has mounted", this.$store.state.currentProjekt);
    // if( this.$store.state.currentProjekt === null){
    //   this.$router.push("/home");
    //   //return;
    // }

    if(this.$store.state.user != null){
      this.Init();
    }


  },
  methods : {
    ChangeSlideContainer(id, index){

      this.$store.commit("SetSlideContainerIndex", index);

      this.$router.push({
        params:{
          slideContainerIndex : index,
          slideIndex : 0
        }
      });
    },
    ChangeTab(tab){
      console.log(tab);
      this.activeTab = tab;
    },
    ChangeSlide(id){
      
      var index = this.slideContainer.Slides.findIndex(slide => slide.id === id);

      this.$store.commit("SetSlideIndex", index);

      this.$router.push({ params: {
        slideIndex : index
      }})


    },
    NextSlide(){
      var currentIndex = parseFloat(this.$route.params.slideIndex);//this.activeSlideIndex;

      var maxLength = this.slideContainer.Slides.length - 1;
      
      if(currentIndex < maxLength){
        currentIndex = currentIndex + 1;
      }else{
        currentIndex = 0;
      }
      console.log("currentIndex" , currentIndex, this.slideContainer.Slides[currentIndex]);
      
      var slideID = this.slideContainer.Slides[currentIndex].id;
      
      this.ChangeSlide(slideID);
      
    },
    PrevSlide(){
      var currentIndex = parseFloat(this.$route.params.slideIndex);
      var maxLength = this.slideContainer.Slides.length - 1;

      if(currentIndex >= 1){
        currentIndex = currentIndex - 1;
      }else{
        currentIndex = maxLength;
      }
      var slideID = this.slideContainer.Slides[currentIndex].id;
      this.ChangeSlide(slideID);
    },
    Init(){

     

     

      
      this.$nextTick(()=>{
        
        this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(
          (response) => {
            
            this.$store.commit("SetProjekt", response.data);
            
          }).then(()=>{
            const slideIndex = parseFloat(this.$route.params.slideIndex);
            const slideContainerIndex = parseFloat(this.$route.params.slideContainerIndex);
            
            this.$store.commit("SetSlideIndex" , slideIndex);
            this.$store.commit("SetSlideContainerIndex" , slideContainerIndex);

            console.log("slideIndex" , slideIndex);
        }).catch(console.log);

      });
    },
   
    
  }
}