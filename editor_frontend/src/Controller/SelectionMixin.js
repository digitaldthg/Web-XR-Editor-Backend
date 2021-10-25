import {EventManager} from '../Events/EventManager';

//@vuese
//@group Mixins
// Dieses Mixin kann im Editor eingesetzt werden um ein Object3D zu selektieren
export default {
  name: "SelectionMixin",
  data() {
    return {slideElements: null}
  },
  mounted() {
    EventManager.$on("3DSelect", this.Select3D);
    EventManager.$on("3DDeselect", this.Deselect3D);
  },
  methods: {
    // @vuese
    // Selektiert ein 3D Objekt
    // @arg Object3D welches selektiert werden soll
    Select3D(mesh) {
      this.slideElements = mesh;
      this.$store.commit("SetSelection", mesh);
    },

    // @vuese
    // Deselektiert ein 3D Objekt
    Deselect3D() {
      this.slideElements = null;
      this.$store.commit("SetSelection", null);
    }
  }
}
