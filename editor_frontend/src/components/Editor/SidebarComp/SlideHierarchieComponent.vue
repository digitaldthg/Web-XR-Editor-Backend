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
            

            <button @click="e => DeleteSlideElement(SlideElements)">Delete</button>
            
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
import SidebarCompHeader from './SidebarCompHeader.vue';

import mainConfig from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';

export default {
  components: { VectorField, SidebarCompHeader, QuaternionField },
  mixins:[ToggleMixin, IOMixin],
  name : "SlideHierarchie",
  props: ["slide"],
  mounted(){
    console.log("SlideHierarchie", this.$props.slide, this.$props.slide.SlideElements)
  },
  methods :{
    DeleteSlideElement(slideElement){

      console.log(slideElement);

      const id = slideElement.id;

      this.Delete(mainConfig.CMS_BASE_URL + "/slide-elements/"+ id ).then(response => {
        
        console.log(response.data);
        
        var itemToDelete = null;
        this.$store.state.xr.Scene.traverse(child =>{
          if(child.userData.hasOwnProperty("slideElements")){
            if(child.userData.slideElements.id == id){
              itemToDelete = child;
            }
          }
        });

        if(itemToDelete != null){
              var childParent = itemToDelete;//{type: null};
              // console.log("found" , childParent);
               var maxIteration = 10;
               var currentIteration = 0;
               var mustContinue = true;
               while(mustContinue && currentIteration < maxIteration){
                console.log("while");

                mustContinue = childParent.parent.type != "Scene";
                if(mustContinue){
                  childParent = childParent.parent;
                }
                currentIteration++;
               }

              this.$store.state.xr.Scene.remove(childParent);

        }

      });
    }
  }
}
</script>