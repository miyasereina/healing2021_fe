<template>
  <div class="share-btn-wrapper" :style="shareBtnWidth">
    <div class="share-btn" @click="$router.push('/share')">
      <img src="../../assets/fenxiang.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShareBtn',
  props: {
    width: {
      type: String,
      default: '8'
    }
  },
  computed: {
    shareBtnWidth () {
      return {
        width: `${this.width}vw`
        // width: `${this.$store.state.shareBtnWidthPercent}vw`
      }
    }
  }
}
</script>
