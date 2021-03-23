<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Settings"/>
    <template v-if="slide == null">
      <div class="slide-component">Kein Slide</div> 
    </template>

    <template v-if="slide != null">
        <div class="row">
        <TextField :object="slide" path="slide.Name" htmlTag="h3"/>
        </div>
        <div class="row">
          Template: {{slide.SlideTemplate.Name}}
        </div>
        <div class="row">
          CamPos : <VectorField :object="slide" path="slide.CameraPosition" />
        </div>
        <div class="row">
          CamTarget : <VectorField :object="slide" path="slide.CameraTarget" />
        </div>
        <div class="row">
          SlideOffset : <VectorField :object="slide" path="slide.SlideOffset" />
        </div>
    </template>
  </div>
</template>


<script>
import TextField from '../../TextField.vue';
import VectorField from '../../VectorField.vue';
import SidebarCompHeader from './SidebarCompHeader.vue';
export default {
  components: { TextField, VectorField, SidebarCompHeader },
  name : "SlideSettings",
  props : ["slide"],
  mounted(){
    console.log("SlideSettings mounted" , this.$props.slide);
  }

}
</script>