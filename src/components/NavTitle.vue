<template>
  <div class="title-wrapper">
    <h3>{{ navTitleText }}</h3>
  </div>
</template>

<script>
export default {
  name: 'NavTitle',
  computed: {
    navTitleText () {
      const ellipsis = this.navTitle.length > 10 ? '…' : ''
      return this.navTitle.substr(0, 10) + ellipsis
    }
  },
  props: {
    navTitle: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.title-wrapper {
  width: 80vw;
  height: 100%;
  color: white;
}
</style>
