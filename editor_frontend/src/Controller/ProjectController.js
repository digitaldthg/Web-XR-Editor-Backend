import config from "../../../main.config";
import Utils from "../Common/Utils"

class Project {
    constructor(params) {
        this.id = params.id;
        this.Name = params.Name;
        this.author = params.author;
        this.slide_containers = params.slide_containers;
    }
}

export default Project;