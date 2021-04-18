<template>
<div class="projekt" @click="LogProjekt">
  <div class="projekt-inner">
    <div class="row">
      <div class="projekt-card-header">
        <h3>{{ projekt.Name }}({{ projekt.id }})</h3>
        <vue-markdown> {{ projekt.Description }}</vue-markdown>
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

export default {
  name : "ProjektCard",
  mixins : [IOMixin],
  props : ["projekt"],
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
        console.log(this.$store.state, response);

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
</style>