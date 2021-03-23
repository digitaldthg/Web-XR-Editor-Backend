<template>
  <div :class="'slide-container slide-container-active-'+active">
    <div class="slide-container-inner">
      <button @click="ChangeSlideContainer">{{slideContainer.id}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name : "SlideContainerLink",
  props : [
    "slideContainer","active",
    "ChangeSlideContainer"
  ],
  methods:{}
}

</script>

<style lang="scss" >
.slide-container{
  width:100%;
  position: relative;
  background:#eee;
  border-radius:5px;
  margin-bottom: .5rem;
  &:before{
    content:'';
    display: block;
    padding-top: 100%;
  }
}

.slide-container-active-true{
  box-shadow: inset 0 0 0 2px red;
}

.slide-container-inner{
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
}

.slide-container button{
  width:100%;
  height:100%;
  border: 0;
  padding:0;
  background: transparent;
  outline: 0;

  &:active,
  &:visited,
  &:focus{
    outline: 0;
  }
}
</style>