<template>
  <div class="slide-component">
    <SidebarCompHeader name="Slide Hierarchie"/>

    <template v-if="toggleOpen">
      <div class="row">
        <div class="hierarchie">
          <div class="hierarchie-item" v-for="SlideElements in slide.SlideElements" v-bind:key="SlideElements.id">
            <input type="checkbox" />
            {{SlideElements.Name}}
            <VectorField :object="SlideElements" path="SlideElements.Offset" />
            <VectorField :object="SlideElements" path="SlideElements.Scale" />
            <QuaternionField :object="SlideElements" path="SlideElements.Rotation" />
            
            
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ToggleMixin from '../../../Controller/ToggleMixin'
import QuaternionField from '../../QuaternionField.vue'
import VectorField from '../../VectorField.vue'
import SidebarCompHeader from './SidebarCompHeader.vue'
export default {
  components: { VectorField, SidebarCompHeader, QuaternionField },
  mixins:[ToggleMixin],
  name : "SlideHierarchie",
  props: ["slide"],
  mounted(){
    console.log("SlideHierarchie", this.$props.slide, this.$props.slide.SlideElements)
  }
}
</script>