<template>
  <div class="receive-chat-box">
    <div class="time-box">
      {{ time }}
    </div>
    <div class="main-box">
      <div class="left">
        <div class="avatar-box" @dblclick="$emit('tickle')">
          <img :src="avatarUrl" alt="头像" />
        </div>
      </div>
      <div class="right">
        <div class="info-box">
          {{ content }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    avatarUrl: {
      type: String
    },
    content: {
      type: String
    },
    time: {
      type: String
    }
  }
}
</script>
<style scoped>
.receive-chat-box {
  padding: 2vw 4vw;
}
.time-box {
  text-align: center;
  font-size: 4vw;
  padding: 0 0 2vw 0;
}
.main-box {
  display: flex;
}
.left {
  flex: 1;
}
.right {
  flex: 8;
  padding: 0 2vw;
}
.avatar-box {
  border-radius: 50%;
  width: 11vw;
  height: 11vw;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.avatar-box img {
  max-width: 100%;
  max-height: 100%;
}
.info-box {
  background-color: #e8e3f1;
  width: 50vw;
  border-radius: 4vw;
  padding: 2vw 4vw;
  word-wrap: break-word;
}
</style>
