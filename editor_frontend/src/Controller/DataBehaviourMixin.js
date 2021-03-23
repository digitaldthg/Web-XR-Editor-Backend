const { default: Utils } = require("../Common/Utils");

module.exports = {
  methods : {
    GetValue(object, path, defaultIfNull = null){

      if(object === null && defaultIfNull != null ){
        return defaultIfNull;
      }

      console.log(object, path,defaultIfNull != null)

      const pathChain = path.split(".");
      //extract info für path
      const contentType = pathChain.shift();
      const objID = object.id;
      
      //Kopiert die pathChain
      var pathChainCopyForTmp = [...pathChain];
      //setzt die pathChain wieder zusammen => [contentType , ID , restliche Chain]
      pathChainCopyForTmp.unshift(objID);
      pathChainCopyForTmp.unshift(contentType);

      const tmpValue = Utils.GetNestedObjectValue(pathChainCopyForTmp.join("."), this.$store.state.tmp);
      
      if(tmpValue != null){
        return tmpValue;
      }else{
        var pathChainCopyForObj = [...pathChain];
        
        console.log(tmpValue,Utils.GetNestedObjectValue(pathChainCopyForObj.join("."),object));

        var realValue =  Utils.GetNestedObjectValue(pathChainCopyForObj.join("."),object);

        if(realValue === null && defaultIfNull != null ){
          return defaultIfNull;
        }

        return realValue;
      }
    },
      /**
      * @param options.object (Object): The object to modify.
      * @param options.path (Array|string): The path of the property to set.
      * @param options.value (*): The value to set.
    */
      SetValue(options){
        const {object,path,value} = options;
        
        var tmp = Object.assign({}, this.$store.state.tmp);

        const pathChain = path.split(".");
        //extract info für path
        const contentType = pathChain.shift();
        const objID = object.id;
        
        //Kopiert die pathChain
        var pathChainCopyForTmp = [...pathChain];
        //setzt die pathChain wieder zusammen => [contentType , ID , restliche Chain]
        pathChainCopyForTmp.unshift(objID);
        pathChainCopyForTmp.unshift(contentType);

        this.$store.commit("SetTmp", Utils.SetNestedObjectValue(pathChainCopyForTmp.join("."), tmp,value));
      }
  }
}