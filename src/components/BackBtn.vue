<template>
  <div class="back-button" @click="back">
    <img src="../assets/BackBtn.png" alt="" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'BackBtn',
  props: ['path'],
  setup(props) {
    const router = useRouter()
    const back = () => {
      if (window.history.length <= 1) {
        router.push('/')
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
.back-button {
  width: 10vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-button img {
  width: 4vw;
}
</style>
