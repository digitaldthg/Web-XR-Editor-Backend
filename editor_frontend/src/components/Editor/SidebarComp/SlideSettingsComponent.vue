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
            <label>Template</label>
            {{slide.SlideTemplate.Name}}
          </div>
          <div class="row">
            <label>Screenshot</label>
            <button class="cta-button" @click="TakeScreenshot">Take Screenshot</button>
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
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

export default {
  components: { 
    TextField, 
    VectorField, 
    SidebarCompHeader ,
    SpotIcon
  },
  mixins: [ToggleMixin, ProjectMixin, IOMixin],
  name : "SlideSettings",
 // props : ["slides"],
  mounted(){
    //console.log("SlideSettings mounted" , this.$props.slides);
  },
  methods:{
    
    TakeScreenshot(){
      
      
      this.$store.state.xr.Renderer.instance.render(this.$store.state.xr.Scene, this.$store.state.xr.Camera.instance);
      
      var strMime = "image/jpeg";
      var imgData = this.$store.state.xr.Renderer.instance.domElement.toDataURL(strMime);
      
      this.GetCamPos();
      this.GetTargetPos();


      this.urltoFile(imgData,'screenshot_slide_'+ this.slide.id +'.jpg', 'image/jpeg' ).then(file => {
        console.log(file);
        var formData = new FormData();
            formData.append("files", file);

            return formData;
      }).then(formData => {

        this.PostData(config.CMS_BASE_URL + "/upload/", formData).then(response =>{
          
          if(this.slide.PreviewImage != null){
            this.Delete(config.CMS_BASE_URL + "/upload/files/" + this.slide.PreviewImage.id).then(res => {
               this.Put(config.CMS_BASE_URL + "/slides/" + this.slide.id, Object.assign(this.slide, {
                  PreviewImage: response.data[0]
                })).then(this.SaveTmp);
            });
          }else{
              this.Put(config.CMS_BASE_URL + "/slides/" + this.slide.id, Object.assign(this.slide, {
                PreviewImage: response.data[0]
              })).then(this.SaveTmp);
              
          }       
          
        });
      
      });
     

    },
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