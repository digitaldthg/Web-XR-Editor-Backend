import axios from 'axios';
import IOMixin from '../Controller/IOMixin';
import {store} from '../store'

const Utils = {
  SetCookie(name, value,days){
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  },
  GetCookie(name){
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  },
  DeleteCookie(name){
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
  GetObjectKeyChain(obj){
    var keys = []
    function getKeys(data, k = '') {
      for (var i in data) {
        var rest = k.length ? '.' + i : i

        if (typeof data[i] == 'object') {
          if (!Array.isArray(data[i])) {
            getKeys(data[i], k + rest)
          }
        } else keys.push(k + rest)
      }
    }
    getKeys(obj);
    return keys;

  },
  GetNestedObjectValue(path, obj){
    const chain = path.split(".");    
    return chain.reduce((object, key) => (object && object[key] !== 'undefined') ? object[key] : null, obj);
  },
  SetNestedObjectValue(path,obj,value){
    var chain = path.split(".");

    chain.reduce((a, b, level) => {

      if (typeof a[b] === "undefined" && level !== chain.length - 1){
          a[b] = {};
          return a[b];
      }
      
      if (level === chain.length - 1){
          a[b] = value;
          return value;
      } 
      return a[b];
    }, obj);


    return obj;
  }
}

Object.keys(IOMixin.methods).map(methodName => {
  Utils[methodName] = IOMixin.methods[methodName]
});
export default Utils;