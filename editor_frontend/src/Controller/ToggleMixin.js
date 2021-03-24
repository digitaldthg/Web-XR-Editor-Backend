export default {
  data(){
    return {
      toggleOpen : true
    }
  },
  methods:{
    ChangeVisibility(boolean){
      this.toggleOpen = boolean;
    }
  }
}