import IOMixin from "./IOMixin";
import config from '../../../main.config';

// @vuese
// @group Mixins
// In eine Component eingesetzt hält es die Informationen zum aktuellen Slide sowie zum aktuellen SlideContainer
export default {
  mixins: [IOMixin],
  data() {
    return {slide: null, slideContainer: null}
  },
  watch: {
    "$store.state.currentProjekt": function () {
      if (this.$store.state.currentProjekt === null) {
        this.slide = null;
        this.slideContainerIndex = null;
        return;
      }
      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
      this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
    },
    "$route.params.slideIndex": function () {
      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    },
    "$route.params.slideContainerIndex": function () {
      this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
      this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
    }
  },
  mounted() {
    if (this.$store.state.currentProjekt === null) {
      return;
    }
    this.slide = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex].Slides[this.$route.params.slideIndex];
    this.slideContainer = this.$store.state.currentProjekt.slide_containers[this.$route.params.slideContainerIndex];
  },
  methods: {
    /**
     * @vuese
     * Holt das aktuelle Projekt anhand der route.params.id und setzt es als aktuelles Projekt im Store("SetProjekt")
     * <br><br>=> returned Promise<Projekt>
     */
    GetProjekt() {
      return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(response => {
        this.$store.commit("SetProjekt", response.data);

        return response.data;
      });
    },
    /**
     * @vuese
     * Fügt ein Slide zum slideContainer hinzu
     * <br><br>=> returned ein Promise<slideContainer>
     * @arg slideContainer 
     */
    AddSlide(slideContainer) {
      console.log("%c Projektmixin legt neues Slide an", "background:tomato;color:#fff;");
      return this.Post(config.CMS_BASE_URL + "/slides", {
        Name: "New Slide",
        author: this.$store.state.currentProjekt.author
      }).then((response) => {
        var container = slideContainer;
        container.Slides.push(response.data);
        return container;
      }).then(container => {
        
        return this.Put(config.CMS_BASE_URL + "/slide-containers/" + container.id, container);

      }).then(this.GetProjekt);
    },
    /**
     * @vuese
     * Fügt einen SlideContainer zum Projekt hinzu
     * <br><br>=> returned ein Promise<Projekt>
     */
    AddContainer() {
      this.Post(config.CMS_BASE_URL + "/slide-containers").then((response) => {
        const container = response.data;
        var containers = this.$store.state.currentProjekt.slide_containers;

        containers.push(container);
        const id = this.$store.state.currentProjekt.id;

        this.Put(config.CMS_BASE_URL + "/projekts/" + id, {slide_containers: containers}).then(this.GetProjekt);
      });
    },
    /**
     * @vuese
     * Fügt dem aktuellen Slide ein Element hinzu. 
     * <br><br>1. Lädt das Element zum CMS hoch(POST)
     * <br>2. Erstellt ein SlideElement mit dem neuen Element und lädt das zum CMS(POST)
     * <br>3. Fügt das SlideElement zum Slide hinzu (POST)
     * <br>4. Aktualisiert das Projekt
     * <br><br>=> returned Promise<Projekt>
     * 
     * @arg Element
     */
    AddElement(Element) {

      return this.Post(config.CMS_BASE_URL + "/elements", Element).then(response => {
        return response.data;
      }).then((element) => {
        
        var SlideElement = {
          Name: element.Name,
          element: element
        }
        return this.Post(config.CMS_BASE_URL + "/slide-elements", SlideElement);
      }).then(response => {
        var slideElement = response.data;

        var slideContainerIndex = this.$store.state.slideContainerIndex;
        var slideIndex = this.$store.state.slideIndex;

        var currentSlide = this.$store.state.currentProjekt.slide_containers[slideContainerIndex].Slides[slideIndex];
        var sElements = currentSlide.SlideElements;
        // var sElements = [... this.$props.slide.SlideElements];

        sElements.push(slideElement);

        // PUT SlideElements update
        return this.Put(config.CMS_BASE_URL + "/slides/" + currentSlide.id, {SlideElements: sElements})

      }).then(this.GetProjekt);

    },
    /**
     * @vuese
     * Löscht den SlideContainer anhand der ID
     * <br><br>1. Löscht alle SlideElements im SlideContainer
     * <br>2. Löscht alle enhaltenen Slides
     * <br>3. Löscht den SlideContainer mit ID
     * @arg {number} containerID 
     * <br>=> returned Promise<Projekt> 
     */
    DeleteSlideContainer(containerID) {
      console.log("delete", containerID, this.$store.state.currentProjekt);

      const slideContainerToDelete = this.$store.state.currentProjekt.slide_containers.find(sCont => sCont.id === containerID);
      const slideContainerToDeleteIndex = this.$store.state.currentProjekt.slide_containers.findIndex(sCont => sCont.id === containerID);
      
      if (this.$store.state.slideContainerIndex === slideContainerToDeleteIndex) {
        this.$router.push({
          params: {
            slideContainerIndex: slideContainerToDeleteIndex - 1,
            slideIndex: 0
          }
        });
      }

      
      const sElementPromises = slideContainerToDelete.Slides.map(slide => {
        return slide.SlideElements.map(sElement => this.Delete(config.CMS_BASE_URL + "/slide-elements/" + sElement.id));
      });

      return Promise.all(sElementPromises).then(() => {
        return slideContainerToDelete.Slides.map(slide => {
          return this.Delete(config.CMS_BASE_URL + "/slides/" + slide.id);
        });

      }).then((slidePromises) => {

        return Promise.all(slidePromises).then(() => {

          return this.Delete(config.CMS_BASE_URL + "/slide-containers/" + containerID).then(() => {}).then(this.GetProjekt);
        });
      });

    }
  }
}
