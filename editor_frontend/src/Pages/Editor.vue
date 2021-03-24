<template>
  <div class="page-editor">
    <aside class="slide-container-navigation" :style="GetSlideContainerWidth">
      <nav  v-if="this.$store.state.currentProjekt != null">        
        <SlideContainerLink 
          :active="slideContainer.id === activeSlideContainerID" 
          v-for="(slideContainer,index) in this.$store.state.currentProjekt.slide_containers" 
          v-bind:key="slideContainer.id" 
          :slideContainer="slideContainer"
          :ChangeSlideContainer="e => ChangeSlideContainer(slideContainer.id, index)"
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
    <template v-if="this.$store.state.currentProjekt != null" >
      <XRScene :slideIndex="activeSlideIndex" :containerIndex="activeSlideContainerIndex" />
    </template>
    

    <div class="slide-bottom-navigation" :style="GetBottomWidth">
      <div class="slide-navigation">
        <div class="slide-navigation-button">
          <button class="slide-nav-button" @click="PrevSlide">prev</button>
        </div>
        <nav class="slide-navigation-wrapper" v-if="this.$store.state.currentProjekt != null">
          <SlideLink 
            v-for="(slide,slideIndex) in this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides" 
            v-bind:key="slide.id"
            :slide="slide"
            :index="slideIndex"
            :active="slide.id === activeSlideID"
            :ChangeSlide="e => ChangeSlide(slide.id)"/>
          
          <div class="add-slide">
            <button @click="e => AddSlide(this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex])">+</button>
          </div>
        </nav>
        <div class="slide-navigation-button">
          <button  class="slide-nav-button" @click="NextSlide">next</button>
        </div>
      </div>
    </div>

    <aside class="slide-components" :style="GetComponentsWidth">
      <template v-if="this.$store.state.currentProjekt != null">
        <div class="slide-component-settings-tabbar">
          <div :class="'tabbar-selector tabbar-selector-active-' + (activeTab == 'scene')"><button @click="e => ChangeTab('scene')">Scene</button></div>
          <div :class="'tabbar-selector tabbar-selector-active-' + (activeTab == 'slide')"><button @click="e => ChangeTab('slide')">Slide</button></div>
        </div>
        <div class="slide-component-settings" v-if="activeTab == 'scene'">
          <SidebarContainerSettings :slideContainers="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex]"/>
        </div>
        <div class="slide-component-settings" v-if="activeTab == 'slide'">
          
          <SlideHierarchie :slide="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides[activeSlideIndex]"/>

          <SlideSettings :slides="this.$store.state.currentProjekt.slide_containers[activeSlideContainerIndex].Slides[activeSlideIndex]"/>

          <LightPresets />

        </div>
        <SaveComponent />

      </template>
    </aside>
  </div>
</template>


<script src="./EditorController.js"></script>

<style scoped>
@import url("../scss/pages/editor.scss");
</style>