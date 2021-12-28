<template>
  <div class="tobbar">
    <slot name="left"></slot>
    <slot name="middle"></slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'TobBar'
}
</script>

<style scoped>
.tobbar {
  width: 100vw;
  height: 5vh;
  display: flex;
  flex-direction: row;
}
.tobbar * {
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  transition: all 0.2s ease-in-out;
}
</style>
