<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Settings"/>

    <template v-if="toggleOpen">
      <template v-if="slides == null">
        <div class="slide-component">Kein Slide</div> 
      </template>

      <template v-if="slides != null">
          <div class="row">
          <TextField :object="slides" path="slides.Name" htmlTag="h3"/>
          </div>
          <div class="row">
            Template: {{slides.SlideTemplate.Name}}
          </div>
          <div class="row">
            CamPos : <VectorField ref="camPos" :object="slides" path="slides.CameraPosition" ><button @click="GetCamPos">Pos</button></VectorField>
          </div>
          <div class="row">
            CamTarget : <VectorField ref="targetPos" :object="slides" path="slides.CameraTarget" ><button @click="GetTargetPos">Pos</button></VectorField>
          </div>
          <div class="row">
            SlideOffset : <VectorField :object="slides" path="slides.SlideOffset" />
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
export default {
  components: { TextField, VectorField, SidebarCompHeader },
  mixins: [ToggleMixin],
  name : "SlideSettings",
  props : ["slides"],
  mounted(){
    console.log("SlideSettings mounted" , this.$props.slides);
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