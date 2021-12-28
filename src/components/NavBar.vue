<template>
  <div class="_navbar">
    <slot name="left"></slot>
    <slot name="middle"></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
._navbar {
  width: 100vw;
  height: 13vw;
  display: flex;
}
._navbar * {
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  transition: all 0.2s ease-in-out;
}
</style>
