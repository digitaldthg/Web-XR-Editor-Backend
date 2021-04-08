import {EventManager} from '../Events/EventManager';

export default {
  data(){
    return {
      slideElements : null
    }
  },
  mounted(){
    EventManager.$on("3DSelect", this.Select3D);
    EventManager.$on("3DDeselect", this.Deselect3D);
  },
  methods:{
    Select3D(mesh){
      this.slideElements = mesh;
    },
    Deselect3D(){
      this.slideElements = null;
    }
  }
}