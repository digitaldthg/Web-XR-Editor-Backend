<template>
  <div class="text flex flex-column">
    <label>{{ title }}</label>
    <div class="flex">
      <template v-if="edit">
        <div class="text-content width-12 margin-right">
          <input
            type="text"
            @input="(e) => Change(e)"
            :value="GetValue(object, path)"
          />
        </div>
        <div class="flex text-menu">
          <button class="icon-button" @click="ToggleEdit(false)">
            <CloseIcon />
          </button>
        </div>
      </template>
      <template v-if="!edit">
        <div
          class="text-content width-12 margin-right"
          @click="ToggleEdit(true)"
        >
          <component class="html-tag" :is="GetElement">{{
            GetValue(object, path)
          }}</component>
        </div>
        <div class="flex text-menu">
          <button class="icon-button" @click="ToggleEdit(true)">
            <EditIcon />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import DataBehaviourMixin from "../Controller/DataBehaviourMixin";
import EditIcon from "../Images/Icons/edit.svg";
import CloseIcon from "../Images/Icons/close.svg";


//@group Components
// TextField zeigt einen Text an und kann diesen verändern
export default {
  name: "TextField",
  components: { EditIcon, CloseIcon },
  mixins: [DataBehaviourMixin],
  props: {
    object: Object,
    path: String,
    htmlTag: String,
    title: String,
  },
  computed: {
    GetElement() {
      return this.$props.htmlTag;
    },
  },
  data() {
    return {
      edit: false,
    };
  },
  methods: {
    ToggleEdit(bool) {
      this.edit = bool;
    },
    Change(e) {
      var value = e.target.value;
      this.SetValue({
        object: this.$props.object,
        path: this.$props.path,
        value: value,
      });
      this.$emit("onChange", value);
    },
  },
};
</script>

<style scoped>
.text {
  display: flex;
}
input,
.html-tag {
  height: 40px;
  padding: 0.25rem;
  font-size: 1rem;
  vertical-align: middle;
  border: 0;
}
button {
  margin: 0;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
}

.html-tag {
  margin: 0;
  padding: 0;
  margin-right: 0.25rem;
  line-height: 40px;
  padding-left: 0.5rem;
}

.text-content {
  background: #f5f5f5;
}
.text-content input {
  margin-bottom: 0;
}
</style>
