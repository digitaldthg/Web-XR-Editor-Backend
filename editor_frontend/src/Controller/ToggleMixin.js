// @vuese
// @group Mixins
// Dieses Mixin kann genutzt werden um die UI-Sections zu togglen
export default {
  name : "ToggleMixin",
  data() {
    return {toggleOpen: true}
  },
  methods: {
    ChangeVisibility(boolean) {
      this.toggleOpen = boolean;
    }
  }
}
