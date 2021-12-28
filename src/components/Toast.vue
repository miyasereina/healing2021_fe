<template>
  <transition name="fade">
    <div class="_toast" v-show="isToastShow">
      <span :style="{fontSize: `${toastText.length > 13 ? 0.86 : 1}em`}">{{ toastText }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Toast',
  computed: {
    isToastShow () {
      return this.$store.state.isToastShow
    },
    toastText () {
      // return '测试一段特别特别特别长的文字'
      return this.$store.state.toastText
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
._toast {
  padding: 12px 5vw;
  width: 70vw;
  height: auto;
  background-color: #333333;
  border-radius: 2vw;
  color: #ffffff;
  position: absolute;
  left: 50%;
  top: 75%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  z-index: 3000;
}
</style>
