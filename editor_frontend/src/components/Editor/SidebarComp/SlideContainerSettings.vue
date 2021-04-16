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

      <template v-if="slideContainer != null">
        <div class="row">
          {{slideContainer.PreviewImage}}

          
        </div>
      </template>


      <!-- <div class="row">
        <form @submit="UploadFile">
          <input type="file" name="files" ref="previewImage"/>
          <input type="submit" value="Submit" />
        </form>

        <div class="marker-image">
          <template v-if="slideContainers.Marker != null">
            {{slideContainers.Marker.Marker.url}}
            <img :src="slideContainers.Marker.MarkerPreview.url" />
          </template>
        </div>
      </div> -->

    
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
import SidebarCompHeader from './SidebarCompHeader.vue';

export default {
  name : "SlideContainerSettings",
  mixins:[IOMixin, ToggleMixin, ProjectMixin],
  components:{
    TextField,
    VectorField,
    SidebarCompHeader
  },
  data(){
    return {
      previewImage : null,
    }
  },
  mounted(){
    //console.log("SlideContainerSettings", this.$props.slideContainers)
  },
  // methods:{
  //   UploadFile(e){
  //     e.preventDefault(e);

  //     if(this.$refs.previewImage.files.length == 0){return;}
  //     var formData = new FormData();
  //         formData.append("files", this.$refs.previewImage.files[0]);

  //       this.PostData(config.CMS_BASE_URL + "/upload/", formData).then(response =>{
  //         console.log(response);
  //       });

  //   }
  // }
}
</script>