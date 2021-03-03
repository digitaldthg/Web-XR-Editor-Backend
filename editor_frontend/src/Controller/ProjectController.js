import config from "../../../main.config";
import Utils from "../Common/Utils"

class Project {
    constructor(params) {
        this.id = params.id;
        this.name = params.Name;
        this.author = params.author;
        this.slidecontainers = params.slide_containers;
        console.log(this)
    }

    AddSlide(container, slide) {
        var targetContainer = this.slidecontainers.filter(c => {
            console.log(c);
            return c.id = container.id;
        })
        targetContainer[0].Slides.push(slide);
        console.log("TARGET: ", targetContainer);
        Utils.Put(config.CMS_BASE_URL + "/slide-containers/" + container.id, {
            Slides: targetContainer[0].Slides
        }).then((response) => {
            console.log("Upadted SlideContainer:", response.data);
        });
    }

    AddContainer(container) {
        this.slidecontainers.push(container);
        this.Upload();
    }

    Upload() {
        console.log("Upload Project to CMS");
        Utils.Put(config.CMS_BASE_URL + "/projekts/" + this.id, {
            Name: this.name,
            slide_containers: this.slidecontainers
        }).then((response) => {
            console.log("Upadted project:", response.data);
        });

    }


}

export default Project;