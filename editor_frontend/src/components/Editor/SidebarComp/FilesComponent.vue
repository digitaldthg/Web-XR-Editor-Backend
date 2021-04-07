<template>
  <div class="slide-component">
    <SidebarCompHeader name="Files"/>
    <template v-if="toggleOpen">
      <FileUpload @uploadComplete="HandleUploadedFile"/>

      <div class="file-items" >
        <div class="file-item flex flex-between" v-for="asset in componentData" v-bind:key="asset.id" >
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
import SidebarCompHeader from "./SidebarCompHeader.vue";
import mainConfig from '../../../../../main.config';
import Utils from '../../../Common/Utils';

import FileUpload from './FileUpload';
import placeHolderImage from '../../../Images/placeholder.jpg';


export default {
  name : "Files",
  mixins:[IOMixin,ToggleMixin],
  props:["slide"],
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
      this.componentData = response.data;//this.FilterData(Utils.GroupByKey(response.data, "ext"));
      console.log("response slide-elements " , response.data);
    })


  },
  methods:{
    HandleUploadedFile(data){
      var uploadedAsset = data[0];

      var Element = {
        Name : uploadedAsset.name,
        Asset : uploadedAsset,
      }

      this.Post(mainConfig.CMS_BASE_URL + "/elements", Element).then(response => {

        return response.data;
      }).then((element) =>{
        console.log("%c 1. Element" ,"background:tomato; color:#fff;");
        console.log("received element" , element);
        
        var SlideElement = {
          Name : element.Name,
          element : element
        }

        return this.Post(mainConfig.CMS_BASE_URL + "/slide-elements" , SlideElement);
      }).then(response =>{

        console.log("%c 2. slideElement" ,"background:tomato; color:#fff;");
        var slideElement = response.data;

        console.log("received slideELement" , slideElement);

        var sElements = [... this.$props.slide.SlideElements];

          sElements.push(slideElement);

          //PUT SlideElements update
          return this.Put(mainConfig.CMS_BASE_URL + "/slides/" + this.$props.slide.id , {
            SlideElements : sElements
          })

      }).then(response =>{
        console.log("%c 3. Slide" ,"background:tomato; color:#fff;");
        console.log("final new Slides" , response.data);

        return this.Get(mainConfig.CMS_BASE_URL + "/projekts/" + this.$route.params.id);
      }).then(response =>{
        console.log("%c 4. Projekt" ,"background:tomato; color:#fff;");
        console.log("Get Complete Response for new Slide" , response);

        this.$store.commit("SetProjekt", response.data);

        return response.data;
      }).then(projekt =>{
        console.log("%c 4. Final" ,"background:tomato; color:#fff;");
        console.log("projekt" , projekt);

      });

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
      
      var item = cms_element.Asset;
      var elementName = item.name.replace(item.ext, "");
      
      // var Element = {
      //   Name : elementName,
      //   Asset : item
      // }


      //console.log(elementName);
      //return;

      // this.Post(mainConfig.CMS_BASE_URL + "/elements", Element).then(response => {
        // const element = response.data;
// 
        var SlideElement = {
          Name : "",
          element : cms_element
        }
        
        this.Post(mainConfig.CMS_BASE_URL + "/slide-elements" , SlideElement).then(res => {
        
          var sElements = [... this.$props.slide.SlideElements];

          sElements.push(res.data);

          //PUT SlideElements update
          this.Put(mainConfig.CMS_BASE_URL + "/slides/" + this.$props.slide.id , {
            SlideElements : sElements
          }).then(d => {

            //must update scene and add model
           
            this.Get(mainConfig.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then((result) => {

              console.log("success updating Project and set in store");
              this.$store.commit("SetProjekt", result.data);
            });


          });

        });
        
     // });
      // create Element from Asset
      // create SlideElement
      // Add to current Slide


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
  max-height:300px;
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