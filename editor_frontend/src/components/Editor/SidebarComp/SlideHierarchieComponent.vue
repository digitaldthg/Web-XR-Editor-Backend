<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Hierarchie"/>
    <div class="row">
      <div class="hierarchie">
        <div class="hierarchie-item" v-for="slideElement in slide.SlideElements" v-bind:key="slideElement.id">
          {{slideElement.Name}}
          <VectorField :object="slideElement" path="slideElement.Offset" />
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VectorField from '../../VectorField.vue'
import SidebarCompHeader from './SidebarCompHeader.vue'
export default {
  components: { VectorField, SidebarCompHeader },
  name : "SlideHierarchie",
  props: ["slide"],
  mounted(){
    console.log("SlideHierarchie", this.$props.slide)
  }
}
</script>