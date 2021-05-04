<template>
  <div class="page-editor">
    <aside class="slide-container-navigation" :style="GetSlideContainerWidth">
      <nav  v-if="this.$store.state.currentProjekt != null">        
        <SlideContainerLink 
          v-for="(slideContainer,index) in $store.state.currentProjekt.slide_containers" 
          :active="index === $store.state.slideContainerIndex" 
          v-bind:key="slideContainer.id" 
          :slideContainerObject="slideContainer"
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
      <XRScene />
    </template>
    

    
    <div class="slide-bottom-navigation" :style="GetBottomWidth">
      <div class="slide-navigation">
        <div class="slide-navigation-button">
          <button class="icon-button slide-nav-button" @click="PrevSlide"><PreviousIcon/></button>
        </div>
        <nav class="slide-navigation-wrapper" v-if="slideContainer != null">
          <SlideLink 
            v-for="(custom_slide,slideIndex) in slideContainer.Slides" 
            v-bind:key="custom_slide.id"
            :slide="custom_slide"
            :index="slideIndex"
            :active="slideIndex === $store.state.slideIndex"
            :ChangeSlide="e => ChangeSlide(custom_slide.id)"
            
            />
          
          <div class="add-slide">
            <button @click="e => AddSlide(slideContainer)">+</button>
          </div>
        </nav>
        <div class="slide-navigation-button">
          <button  class="icon-button slide-nav-button" @click="NextSlide"><NextIcon /></button>
        </div>
      </div>
    </div>



    <aside class="slide-components" :style="GetComponentsWidth">

      <div class="slide-component-settings" >
        <SlideHierarchie />
      </div>


      <template v-if="this.$store.state.currentProjekt != null">
        <div class="slide-component-settings">
          <div class="grid-layout">
            <div class="slide-component-settings-tabbar">
              <div :class="'tabbar-selector tabbar-selector-active-' + (activeTab == 'scene')"><button @click="e => ChangeTab('scene')">Scene</button></div>
              <div :class="'tabbar-selector tabbar-selector-active-' + (activeTab == 'slide')"><button @click="e => ChangeTab('slide')">Slide</button></div>
              <div :class="'tabbar-selector tabbar-selector-active-' + (activeTab == 'object')"><button @click="e => ChangeTab('object')">3D Objekt</button></div>
            </div>
            <div class="slide-component-settings flex-3" v-if="activeTab == 'scene'">
              <SidebarContainerSettings :slideContainers="this.$store.state.currentProjekt.slide_containers[$route.params.slideIndex]"/>
            </div>
            <div class="slide-component-settings flex-3" v-if="activeTab == 'slide'">
              
              <SlideSettings />
              <LightPresets />
            </div>
            
            <div class="slide-component-settings flex-3" v-if="activeTab == 'object'">
              <SelectedComponent />
              <TransformComponent />
              <PrimitiveComponent />
              <TextComponent />
            </div>
          </div>
        </div>
      </template>

      
      <div class="slide-component-settings" >
        <FilesComponent />
      </div>
    </aside>
  </div>
</template>


<script src="./EditorController.js"></script>

<style scoped>
@import url("../scss/pages/editor.scss");
</style>