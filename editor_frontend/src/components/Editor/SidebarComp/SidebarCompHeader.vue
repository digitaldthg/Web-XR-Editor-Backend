<template>
  <div :class="'header header-open-' + this.$parent.toggleOpen">
    <button class="align-left" @click="Toggle">
      <template v-if="!this.$parent.toggleOpen">&raquo;</template>
      <template v-if="this.$parent.toggleOpen">&darr;</template> {{ name }}
    </button>
  </div>
</template>
<script>
//@group UI
// Wird innerhalb eines Slide-Component genutzt um den Titel anzuzeigen und die Slide-Component zu togglen
export default {
  name: "SidebarCompHeader",
  props: ["name"],
  mounted() {},
  methods: {
    Toggle: function() {
      this.$parent.ChangeVisibility(!this.$parent.toggleOpen);
    },
  },
};
</script>

<style scoped></style>
