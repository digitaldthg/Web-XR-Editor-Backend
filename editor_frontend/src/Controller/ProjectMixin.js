import IOMixin from "./IOMixin";
import config from '../../../main.config';

export default {
  mixins:[IOMixin],
  data(){
    return {
      slide : null,
      slideContainer : null
    }
  },
  watch:{
    "$store.state.currentProjekt" : function(){
      console.log(this.$store.state.currentProjekt);

      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
      this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
      console.log("change currentProjekt");
    },
    "$route.params.slideIndex" : function(){
      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    },
    "$route.params.slideContainerIndex" : function(){
      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
      this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
      console.log("change SlideContainerINdex");
    }
  },
  mounted(){
    if(this.$store.state.currentProjekt === null){return;}
    this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
  },
  methods : {
    AddSlide(slideContainer) {
      console.log("%c Projektmixin legt neues Slide an", "background:tomato;color:#fff;");
      this.Post(config.CMS_BASE_URL + "/slides", {
        Name : "New Slide",
      }).then((response) => {
        var container = slideContainer;
        container.Slides.push(response.data);
        return container;
      }).then(container => {
        return this.Put( config.CMS_BASE_URL + "/slide-containers/" + container.id, container);
      }).then(response =>{
        console.log(response);

        return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id);
        //this.$store.commit("SetProjekt", response.data);
      }).then(response =>{
        this.$store.commit("SetProjekt", response.data);
      });
    },
    AddContainer(){
      this.Post(
        config.CMS_BASE_URL + "/slide-containers"
      ).then((response) => {
        const container = response.data;
        var containers = this.$store.state.currentProjekt.slide_containers;

        containers.push(container);
        const id = this.$store.state.currentProjekt.id;

        this.Put(config.CMS_BASE_URL + "/projekts/" + id, {
            slide_containers: containers
        }).then((response) => {
          this.$store.commit("SetProjekt", response.data);
        });
      });
    },
    AddElement(Element){
      
      return this.Post(config.CMS_BASE_URL + "/elements", Element).then(response => {
        return response.data;
      }).then((element) =>{
        console.log("%c 1. Element" ,"background:tomato; color:#fff;");
        console.log("received element" , element);
        
        var SlideElement = {
          Name : element.Name,
          element : element
        }
        return this.Post(config.CMS_BASE_URL + "/slide-elements" , SlideElement);
      }).then(response =>{

        console.log("%c 2. slideElement" ,"background:tomato; color:#fff;");
        
        var slideElement = response.data;

        console.log("received slideELement" , slideElement);
        var slideContainerIndex = this.$store.state.slideContainerIndex;
        var slideIndex = this.$store.state.slideIndex;
        
        var currentSlide = this.$store.state.currentProjekt.slide_containers[slideContainerIndex].Slides[slideIndex];
        var sElements = currentSlide.SlideElements;
        //var sElements = [... this.$props.slide.SlideElements];

          sElements.push(slideElement);

          //PUT SlideElements update
          return this.Put(config.CMS_BASE_URL + "/slides/" + currentSlide.id , {
            SlideElements : sElements
          })

      }).then(response =>{
        console.log("%c 3. Slide" ,"background:tomato; color:#fff;");
        console.log("final new Slides" , response.data);

        return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id);
      }).then(response =>{
        console.log("%c 4. Projekt" ,"background:tomato; color:#fff;");
        console.log("Get Complete Response for new Slide" , response);

        this.$store.commit("SetProjekt", response.data);

        return response.data;
      }).then(projekt =>{
        console.log("%c 4. Final" ,"background:tomato; color:#fff;");
        console.log("projekt" , projekt);
        return projekt;
      });

    }
  }
}
