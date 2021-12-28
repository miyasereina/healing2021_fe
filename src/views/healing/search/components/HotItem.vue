<template>
  <div class="container" @click="toDetail">
    <div class="index">{{index}}</div>
    <div class="content">
      <div class="top">{{props.itemInfo.song_name}}</div>
      <div class="bottom">{{props.itemInfo.nickname}}</div>
    </div>
  </div>
</template>

<script setup>
  import { toRef } from "vue";
  import { useRouter } from "vue-router";
  const router = useRouter()
  const props = defineProps({
    itemInfo:Object,
    index:Number
  })
  const itemInfo = toRef(props, 'itemInfo')

  const toDetail = () => {
    // console.log(itemInfo.value);
    if(itemInfo.value.module===1){
      router.push('/healingdetail/' + itemInfo.value.selection_id)
    }
    else if(itemInfo.value.module===2){
      router.push({path:'/cover',query:{classic_id:itemInfo.value.classic_id}})
    }
}
</script>

<style lang="less" scoped>
  .container{
    margin-top: 20px;
    height: auto;
    width: 80%;
    color: white;
    display: flex;
    .index{
      margin-top: 2px;
      font-size: 15px;
      width: 10px;
    }
    .content{
      margin-left: 15px;
      .top{
        font-size: 20px;
        text-overflow:ellipsis
      }
      .bottom{
        font-size: 16px;
        text-overflow:ellipsis
      }
    }
  }
</style>