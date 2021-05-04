import axios from 'axios';
import config from '../../../main.config';

export default {
  methods : {
    urltoFile(url, filename, mimeType){
      return (fetch(url)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], filename,{type:mimeType});})
      );
    },
    Get(url){
      return axios({
        method : "GET",
        url : url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ this.$store.state.jwt }`
        }
      })
    },
    Post(url, payload){
      return axios({
        method : "POST",
        url : url,
        data : payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ this.$store.state.jwt }`
        }
      })
    },
    PostData(url, formData){
      return axios({
        method : "POST",
        url : url,
        data : formData,
        headers: {
          'Content-Type': `multipart/form-data;`,
          'Authorization': `Bearer ${ this.$store.state.jwt }`
        }
      })
    },
    Delete(url){

      // return axios.delete(url,{
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${ this.$store.state.jwt }`
      //   }
      // });
      return axios({
        method : "DELETE",
        url : url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ this.$store.state.jwt }`
        }
      })
    },
    Put(url, payload){

      console.log(url, payload);
      return axios({
        method : "PUT",
        url : url,
        data : payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ this.$store.state.jwt }`
        }
      })
    },
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