
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
import SelectedInfoComponent from '../Components/Editor/SidebarComp/SelectedInfoComponent.vue';
import PrimitiveComponent from '../Components/Editor/SidebarComp/PrimitiveComponent.vue';

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
    SelectedInfoComponent,
    PrimitiveComponent
  },
  data(){
    return {
      slideContainerWidth: 50,
      slideComponentsWidth :400,
      activeSlideContainerID : null,
      activeSlideContainerIndex : null,
      activeSlideID : null,
      activeSlideIndex : null,
      activeTab : "slide"
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
      this.$store.commit("SetSlideIndex",  0);
      this.activeSlideContainerID = this.$store.state.currentProjekt.slide_containers[0].id;
      this.activeSlideContainerIndex = 0;
      this.$store.commit("SetSlideContainerIndex",  0);
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
    console.log("editor page has mounted", this.$store.state.currentProjekt);
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

      this.$store.commit("SetSlideContainerIndex", index);
      console.log(this.activeSlideID);
    },
    ChangeTab(tab){
      console.log(tab);
      this.activeTab = tab;
    },
    ChangeSlide(id){

      console.log(id);
      this.activeSlideID = id;

      var index = this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides.findIndex(slide => slide.id === this.activeSlideID);

      this.$store.commit("SetSlideIndex", index);
    },
    NextSlide(){
      var currentIndex = this.$store.state.slideIndex;//this.activeSlideIndex;
      var maxLength = this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides.length - 1;

      if(currentIndex < maxLength){
        currentIndex = currentIndex + 1;
      }else{
        currentIndex = 0;
      }
      
      this.activeSlideID = this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides[currentIndex].id;
      
      console.log("nextSlide " , currentIndex);
      this.$store.commit("SetSlideIndex", currentIndex);
    },
    PrevSlide(){
      var currentIndex = this.$store.state.slideIndex;
      var maxLength = this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides.length - 1;

      if(currentIndex >= 1){
        currentIndex = currentIndex - 1;
      }else{
        currentIndex = maxLength;
      }
      this.activeSlideID = this.$store.state.currentProjekt.slide_containers[this.$store.state.slideContainerIndex].Slides[currentIndex].id;
      this.$store.commit("SetSlideIndex", currentIndex);
    },
    Init(){
       this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(
        (response) => {

          this.$store.commit("SetProjekt", response.data);

          

        }
      );
    },
   
    
  }
}