<template>
  <div class="slide-component">
    <div class="row">
      <button :class="'cta-button button-active-' + (Object.keys(this.$store.state.tmp).length > 0) " @click="SaveTmp">Speichern</button>
    </div>
  </div>
</template>

<script>
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

export default {
  name : "SaveComponent",
  mixins: [IOMixin],
  methods :{
    SaveTmp :function(){
      console.log(this.$store.state.tmp);


    //return;
      var savePromises = Object.keys(this.$store.state.tmp).map((category)=>{
        var splited = category.split(/(?=[A-Z])/);
        splited = splited.map(s => s.toLowerCase()).join("-");
        var promises = Object.keys(this.$store.state.tmp[category]).map((id)=>{

            console.log(splited, category, this.$store.state.tmp[category][id]);

          return this.Put( config.CMS_BASE_URL + "/" + splited + "/" + id , this.$store.state.tmp[category][id] );
        });

        return Promise.all(promises);
      });

      Promise.all(savePromises).then((response)=>{
        console.log("successful saved ", response);
        return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id);
      }).then(response =>{

        console.log("%c updated Projekt" , "background:tomato; color:#fff;");
        console.log(response);

        this.$store.commit("SetProjekt", response.data);
        this.$store.commit("SetTmp" , {});        
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.button-active-false{
  opacity: .4;
}
</style>