<template>
  <div class="" v-if="this.$store.state.user != null">
    <h1>Hallo <span class="tag">{{this.$store.state.user.username}}</span></h1>
    <div class="role-info">
      <span class="tag">{{this.$store.state.user.role.name}}</span>
      {{this.$store.state.user.role.description}}
    </div>

    <div class="content-block">
      <div class="content" v-for="contentblock in content" v-bind:key="contentblock.id">
        <div class="table">
        <div class="table-cell">{{contentblock.id}}</div>
        <div class="table-cell"><vue-markdown>{{contentblock.Description}}</vue-markdown></div>
        <div class="table-cell">{{contentblock.author.username}}</div>
        <div class="table-cell"><button @click="DeleteEntry(contentblock)">x</button></div>
        </div>
      </div>
    </div>
    <button @click="NewProjekt">Neues Projekt</button>
  
  </div>
</template>
<script>

import axios from 'axios';
import config from '../../../main.config';
import IOMixin from '../Controller/IOMixin';

export default {
  name : "Userprofile",
  mixins : [IOMixin],
  data(){
    return {
      content : null
    }
  },
  mounted(){
    if(this.$store.state.user == null){return; }

    this.Get(config.CMS_BASE_URL + "/projekts").then((response)=>{
      console.log(response.data);

      this.content = response.data; 
    });
  },
  methods:{
    DeleteEntry(entry){

      console.log(entry.id);

      this.Delete(config.CMS_BASE_URL + "/test-contents/"+entry.id).then((response)=>{
        console.log("delete" , response.data);
       
        // get index of object with id:37
        this.content = this.content.filter((item) => item.id != response.data.id );

      }).catch((error)=>{
        console.log(error);
      });
    },
    NewProjekt(){
      
      this.Post(config.CMS_BASE_URL + "/test-contents",{
          Description : "Per API kreiierter Beitrag",
        }).then((response)=>{
          
          if(this.content.length > 0){
            this.content.push(response.data);
          }

        }).catch((error)=>{
          console.log(error);
        });
      
    }
  }
}
</script>