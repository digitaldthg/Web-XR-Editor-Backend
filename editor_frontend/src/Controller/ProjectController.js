import config from "../../../main.config";
import Utils from "../Common/Utils"

class Project {
    constructor(params) {
        this.id = params.id;
        this.Name = params.Name;
        this.slidecontainers = params.slide_containers;
        console.log(this)
    }

    AddSlide(container, slide) {
        var targetContainer = this.slidecontainers.filter(c => {
            return c.id == container.id;
        })

        if(targetContainer.length = 0){
            return;
        }
        targetContainer[0].Slides.push(slide);
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
        Utils.Put(config.CMS_BASE_URL + "/projekts/" + this.id, {
            Name: this.Name,
            slide_containers: this.slidecontainers
        }).then((response) => {
        });

    }


}

export default Project;