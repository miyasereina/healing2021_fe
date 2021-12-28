<template>
  <div @click="toCoverPage" class="container">
    <div class="left">
      <div class="name">{{props.name}}</div>
      <div class="work-name">{{props.work_name}}</div>
    </div>
    <img class="img" :src="props.icon" alt="">
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

  const router = useRouter()
  const props = defineProps({
    name:String,
    classic_id:Number,
    icon:String,
    work_name:String
  })
  function toCoverPage(){
    router.push({path:'/cover',query:{classic_id:props.classic_id}})
  }
</script>

<style lang="less" scoped>
.container{
  display: flex;
  align-items: center;
  width: 84vw;
  height: 85px;
  margin-top: 20px;
  border: 3px solid rgb(255, 255, 255);
  border-radius: 10px;
  .left{
    color: white;
    font-size: 15px;
    margin-left: 20px;
  }
  .img{
    margin-left: auto;
    margin-right: 10px;
    height: 90%;
    border-radius: 10px;
  }
}

</style>