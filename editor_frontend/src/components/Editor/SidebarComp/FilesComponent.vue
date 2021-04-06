<template>
  <div class="slide-component">
    <SidebarCompHeader name="Files"/>
    

    <div class="file-items" >
      <div class="file-item flex flex-between" v-for="asset in componentData" v-bind:key="asset.id" >
        {{asset.Name}}
        <div class="flex flex-column">
          <button class="cta-button-small" @click="e => AppendItemToScene(asset)">Add to Scene</button>
          <button class="cta-button-small --warning" @click="e => DeleteItem(asset)">delete</button>
        </div>
      </div>
    </div>
  
  </div>
</template>

<script>
import IOMixin from '../../../Controller/IOMixin';
import SidebarCompHeader from "./SidebarCompHeader.vue";
import mainConfig from '../../../../../main.config';
import Utils from '../../../Common/Utils';

export default {
  name : "Files",
  mixins:[IOMixin],
  props:["slide"],
  components: {SidebarCompHeader},
  data(){
    return {
      componentData : null
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
        // {
        //   Name : elementName,
        //   element : element,
        // }
        
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
}
.file-item {
  width: 100%;
  box-shadow: 0 0 0 1px #000;
}
</style>