<template>
  <div class="slide-component-wrapper"  v-if="$store.state.selectedMesh != null">
    <div class="slide-component" v-if="$store.state.selectedMesh.userData.slideElements.element.Type.Type === 'Text'">
    <SidebarCompHeader name="Text"/>

    <template v-if="toggleOpen">
      <TextField class="row" @onChange="ChangeText" :object="$store.state.selectedMesh.userData.slideElements.element" path="elements.FontSettings.TextContent" htmlTag="p"/>
      
      <div class="row card-bg">
        <MaterialField 
          title="Text Farbe" 
          :onChange="ChangeTextColor"
          :value="$store.state.selectedMesh.userData.slideElements.element.FontSettings.Color" 
        />
      </div>

        <div class="row flex">
          <label>Ausrichtung</label>
          <div class="flex">
            <button @click="ChangeAlignment('left')" class="icon-button">
              <AlignLeftIcon />
            </button>
            <button @click="ChangeAlignment('center')" class="icon-button">
              <AlignCenterIcon />
            </button>
            <button @click="ChangeAlignment('right')" class="icon-button">
              <AlignRightIcon />
            </button>
          </div>
        
          <div class="flex">
            <label>Position</label>
            <div class="flex">
              <button @click="ChangeJustification('start')" class="icon-button">
                <JustifyStartIcon />
              </button>
              <button @click="ChangeJustification('center')" class="icon-button">
                <JustifyCenterIcon />
              </button>
              <button @click="ChangeJustification('end')" class="icon-button">
                <JustifyEndIcon />
              </button>
            </div>
          </div>
      </div>

      <div class="row flex">
        <LineHeightIcon />
        <input type="range" @input="e => ChangeLineHeight(parseFloat(e.target.value))" min="1" max="100"/>
      </div>
      
      <div class="row card-bg">
        <MaterialField 
          title="BackgroundColor" 
          :onChange="ChangeBackgroundColor" 
          :value="$store.state.selectedMesh.userData.slideElements.element.FontSettings.BackgroundColor"/>
      </div>
      <div class="row flex flex-column">
        <label>Background Opacity</label>
        <input type="range" @input="e => ChangeBackgroundOpacity(parseFloat(e.target.value))" step="0.01" min="0" max="1"/>
      </div>
      
      <div class="row flex flex-column">
        <label>Padding</label>
        <input type="range" @input="e => ChangePadding(parseFloat(e.target.value))" step="0.01" min="0" max="1"/>
      </div>
      
      <div class="row">
        <label>Breite</label>
        <div class="flex">
          <input type="range" @input="e => ChangeWidth(parseFloat(e.target.value))" step="0.01" min="0" max="30"/>
        </div>
      </div>
      <div class="row flex flex-column">
        <label>Höhe</label>
        <input type="range" @input="e => ChangeHeight(parseFloat(e.target.value))" step="0.01" min="0" max="30"/>
      </div>
      <!-- 
        Alignment

        left
        center
        right
      -->
      
      <!-- 
        Justification

        top
        center
        bottom
      -->
      <!-- 
        LineHeight
      -->
    </template>
  </div>
</div>
</template>
<script>
import SidebarCompHeader from './SidebarCompHeader';
import ToggleMixin from '../../../Controller/ToggleMixin';
import ProjectMixin from '../../../Controller/ProjectMixin';
import SelectionMixin from '../../../Controller/SelectionMixin';
import TextField from '../../TextField.vue';
import MaterialField from '../../MaterialField.vue';

import AlignLeftIcon from '../../../Images/Icons/alignLeft.svg';
import AlignCenterIcon from '../../../Images/Icons/alignCenter.svg';
import AlignRightIcon from '../../../Images/Icons/alignRight.svg';

import JustifyStartIcon from '../../../Images/Icons/justify_start.svg';
import JustifyCenterIcon from '../../../Images/Icons/justify_center.svg';
import JustifyEndIcon from '../../../Images/Icons/justify_end.svg';

import LineHeightIcon from '../../../Images/Icons/lineheight.svg';

import {Color} from 'three';
import DataBehaviourMixin from '../../../Controller/DataBehaviourMixin';

export default {
  name : "TextComponent",
  mixins:[ToggleMixin,ProjectMixin, SelectionMixin, DataBehaviourMixin],
  components : {
    SidebarCompHeader,
    TextField,
    MaterialField,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    LineHeightIcon,
    JustifyStartIcon,
    JustifyCenterIcon,
    JustifyEndIcon
  },
  data(){
    return {
      
    }
  },
  mounted(){
   if(this.$store.state.selectedMesh == null){return}
   if(this.$store.state.selectedMesh.userData.slideElements.element.Type.Type != "Text"){return}
  },
  methods:{
    ChangeTextColor(color){

      this.$store.state.selectedMesh.children[1].set({
        fontColor : new Color(color.hex)
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Color", 
        value : color.hex,
        asObject: true
      });


    },
    ChangeBackgroundColor(color){

      this.$store.state.selectedMesh.set({
        backgroundColor : new Color(color.hex)
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.BackgroundColor", 
        value : color.hex,
        asObject: true
      });


    },
    ChangeAlignment(value){
      
      this.$store.state.selectedMesh.set({
        alignContent : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Alignment", 
        value : value,
        asObject: true
      });


    },
    ChangeJustification(value){
    
      this.$store.state.selectedMesh.set({
        justifyContent : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Justification", 
        value : value,
        asObject: true
      });
    },
    ChangeLineHeight(value){
      
      this.$store.state.selectedMesh.set({
        interLine : value * .01
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.LineHeight", 
        value : value,
        asObject: true
      });
    },
    ChangeBackgroundOpacity(value){
      
      this.$store.state.selectedMesh.set({
        backgroundOpacity : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.BackgroundOpacity", 
        value : value,
        asObject: true
      });
    },
    ChangePadding(value){
      
      this.$store.state.selectedMesh.set({
        padding : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Padding", 
        value : value,
        asObject: true
      });
    },
    ChangeWidth(value){

      this.$store.state.selectedMesh.set({
        width : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Width", 
        value : value,
        asObject: true
      });
    },
    ChangeHeight(value){
      
      this.$store.state.selectedMesh.set({
        height : value
      });

      this.SetValue({
        object : this.$store.state.selectedMesh.userData.slideElements.element, 
        path : "elements.FontSettings.Height", 
        value : value,
        asObject: true
      });
    },
    ChangeText(value){
      
      this.$store.state.selectedMesh.children[1].set({
        content : value
      });
    }
  }
}
</script>