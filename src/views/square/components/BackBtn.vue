<template>
  <div class="back-btn-wrapper">
    <div class="back-button" @click="back(path)">
      <img src="../../../assets/BackBtn.png" alt="">
    </div>
  </div>
</template>

<script>
  import { useRouter } from 'vue-router'

  export default {
    name: 'BackBtn',
    props: ['path'],
    setup() {
      const router = useRouter()
      const back = (path) => {
        if (path !== '') {
          router.push(path)
        } else {
          router.back()
        }
      }
      return {
        back
      }
    }
  }
</script>

<style scoped>
  .back-btn-wrapper {
    height: 6vw;
    width: 6vw;
    margin-top: 4.5vw;
    margin-left: 4vw;
  }
  .back-button {
    width: 100%;
    height: 9vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .back-button > img {
    width: 80%;
    height: auto;
  }
</style>
