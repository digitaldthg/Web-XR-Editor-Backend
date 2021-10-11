<template>
  <div class="page-editor">
    <aside class="slide-container-navigation" :style="GetSlideContainerWidth">
      <nav v-if="this.$store.state.currentProjekt != null">
        <SlideContainerLink
          v-for="(slideContainer, index) in $store.state.currentProjekt
            .slide_containers"
          :active="index === $store.state.slideContainerIndex"
          v-bind:key="slideContainer.id"
          :slideContainerObject="slideContainer"
          :ChangeSlideContainer="
            (e) => ChangeSlideContainer(slideContainer.id, index)
          "
        />
        <div class="slide-container">
          <div class="slide-container-inner">
            <button @click="AddContainer">
              +
            </button>
          </div>
        </div>
      </nav>
    </aside>

    <Toolbar />

    <template v-if="this.$store.state.currentProjekt != null">
      <XRScene />
    </template>

    <div class="slide-bottom-navigation" :style="GetBottomWidth">
      <div class="slide-navigation">
        <div class="slide-navigation-button">
          <button class="icon-button slide-nav-button" @click="PrevSlide">
            <PreviousIcon />
          </button>
        </div>
        <nav class="slide-navigation-wrapper" v-if="slideContainer != null">
          <SlideLink
            v-for="(custom_slide, slideIndex) in slideContainer.Slides"
            v-bind:key="custom_slide.id"
            :slide="custom_slide"
            :index="slideIndex"
            :active="slideIndex === $store.state.slideIndex"
            :ChangeSlide="(e) => ChangeSlide(custom_slide.id)"
          />

          <div class="add-slide">
            <button @click="(e) => this.HandleAddSlide(slideContainer)">
              +
            </button>
          </div>
        </nav>
        <div class="slide-navigation-button">
          <button class="icon-button slide-nav-button" @click="NextSlide">
            <NextIcon />
          </button>
        </div>
      </div>
    </div>

    <aside class="slide-components" :style="GetComponentsWidth">
      <div class="slide-component-settings">
        <SlideHierarchie />
      </div>

      <template v-if="this.$store.state.currentProjekt != null">
        <div class="slide-component-settings">
          <div class="grid-layout">
            <div class="slide-component-settings-tabbar">
              <div
                :class="
                  'tabbar-selector tabbar-selector-active-' +
                    (activeTab == 'scene')
                "
              >
                <button @click="(e) => ChangeTab('scene')">Scene</button>
              </div>
              <div
                :class="
                  'tabbar-selector tabbar-selector-active-' +
                    (activeTab == 'slide')
                "
              >
                <button @click="(e) => ChangeTab('slide')">Slide</button>
              </div>
              <div
                :class="
                  'tabbar-selector tabbar-selector-active-' +
                    (activeTab == 'object')
                "
              >
                <button @click="(e) => ChangeTab('object')">3D Objekt</button>
              </div>
            </div>
            <div
              class="slide-component-settings flex-3"
              v-if="activeTab == 'scene'"
            >
              <SidebarContainerSettings
                :slideContainers="
                  this.$store.state.currentProjekt.slide_containers[
                    $route.params.slideIndex
                  ]
                "
              />
            </div>
            <div
              class="slide-component-settings flex-3"
              v-if="activeTab == 'slide'"
            >
              <SlideSettings />
              <LightPresets />
            </div>

            <div
              class="slide-component-settings flex-3"
              v-if="activeTab == 'object'"
            >
              <SelectedComponent />
              <TransformComponent />
              <PrimitiveComponent />
              <TextComponent />
            </div>
          </div>
        </div>
      </template>

      <div class="slide-component-settings">
        <FilesComponent />
      </div>
    </aside>
  </div>
</template>

<script src="./EditorController.js"></script>

<style scoped>
.page-editor {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.slide-components {
  position: absolute;
  width: 200px;
  top: 70px;
  height: calc(100% - 70px);
  z-index: 1;
  display: grid;
  right: 0;
  padding: 1rem;
  pointer-events: all;
  grid-template-rows: auto 5fr auto;
}

.slide-components::-webkit-scrollbar {
  display: none;
}

.slide-container-navigation nav {
  padding: 0.5rem;
}
.page-editor {
  height: 100%;
}
.slide-navigation-wrapper {
  display: flex;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.slide-navigation {
  display: flex;
}

.slide-navigation-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.slide-nav-button {
  width: 50px;
  height: 50px;
  box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-slide {
  width: 100px;
  min-width: 100px;
  text-align: center;
  line-height: 100px;
}

.add-slide button {
  width: 50px;
  height: 50px;
  color: #fff;
  background: #aaa;
  border-radius: 5px;
  font-size: 2rem;
  line-height: 50px;
  margin: 0;
  padding: 0;
  vertical-align: middle;
}

.slide-component-settings {
  margin-bottom: 1rem;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0.25rem 0.25rem 0.75rem 0 rgb(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: scroll;

  -webkit-overflow-scrolling: touch;
}

.slide-component-settings::-webkit-scrollbar {
  display: none;
}
.slide-navigation-wrapper::-webkit-scrollbar {
  display: none;
}

.slide-container-navigation {
  position: absolute;
  width: 50px;
  z-index: 1;
  height: calc(100% - 70px);
  top: 70px;
}

.slide-scene-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
}

.slide-bottom-navigation {
  position: absolute;
  bottom: 0;
  padding: 1rem;
  background: #b0b0b026;
  border-radius: 15px 15px 0 0;
}

.slide-component {
  background: #fff;
  padding: 1rem;
  pointer-events: all;
  user-select: none;
  border-bottom: 1px solid #eee;
}

.slide-component:last-child {
  border-bottom: 0;
}

.slide-component .header {
  padding: 1rem;
  margin: -1rem;
  margin-bottom: 0;
  border-radius: 5px 5px 0 0;
}

.slide-component .header-open-false {
  margin-bottom: -1rem;
}

.slide-component-settings-tabbar {
  display: flex;
  z-index: 9999;
  bottom: -1px;
  position: relative;
  pointer-events: all;
}

.tabbar-selector {
  position: relative;
}

.tabbar-selector button {
  background: #eee;
  border: 1px solid;
  border-radius: 5px 5px 0 0;
  border-bottom: 0;
  padding: 0.5rem 1rem;
}

.tabbar-selector-active-true button {
  font-weight: 700;
  background: #fff;
  text-decoration: underline;
}

.tabbar-selector-active-false:after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #000;
}

.tabbar-selector-active-true:after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #fff;
}
</style>
