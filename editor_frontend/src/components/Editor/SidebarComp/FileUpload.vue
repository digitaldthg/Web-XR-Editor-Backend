<template>
  <div :class="'row drag-active-'+isOnDrag " ref="uploadField">
    <form>
      <div class="flex">
        <label class="width-12" for="fileUpload">
          <template v-if="!uploading && !canAdvancedUpload && !uploadDone">Datei auswählen</template>
          <template v-if="!uploading && canAdvancedUpload && !uploadDone">Datei auswählen oder Drag & Drop</template>
          <template v-if="uploading">hochladen...</template>
          <template v-if="!uploading && uploadDone">Hochgeladen!</template>
          
        </label>
        <input id="fileUpload" type="file" name="files" ref="fileField" accept=".glb,.gltf" @change="UploadFile"/>
      </div>
    </form>
  </div>
</template>

<script>
import config from '../../../../../main.config';
import IOMixin from '../../../Controller/IOMixin';
export default {
  name : "FileUpload",
  mixins:[IOMixin],
  data(){
    return {
      canAdvancedUpload: false,
      isOnDrag : false,
      droppedFiles : null,
      uploading : false,
      uploadDone : false
    }
  },
  mounted(){
    this.canAdvancedUpload = this.CheckForAdvancedUpload();

    this.AddListeners();
  },
  methods:{
    AddListeners(){

      console.log(this.$refs.uploadField);
      // this.$refs.uploadField.addEventListener("drag" , this.preventer);
      // this.$refs.uploadField.addEventListener("dragstart" , this.preventer);
      // this.$refs.uploadField.addEventListener("dragend" , this.preventer);
      // this.$refs.uploadField.addEventListener("dragover" , this.preventer);
      // this.$refs.uploadField.addEventListener("dragenter" , this.preventer);
      // this.$refs.uploadField.addEventListener("dragleave" , this.preventer);
      // this.$refs.uploadField.addEventListener("drop" , this.preventer);
      
      //IsDraggin Over
      this.$refs.uploadField.addEventListener("dragover" , e=> this.OnDrag(e, true));
      this.$refs.uploadField.addEventListener("dragenter" ,e=> this.OnDrag(e, true));

      this.$refs.uploadField.addEventListener("dragleave" ,  e=> this.OnDrag(e,false));
      this.$refs.uploadField.addEventListener("dragend" ,  e=> this.OnDrag(e,false));
      this.$refs.uploadField.addEventListener("drop" ,  e=> this.OnDrag(e,false));
      
      this.$refs.uploadField.addEventListener("drop" ,  e=> this.OnDrop(e));
    },
    OnDrag(e, boolean){
      e.preventDefault();
      e.stopPropagation();

      this.isOnDrag = boolean;
    },
    OnDrop(e){
      e.preventDefault();
      e.stopPropagation();
      this.droppedFiles = e.dataTransfer.files;

      this.TransferData(this.droppedFiles[0]);
      console.log(this.droppedFiles);
    },
    Preventer(e){
      e.preventDefault();
      e.stopPropagation();
    },
    CheckForAdvancedUpload(){
      var div = document.createElement('div');
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
      
    },
    UploadFile(e){
      e.preventDefault(e);

      if(this.$refs.fileField.files.length == 0){return;}
      
      this.TransferData(this.$refs.fileField.files[0]);
    },

    TransferData(file){
      var formData = new FormData();
          formData.append("files", file);

        this.uploading = true;
        this.PostData(config.CMS_BASE_URL + "/upload/", formData).then(response =>{
          console.log(response);

          this.$emit("uploadComplete" , response.data);

          this.uploading = false;
          this.uploadDone = true;

          setTimeout(()=>{
            this.uploadDone = false;
          },2000);
        });
    }
  }
}
</script>
<style lang="scss">
label[for="fileUpload"]{
  cursor: pointer;
  padding: 1rem;
  background: #eee;
  display: block;
  border-radius: 15px;
  border: 2px dotted #595fa8;
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #595fa833;
  color: #595fa8;
  font-weight: 700;
  text-align: center;
}
#fileUpload{
  display: none;
}

.drag-active-true label[for="fileUpload"]{
  padding:2rem;
}
</style>