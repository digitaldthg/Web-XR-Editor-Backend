<template>
  <div class="slide-component">
    <SidebarCompHeader name="Files"/>
    <template v-if="toggleOpen">
      <FileUpload @uploadComplete="HandleUploadedFile"/>

      <div class="file-items" >
        <div 
          class="file-item flex flex-between" 
          v-for="asset in componentData" 
          v-bind:key="asset.id">
          <div class="preview-image">
            <img :src="placeHolderImage" />
          </div>
          {{asset.Name}}
          <div class="flex flex-column">
            <button class="cta-button-small" @click="e => AppendItemToScene(asset)">Add to Scene</button>
            <button class="cta-button-small --warning" @click="e => DeleteItem(asset)">delete</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import IOMixin from '../../../Controller/IOMixin';
import ToggleMixin from '../../../Controller/ToggleMixin';
import ProjectMixin from '../../../Controller/ProjectMixin';
import SidebarCompHeader from "./SidebarCompHeader.vue";
import mainConfig from '../../../../../main.config';
import Utils from '../../../Common/Utils';

import FileUpload from './FileUpload';
import placeHolderImage from '../../../Images/placeholder.jpg';


export default {
  name : "Files",
  mixins:[IOMixin,ToggleMixin, ProjectMixin],
  components: {SidebarCompHeader, FileUpload},
  data(){
    return {
      componentData : null,
      placeHolderImage : placeHolderImage
    }
  },
  mounted(){
   
    // this.Get(mainConfig.CMS_BASE_URL + "/upload/files").then(response => {
    //   this.componentData = this.FilterData(Utils.GroupByKey(response.data, "ext"));
    // });


    this.Get(mainConfig.CMS_BASE_URL + "/elements").then(response => {
      this.componentData = response.data.filter(asset => asset.Type.Type === "Object3D");//this.FilterData(Utils.GroupByKey(response.data, "ext"));
      console.log("response slide-elements " , response.data);
    })


  },
  methods:{
    HandleUploadedFile(data){
      var uploadedAsset = data[0];

      var Element = {
        Name : uploadedAsset.name,
        Asset : uploadedAsset,
        Type : {
          Type: "Object3D"
        }
      }

      console.log("slideElements " , this.slide.SlideElements);

      this.AddElement(Element);

     

    },
    DeleteItem(item){
      console.log(item);

      this.Delete(mainConfig.CMS_BASE_URL + "/elements/" + item.id).then(response => {
        console.log(response.data);
        var {id} = response.data;

        this.componentData = this.componentData.filter(element => element.id != id);

      });
    },
    AppendItemToScene(cms_element){
   
        var SlideElement = {
          Name : cms_element.Name.replace(cms_element.Asset.ext, ""),
          element : cms_element
        }
        
        this.Post(mainConfig.CMS_BASE_URL + "/slide-elements" , SlideElement).then(res => {
        
          var sElements = [... this.slide.SlideElements];

          sElements.push(res.data);

          return sElements;
          
        }).then(sElements =>{
          //PUT SlideElements update
          return this.Put(mainConfig.CMS_BASE_URL + "/slides/" + this.slide.id , {
            SlideElements : sElements
          });

        }).then(d =>{
            //must update scene and add model           
            return this.Get(mainConfig.CMS_BASE_URL + "/projekts/" + this.$route.params.id);

        }).then(result =>{
              console.log("success updating Project and set in store");
              this.$store.commit("SetProjekt", result.data);  
        });
    },

    FilterData(data){
      var filteredData = Object.keys(data).map( d => {
        
        var bool = (data[d][0].ext === ".glb" || data[d][0].ext === ".gltf");

        return bool ? data[d] : null
      }).filter(d => d != null);

        
      return filteredData;
    }
  }



}
</script>

<style scope lang="scss">
.file-items{
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  overflow-y: auto;
  padding: .25rem;

}
.file-items::-webkit-scrollbar{display: hidden;}


.file-item {
  width: 100%;
  box-shadow: 0 0 0 1px #000;
  border-radius: 5px;
  padding: .25rem;
  margin-bottom: .5rem;
}

.preview-image {
  width: 50px;
  height: 50px;
}


</style>