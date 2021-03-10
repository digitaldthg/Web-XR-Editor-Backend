module.exports = {
  methods : {
   GetValue(object, path){
        const [contentType, fieldName] = path.split(".");
  
        if(this.$store.state.tmp.hasOwnProperty(contentType)){
          if(this.$store.state.tmp[contentType].hasOwnProperty(object.id)){
            if(this.$store.state.tmp[contentType][object.id].hasOwnProperty(fieldName)){
              return this.$store.state.tmp[contentType][object.id][fieldName];
            }
          }
        }
  
  
        return object[fieldName];
      },
      /**
      * @param options.object (Object): The object to modify.
      * @param options.path (Array|string): The path of the property to set.
      * @param options.value (*): The value to set.
    */
      SetValue(options){
        const {object,path,value} = options;
        const [contentType , fieldName] = path.split(".");
        
        var tmp = Object.assign({}, this.$store.state.tmp);

        tmp[contentType] = !tmp.hasOwnProperty(contentType) ? {} : tmp[contentType];
        tmp[contentType][object.id] = !tmp[contentType].hasOwnProperty(object.id) ? {} : tmp[contentType][object.id];
        tmp[contentType][object.id][fieldName] = value;

        this.$store.commit("SetTmp", tmp);
      }
  }
}