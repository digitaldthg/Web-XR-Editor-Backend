<template>
  <div class="slide-component">
    <SidebarCompHeader name="Transform" />

    <template v-if="toggleOpen">
      <template v-if="$store.state.selectedMesh != null">
        <VectorField
          title="Position"
          @change="(vec) => Transform('position', vec)"
          :object="$store.state.selectedMesh.userData.slideElements"
          path="slideElements.Offset"
        />
        <VectorField
          title="Scale"
          @change="(vec) => Transform('scale', vec)"
          :object="$store.state.selectedMesh.userData.slideElements"
          path="slideElements.Scale"
        />
        <QuaternionField
          title="Rotation"
          @change="(quat) => Transform('quaternion', quat)"
          :object="$store.state.selectedMesh.userData.slideElements"
          path="slideElements.Rotation"
        />
      </template>
      <template v-if="$store.state.selectedMesh === null">
        Nichts ausgewählt
      </template>
    </template>
  </div>
</template>
<script>
import SidebarCompHeader from "./SidebarCompHeader";
import { EventManager } from "../../../Events/EventManager";
import ToggleMixin from "../../../Controller/ToggleMixin";
import SelectionMixin from "../../../Controller/SelectionMixin";
import VectorField from "../../VectorField.vue";
import QuaternionField from "../../QuaternionField.vue";
import TextField from "../../TextField.vue";

import { Quaternion } from "three";

//@group Sidebar Components
// Zeigt die Position, Skalierung und Rotation für das ausgewählte Objekt an
export default {
  name: "TransformComponent",
  mixins: [ToggleMixin, SelectionMixin],
  components: {
    SidebarCompHeader,
    VectorField,
    QuaternionField,
    TextField,
  },
  mounted() {
    EventManager.$on("ChangeTransform3D", this.TransformFrom3D);

    this.toggleOpen = false;
  },
  computed: {
    GetPosition() {
      return this.slideElements.position;
    },
    GetRotation() {
      return this.slideElements.rotation;
    },
  },
  methods: {
    TransformFrom3D(event3D) {
      this.Transform(event3D.type, event3D.object[event3D.type]);
    },
    Transform(transformType, value) {
      if (transformType === "quaternion") {
        this.slideElements.quaternion = new Quaternion(
          value.x,
          value.y,
          value.z,
          value.w
        );
        return;
      }

      this.slideElements[transformType].x = value.x;
      this.slideElements[transformType].y = value.y;
      this.slideElements[transformType].z = value.z;
    },
  },
};
</script>
