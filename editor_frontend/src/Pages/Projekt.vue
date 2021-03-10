<template>
  <div v-if="this.$store.state.currentProjekt != null">
    Projektname: {{ GetValue(this.$store.state.currentProjekt, "projekt.Name") }}
    <input type="text" :value="GetValue(this.$store.state.currentProjekt, 'projekt.Name')" @input="e => SetValue({ object: this.$store.state.currentProjekt, path: 'projekt.Name', value: e.target.value})"/>
    
    <SlideOverview />
    <button @click="SaveProject()">Projekt Speichern</button>
  </div>
</template>

<script>
import config from "../../../main.config";
import IOMixin from "../Controller/IOMixin";
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";
import SlideOverview from "../components/SlideOverview";

export default {
  name: "Projekt",
  mixins: [IOMixin, DataBehaviourMixin],
  components: {
    SlideOverview,
  },
  methods: {
    SaveProject() {
      this.$store.state.currentProjekt.Upload();
    },
  },
  watch : {
    "$store.state.user" : function(){
      this.Init();
    }
  },
  computed:{
    
  },
  mounted() {
   
  },
  methods:{
    Init(){
       this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id).then(
        (response) => {
          console.log("PROJEKT:" , response.data);
          this.$store.commit("SetProjekt", response.data);
        }
      );
    },
    /**
      * @param object (Object): The object to modify.
      * @param path (Array|string): The path of the property to set.
      * @param value (*): The value to set.
    */
    // ChangeValue(object, path, value){

    //   this.$store.commit("ChangeField" , {
    //     object : object,
    //     path : path,
    //     value : value
    //   });
    // },
    
  },
  destroyed(){
      this.$store.commit("SetProjekt", null);
  }
};
</script>
