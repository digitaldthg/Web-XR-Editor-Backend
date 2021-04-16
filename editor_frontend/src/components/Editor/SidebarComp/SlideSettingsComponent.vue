<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Settings"/>

    <template v-if="toggleOpen">
      
      <template v-if="slide == null">
        <div class="slide-component">Kein Slide</div> 
      </template>

      <template v-if="slide != null">
          <div class="row">
          <TextField :object="slide" path="slides.Name" htmlTag="h3"/>
          </div>
          <div class="row">
            Template: {{slide.SlideTemplate.Name}}
          </div>
          <div class="row">
            <VectorField title="Kamera Position" ref="camPos" :object="slide" path="slides.CameraPosition" ><button class="icon-button" @click="GetCamPos"><SpotIcon /></button></VectorField>
          </div>
          <div class="row">
            <VectorField title="Kamera Target" ref="targetPos" :object="slide" path="slides.CameraTarget" ><button class="icon-button" @click="GetTargetPos"><SpotIcon /></button></VectorField>
          </div>
          <div class="row">
            <VectorField title="SlideOffset" :object="slide" path="slides.SlideOffset" />
          </div>
      </template>
    </template>
  </div>
</template>


<script>
import ToggleMixin from '../../../Controller/ToggleMixin';
import TextField from '../../TextField.vue';
import VectorField from '../../VectorField.vue';
import SidebarCompHeader from './SidebarCompHeader.vue';

import SpotIcon from '../../../Images/Icons/spot.svg';
import ProjectMixin from '../../../Controller/ProjectMixin';


export default {
  components: { 
    TextField, 
    VectorField, 
    SidebarCompHeader ,
    SpotIcon
  },
  mixins: [ToggleMixin, ProjectMixin],
  name : "SlideSettings",
 // props : ["slides"],
  mounted(){
    //console.log("SlideSettings mounted" , this.$props.slides);
  },
  methods:{
    GetCamPos(){
      const camPos = this.$store.state.xr.Controls.GetPosition();
      this.$refs.camPos.SetValueFromOutside(camPos);
      console.log(camPos);
    },
    GetTargetPos(){
      const targetPos = this.$store.state.xr.Controls.GetTarget();
      this.$refs.targetPos.SetValueFromOutside(targetPos);
      console.log(targetPos);
    }
  }

}
</script>

<style scope lang="scss">
label{
  display: block;
  color:#aaa;
  font-size: 80%;
}
</style>