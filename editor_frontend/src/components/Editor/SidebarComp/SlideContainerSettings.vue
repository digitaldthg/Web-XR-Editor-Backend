<template>
  <div class="slide-component slide-container-component">
    <SidebarCompHeader name="SlideContainerSettings" />
    
    <template v-if="toggleOpen && slideContainer != null">
      <div class="row">
        <TextField  :object="slideContainer" path="slideContainers.Name" htmlTag="h3"/>
      </div>

      <div class="row">
        <VectorField :object="slideContainer" path="slideContainers.SlideContainerOffset" />
      </div>

      <template v-if="slideContainer.PreviewImage != null">
        <div class="row">
          <div class="card">
            <label>Vorschaubild</label>
            <div class="flex">
              <div class="preview-image">
                <img :src="config.CMS_BASE_URL + slideContainer.PreviewImage.url" />
              </div>
              <button class="cta-button" @click="DeleteVorschaubild">Vorschaubild löschen</button>
            </div>
          </div>
        </div>
      </template>

      <FileUpload title="Vorschaubild hochladen" :acceptedTypes="'.jpg, .jpeg, .png'" @uploadComplete="HandleUploadedFile"/>

    
    </template>
  </div>
</template>
<script>
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';
import ProjectMixin from '../../../Controller/ProjectMixin';
import ToggleMixin from '../../../Controller/ToggleMixin';

import TextField from '../../TextField';
import VectorField from '../../VectorField.vue';
import FileUpload from './FileUpload.vue';
import SidebarCompHeader from './SidebarCompHeader.vue';

export default {
  name : "SlideContainerSettings",
  mixins:[IOMixin, ToggleMixin, ProjectMixin],
  components:{
    TextField,
    VectorField,
    SidebarCompHeader,
    FileUpload
  },
  data(){
    return {
      previewImage : null,
      config : config
    }
  },
  mounted(){
    //console.log("SlideContainerSettings", this.$props.slideContainers)
  },
  methods:{
    DeleteVorschaubild(){
      if(this.slideContainer.PreviewImage != null){
        this.Delete(config.CMS_BASE_URL + "/upload/files/" +  this.slideContainer.PreviewImage.id).then(()=>{
          this.Put(config.CMS_BASE_URL + "/slide-containers/"+ this.slideContainer.id, {
            PreviewImage : null
          }).then(this.GetProjekt);
        });
      }
    },
    HandleUploadedFile(data){
      var uploadedAsset = data[0];

      this.Put(config.CMS_BASE_URL + "/slide-containers/"+ this.slideContainer.id, {
        PreviewImage : uploadedAsset
      }).then(this.GetProjekt);

    }
  }
}
</script>

<style lang="scss">
.preview-image{
  width:80px;
  height:auto;
  max-height:80px;
}
</style>