<template>
  <button :class="'cta-button button-active-' + (Object.keys(this.$store.state.tmp).length > 0) " @click="SaveTmp">Speichern</button>  
</template>

<script>
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

export default {
  name : "SaveComponent",
  mixins: [IOMixin],
  methods :{
    
  }
}
</script>

<style lang="scss" scoped>
.button-active-false{
  opacity: .4;
}
</style>