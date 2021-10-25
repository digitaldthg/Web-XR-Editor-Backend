<template>
  <div :class="'slide-container slide-container-active-' + active">
    <div class="slide-container-inner">
      <button
        :title="slideContainerObject.Name"
        @contextmenu="HandleContextMenu"
        @click="ChangeSlideContainer"
        :style="{
          'background-image':
            'url(' +
            (slideContainerObject.PreviewImage === null
              ? FallbackImage
              : config.CMS_BASE_URL + slideContainerObject.PreviewImage.url) +
            ')',
        }"
      ></button>
    </div>

    <template v-if="contextOpen">
      <div class="context-menu">
        <button
          @click="(e) => DeleteSlideContainer(slideContainerObject.id)"
          class="cta-button-small --warning"
        >
          Löschen
        </button>
        <button @click="Cancel" class="cta-button-small --cancel">
          Abbrechen
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import ProjectMixin from "../../Controller/ProjectMixin";
import config from "../../../../main.config";
import FallbackImage from "../../Images/placeholder.jpg";

//@group UI
// Verlinkt auf einen SlideContainer
export default {
  name: "SlideContainerLink",
  mixins: [ProjectMixin],
  props: ["slideContainerObject", "active", "ChangeSlideContainer"],
  data() {
    return {
      FallbackImage: FallbackImage,
      config: config,
      contextOpen: false,
    };
  },
  methods: {
    HandleContextMenu(e) {
      e.preventDefault(e);

      this.contextOpen = true;
    },
    Cancel() {
      this.contextOpen = false;
    },
  },
};
</script>

<style lang="scss">
.context-menu {
  position: absolute;
  right: -130px;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  top: 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  button {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.slide-container-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;

  border-radius: 5px;

  button {
    background-size: cover;
  }
}

.slide-container {
  width: 100%;
  position: relative;
  background: #eee;
  border-radius: 5px;
  margin-bottom: 0.5rem;

  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
}

.slide-container-active-true {
  border: 2px solid #000;
  border-radius: 7px;
}

.slide-container-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.slide-container button {
  width: 100%;
  height: 100%;
  border: 0;
  background-color: transparent;
  outline: 0;

  &:active,
  &:visited,
  &:focus {
    outline: 0;
  }
}
</style>
