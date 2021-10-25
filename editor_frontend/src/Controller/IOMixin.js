// @group Controller
import axios from 'axios';
import config from '../../../main.config';

//@vuese
//@group Mixins
export default {
  name: "IOMixin",
  methods: {
    /**
     * @vuese
     * Wandelt ein Dataurlstring in eine uploadbare Datei um
     * @param {string} url 
     * @param {string} filename 
     * @param {string} mimeType 
     * @returns 
     */
    urltoFile(url, filename, mimeType) {
      return(fetch(url).then(function (res) {
        return res.arrayBuffer();
      }).then(function (buf) {
        return new File([buf], filename, {type: mimeType});
      }));
    },
    /**
     * @vuese
     * GET Daten aus CMS => hinter login
     * @param {string} url 
     * @returns axios.promise
     */
    Get(url) {
      return axios({
        method: "GET",
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${
            this.$store.state.jwt
          }`
        }
      })
    },
    /**
     * @vuese
     * POST Daten an CMS => hinter login
     * @param {string} url API Endpoint zu dem die Daten geladen werden sollen
     * @param {object} payload Daten die im CMS gespeichert werden sollen
     * @returns axios.promise
     */
    Post(url, payload) {
      return axios({
        method: "POST",
        url: url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${
            this.$store.state.jwt
          }`
        }
      })
    },
    /**
     * @vuese
     * POST formData an CMS => hinter login
     * @param {string} url API Endpoint zu dem die Daten geladen werden sollen
     * @param {object} formData formData die im CMS gespeichert werden sollen
     * @returns axios.promise
     */
    PostData(url, formData) {
      return axios({
        method: "POST",
        url: url,
        data: formData,
        headers: {
          'Content-Type': `multipart/form-data;`,
          'Authorization': `Bearer ${
            this.$store.state.jwt
          }`
        }
      })
    },
    /**
     * @vuese
     * DELETE Daten aus dem CMS => hinter login
     * @param {string} url API Endpoint welche Daten gelöscht werden sollen
     * @returns axios.promise
     */
    Delete(url) {
      return axios({
        method: "DELETE",
        url: url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${
            this.$store.state.jwt
          }`
        }
      })
    },
    /**
     * @vuese
     * PUT Daten aus dem CMS => hinter login
     * @param {string} url API Endpoint welche Daten gelöscht werden sollen
     * @param {object} payload Daten die ans CMS übermittelt werden sollen
     * @returns axios.promise
     */
    Put(url, payload) {
      return axios({
        method: "PUT",
        url: url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${
            this.$store.state.jwt
          }`
        }
      })
    },
    /**
     * @vuese
     * Speichert die tmp Daten aus dem Store
     */
    SaveTmp: function () {
      var savePromises = Object.keys(this.$store.state.tmp).map((category) => {
        var splited = category.split(/(?=[A-Z])/);
        splited = splited.map(s => s.toLowerCase()).join("-");
        var promises = Object.keys(this.$store.state.tmp[category]).map((id) => {
          return this.Put(config.CMS_BASE_URL + "/" + splited + "/" + id, this.$store.state.tmp[category][id]);
        });

        return Promise.all(promises);
      });

      Promise.all(savePromises).then((response) => {
        console.log("successful saved ", response);
        return this.Get(config.CMS_BASE_URL + "/projekts/" + this.$route.params.id);
      }).then(response => {

        console.log("%c updated Projekt", "background:tomato; color:#fff;");
       
        this.$store.commit("SetProjekt", response.data);
        this.$store.commit("SetTmp", {});
      });
    }
  }
}
