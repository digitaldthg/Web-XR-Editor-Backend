<template>
  <div class="slide-component slide-container-component">
    <SidebarCompHeader name="SlideContainerSettings"/>
    
    <div class="row">
      <TextField  :object="slideContainer" path="slideContainer.Name" htmlTag="h3"/>
    </div>

    <div class="row">
      <VectorField :object="slideContainer" path="slideContainer.SlideContainerOffset" />
    </div>

    <div class="row">
      {{slideContainer.PreviewImage}}
    </div>


    <div class="row">
      <form @submit="UploadFile">
        <input type="file" name="files" ref="previewImage"/>
        <input type="submit" value="Submit" />
      </form>

      <div class="marker-image">
        <template v-if="slideContainer.Marker != null">
          {{slideContainer.Marker.Marker.url}}
          <img :src="slideContainer.Marker.MarkerPreview.url" />
        </template>
      </div>
    </div>

    
  </div>
</template>
<script>
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

import TextField from '../../TextField';
import VectorField from '../../VectorField.vue';
import SidebarCompHeader from './SidebarCompHeader.vue';

export default {
  name : "SlideContainerSettings",
  mixins:[IOMixin],
  props : ["slideContainer"],
  components:{
    TextField,
    VectorField,
    SidebarCompHeader
  },
  data(){
    return {
      previewImage : null
    }
  },
  mounted(){
    console.log("SlideContainerSettings", this.$props.slideContainer)
  },
  methods:{
    UploadFile(e){
      e.preventDefault(e);

      if(this.$refs.previewImage.files.length == 0){return;}
      var formData = new FormData();
          formData.append("files", this.$refs.previewImage.files[0]);

        this.PostData(config.CMS_BASE_URL + "/upload/", formData).then(response =>{
          console.log(response);
        });

    }
  }
}
</script>