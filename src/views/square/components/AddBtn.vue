<template>
  <div class="add-btn-wrapper">
    <div class="add-btn" @click="router.push('/publishdynamic')">
      <img src="../../../assets/add.png" alt="">
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AddBtn',
  setup () {
    const router = useRouter()

    return {
      router
    }
  }
}
</script>

<style scoped>
  .add-btn-wrapper {
    height: 100%;
    width: 9vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-btn {
    width: 100%;
    height: 9vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-btn > img {
    width: 80%;
    height: auto;
  }
</style>
