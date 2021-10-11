import IOMixin from "./IOMixin";
import config from '../../../main.config';
/**
 * 
 */
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
      if(this.$store.state.currentProjekt === null){
        this.slide = null;
        this.slideContainerIndex = null;
        return;}
      
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
    /**
     * Holt das aktuelle Projekt anhand der route.params.id und setzt es als aktuelles Projekt im Store
     * @returns Projekt
     */
    GetProjekt(){
      return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(response =>{
        this.$store.commit("SetProjekt", response.data);
      });
    },
    /**
     * Fügt ein Slide zum SlideContainer hinzu
     * @param {object} slideContainer 
     * @returns 
     */
    AddSlide(slideContainer) {
      console.log("%c Projektmixin legt neues Slide an", "background:tomato;color:#fff;");
      return this.Post(config.CMS_BASE_URL + "/slides", {
        Name : "New Slide",
        author : this.$store.state.currentProjekt.author
      }).then((response) => {
        var container = slideContainer;
        container.Slides.push(response.data);
        return container;
      }).then(container => {
        console.log("PUT container", container);
        return this.Put( config.CMS_BASE_URL + "/slide-containers/" + container.id, container);
      
      }).then(this.GetProjekt);
    },
    /**
     * Fügt einen SlideContainer zum Projekt hinzu
     */
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
        }).then(this.GetProjekt);
      });
    },
    /**
     * Fügt dem aktuellen Slide ein Element hinzu und aktualisiert im Anschluss das Projekt
     * @param {object} Element 
     * @returns 
     */
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

      }).then(this.GetProjekt);

    },
    /**
     * Löscht den SlideContainer mit containerID
     * @param {number} containerID 
     */
    DeleteSlideContainer(containerID){
      console.log("delete" , containerID, this.$store.state.currentProjekt);
      
      const slideContainerToDelete = this.$store.state.currentProjekt.slide_containers.find( sCont => sCont.id === containerID);
      const slideContainerToDeleteIndex = this.$store.state.currentProjekt.slide_containers.findIndex( sCont => sCont.id === containerID);


      console.log("findIndex " , slideContainerToDeleteIndex);
      if(this.$store.state.slideContainerIndex === slideContainerToDeleteIndex){
        this.$router.push({ params: {
          slideContainerIndex : slideContainerToDeleteIndex - 1,
          slideIndex : 0
        }});
      }
      
      console.log("delete" , slideContainerToDelete);

      //1. Delete all slideelements
      //2. Delete all slides
      //3. Delete SlideContainer
      const sElementPromises = slideContainerToDelete.Slides.map(slide => {
        return slide.SlideElements.map(sElement => this.Delete(config.CMS_BASE_URL + "/slide-elements/"+sElement.id));
      });

      Promise.all(sElementPromises).then(()=>{

        console.log("alle enthaltenen Slideelements wurden gelöscht");

        return slideContainerToDelete.Slides.map(slide => {
          return this.Delete(config.CMS_BASE_URL + "/slides/"+slide.id);
        });

      }).then((slidePromises)=>{
       
        Promise.all(slidePromises).then(()=>{

          console.log("alle enthaltenen Slides wurden gelöscht");
          
          return this.Delete(config.CMS_BASE_URL + "/slide-containers/" + containerID).then(()=>{
        
            console.log("Der SlideContainer wurde gelöscht");

          }).then(this.GetProjekt);
        });
      });

    }
  }
}
