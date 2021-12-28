<template>
  <div class="container">
    <img @click="toCoverPage" class="img" :src="props.icon" alt="">
    <div class="name">
      {{props.name}}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

  const Router = useRouter()
  const props = defineProps({
    name:String,
    classic_id:Number,
    icon:String
  })
  function toCoverPage(){
    Router.push({path:'/cover',query:{classic_id:props.classic_id}})
  }
</script>

<style lang="less" scoped>
  .container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    .img{
      display: inline-block;
      border-radius: 10px;
      width: 80px;
      height: 80px;
    }
    .name{
      color: white;
    }
  }
</style>