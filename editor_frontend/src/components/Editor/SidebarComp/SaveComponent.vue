<template>
  <button :class="'icon-button cta-button button-active-' + (Object.keys(this.$store.state.tmp).length > 0) " @click="SaveTmp"><SaveIcon />Speichern</button>  
</template>

<script>
import IOMixin from '../../../Controller/IOMixin';
import SaveIcon from '../../../Images/Icons/save.svg';

//@group Sidebar Components
// Speichert die aktuellen Werte aus dem $store.tmp in der Datenbank
export default {
  name : "SaveComponent",
  components:{
    SaveIcon
  },
  mixins: [IOMixin],
}
</script>

<style lang="scss" scoped>
.button-active-false{
  opacity: .4;
}

button{
  svg{
    fill: #fff;
  }
}
</style>