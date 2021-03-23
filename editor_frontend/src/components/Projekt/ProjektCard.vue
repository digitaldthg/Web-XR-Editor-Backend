<template>
<div class="projekt">
  <div class="projekt-inner">
    <div class="projekt-card-header">
      <h3>{{ projekt.Name }}({{ projekt.id }})</h3>
      <vue-markdown> {{ projekt.Description }}</vue-markdown>
    </div>
    <div class="projekt-card-meta-info">
      Autor:in: {{ projekt.author.username }}
    </div>


      <div class="projekt-card-footer">
        <router-link :to="'/editor/' + projekt.id">Projekt Öffnen</router-link>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name : "ProjektCard",
  props : ["projekt"],
  mounted(){
    console.log("projekt mounted");
  }
}
</script>

<style lang="scss">

.projekt{
  padding: 1rem;
  h3{
    margin-top: 0;  
  }
}

.projekt-inner{
  padding: 1rem;
  height: 100%;
  background: #fff;
  border: 1px solid;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.projekt-card-footer{

  text-align: right;
}
</style>