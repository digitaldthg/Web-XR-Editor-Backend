<template>
  <div v-if="this.$store.state.currentProjekt != null">
    <TextField 
      htmlTag="p" 
      :object="this.$store.state.currentProjekt" 
      path="projekt.Name"/>
    
    
    <h1>{{ GetValue(this.$store.state.currentProjekt, "projekt.Name") }}</h1>
    <input type="text" :value="GetValue(this.$store.state.currentProjekt, 'projekt.Name')" @input="e => SetValue({ object: this.$store.state.currentProjekt, path: 'projekt.Name', value: e.target.value})"/>
    
    <SlideOverview />
    <button @click="SaveProject()">Projekt Speichern</button>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";
import SlideOverview from "../Components/SlideOverview";
import TextField from '../Components/TextField';

export default {
  name: "Projekt",
  mixins: [IOMixin, DataBehaviourMixin],
  components: {
    SlideOverview,
    TextField
  },
  watch : {
    "$store.state.user" : function(){
      this.Init();
    }
  },
  computed:{
    
  },
  mounted() {

    if(this.$store.state.user != null){
      this.Init();
    }
  },
  methods:{
    SaveProject() {

      if(Object.keys(this.$store.state.tmp).length > 0){
        console.log(this.$store.state.tmp);
        this.Put(config.CMS_BASE_URL + "/db-update", this.$store.state.tmp).then((res)=>{
          console.log("return value" , res)
        });
      }
    },
    Init(){
       this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(
        (response) => {
          console.log("PROJEKT:" , response.data);
          this.$store.commit("SetProjekt", response.data);
        }
      );
    },
    
    
  },
  destroyed(){
      this.$store.commit("SetProjekt", null);
  }
};
</script>
