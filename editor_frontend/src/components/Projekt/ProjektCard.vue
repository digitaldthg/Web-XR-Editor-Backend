<template>
<div class="projekt" @click="LogProjekt">
  <div class="projekt-inner">
    <div class="row">
      <div class="projekt-card-header">
        <h3>{{ projekt.Name }}</h3>
        <vue-markdown>{{ projekt.Description }}</vue-markdown>

        <div class="flex">
          <div class="slideContainer-preview" v-for="(slideContainer) in projekt.slide_containers" :key="slideContainer.id">
            <template v-if="slideContainer.PreviewImage != null && slideContainer.PreviewImage.formats != null">
              <img :src="config.CMS_BASE_URL + slideContainer.PreviewImage.formats.thumbnail.url" />
            </template>
            <template v-else>
              <img :src="placeHolderImage" />
            </template>
            <div class="slideContainer-preview-count">{{slideContainer.Slides.length}}</div>
          </div>
        </div>
      </div>
      <div class="projekt-card-meta-info">
        Autor:in: {{ projekt.author.username }}
      </div>
    </div>

      <div class="projekt-card-footer">
        <div class="row flex">
          <router-link class="cta-button" :to="'/editor/' + projekt.id + '/0/0' ">Projekt Öffnen</router-link>
          <div class="width-1"></div>
          <button class="cta-button --warning" @click="DeleteProjekt">Projekt löschen</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import IOMixin from '../../Controller/IOMixin';
import mainConfig from '../../../../main.config';
import config from '../../../../main.config';
import placeHolderImage from '../../Images/placeholder.jpg';

export default {
  name : "ProjektCard",
  mixins : [IOMixin],
  props : ["projekt"],
  data(){
    return {
      placeHolderImage : placeHolderImage,
      config : config
    }
  },
  mounted(){
    console.log("projekt mounted");
  },
  methods:{
    LogProjekt(){
      console.log(this.$props.projekt);
    },
    DeleteProjekt(){
      console.log("delete projekt" , this.$props.projekt);

      this.Delete(mainConfig.CMS_BASE_URL + "/projekts/"+ this.$props.projekt.id ).then((response)=>{
        this.$emit('deleteProjekt', response.data)
      });

    }
  }
}
</script>

<style lang="scss">

.projekt{
  padding: 1rem;
  h3{
    margin-top: 0;  
  }
}

.projekt-inner{
  padding: 1rem;
  height: 100%;
  background: #fff;
  border: 1px solid;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.projekt-card-footer{

  text-align: right;
}

.slideContainer-preview {
   width: 40px;
  height: 40px;
  display: flex;
  margin-right: .5rem;
  margin-bottom: .5rem;
  border-radius: 5px;
  overflow: hidden;
  font-weight: 700;
  position: relative;
}

.slideContainer-preview-count {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>