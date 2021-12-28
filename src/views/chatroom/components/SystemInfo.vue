<template>
  <div class="system-info">
    <div class="system-info-wrap">
      <span>{{ content }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      defaultValue: ''
    }
  }
}
</script>
<style scoped>
.system-info {
  padding: 4vw;
}

.system-info-wrap {
  margin: 0 auto;
  padding: 10px 4vw;
  width: 72vw;
  color: white;
  background-color: #2b2b2b65;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 10px;
}
</style>
