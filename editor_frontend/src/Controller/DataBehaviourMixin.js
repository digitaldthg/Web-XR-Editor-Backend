const { default: Utils } = require("../Common/Utils");

module.exports = {
  methods : {
    GetValue(object, path, defaultIfNull = null){

      if(object === null && defaultIfNull != null ){
        return defaultIfNull;
      }

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
        let {object,path,value, asObject} = options;
        
        var tmp = Object.assign({}, this.$store.state.tmp);

        const pathChain = path.split(".");
        //extract info für path
        const contentType = pathChain.shift();
        const objID = object.id;

        

        
        if(asObject){
          var pathChainCopy = [...pathChain];
          var valueKey = pathChainCopy.pop();
          var objectKey = pathChainCopy.shift();
          var objectCopy = Object.assign(object[objectKey]);

          if(tmp.hasOwnProperty(contentType)){
            if(tmp[contentType].hasOwnProperty(objID)){
              if(tmp[contentType][objID].hasOwnProperty(objectKey)){
                objectCopy = Object.assign(objectCopy, tmp[contentType][objID][objectKey]);
              }
            }
          }
          objectCopy[valueKey] = value;
          value = objectCopy;

          //Remove last key 
          pathChain.pop();
        }
        
        //Kopiert die pathChain
        var pathChainCopyForTmp = [...pathChain];
        //setzt die pathChain wieder zusammen => [contentType , ID , restliche Chain]
        pathChainCopyForTmp.unshift(objID);
        pathChainCopyForTmp.unshift(contentType);

        if(value.isQuaternion){
          value = {x : value._x,y: value._y, z: value._z,w : value._w};
        }
        
        
        var nestedJoined = Utils.SetNestedObjectValue(pathChainCopyForTmp.join("."), tmp,value);
        
        if(this.$store.state.selectedMesh != null){
        //  console.log("selection  " , this.$store.state.selectedMesh.userData.slideElements , this.$store.state.selectedMesh.userData.slideElements.id === objID,pathChain,pathChainCopyForTmp.join("."), objID, nestedJoined, tmp, value);

        }

        this.$store.commit("SetTmp", nestedJoined);
      }
  }
}