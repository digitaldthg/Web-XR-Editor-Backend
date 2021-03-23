import config from "../../../main.config";
import Utils from "../Common/Utils"

class Project {
    constructor(params) {
        this.id = params.id;
        this.Name = params.Name;
        this.author = params.author;
        this.slide_containers = params.slide_containers;
        console.log(this)
    }

    AddSlide(container, slide) {
        var targetContainer = this.slide_containers.filter(c => {
            return c.id == container.id;
        })
        targetContainer[0].Slides.push(slide);
        console.log("TARGET: ", targetContainer);
        Utils.Put(config.CMS_BASE_URL + "/slide-containers/" + container.id, {
            Slides: targetContainer[0].Slides
        }).then((response) => {
            console.log("Upadted SlideContainer:", response.data);
        });
    }


}

export default Project;