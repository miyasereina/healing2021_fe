<template>
<div class="container">
  <img @click="toPersonal" :src="props.avatar" alt="" class="avatar">
  <div class="name">{{nickname}}</div>
</div>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()
  const props = defineProps({
    avatar:String,
    nickname:String,
    userData:Object
  })
  const toPersonal = () => {
  router.push({
    path: '/personal',
    query: {
      id: props.userData.user_id
    }
  })
}
</script>

<style lang='less' scoped>
  .container{
    display: flex;
    align-items: center;
    height: 70px;
    width: 100%;
    .avatar{
      height: 50px;
      width: 50px;
      background-color: #fff;
      border-radius: 50%;
    }
    .name{
      align-self: flex-start;
      margin-top: 5px;
      color: white;
      font-size: 17px;
      margin-left: 30px;

    }
    
  }
  
</style>