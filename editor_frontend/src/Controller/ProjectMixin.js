import IOMixin from "./IOMixin";
import config from '../../../main.config';

export default {
  mixins:[IOMixin],
  methods : {
    AddSlide(slideContainer) {
      this.Post(config.CMS_BASE_URL + "/slides", {
        Name : "New Slide",
      }).then((response) => {
        var container = slideContainer;
        container.Slides.push(response.data);
        return container;
      }).then(container => {
        this.Put( config.CMS_BASE_URL + "/slide-containers/" + container.id, container).then(response => {
          this.$store.commit("SetProjekt", response.data);
        });
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
    }
  }
}
