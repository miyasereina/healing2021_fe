<template>
  <div class="input-chat-box">
    <input
      type="text"
      class="input-wrap"
      v-model="inputContent"
      @keyup.enter="sendMessage"
    />
    <button class="send-btn" @click="sendMessage">发送</button>
  </div>
</template>
<script>
export default {
  name: 'inputChat',
  data() {
    return {
      inputContent: ''
    }
  },
  methods: {
    sendMessage() {
      if (!this.inputContent) {
        return
      }
      this.$emit('send', this.inputContent)
      this.inputContent = ''
    },
    clear() {
      this.inputContent = ''
    }
  }
}
</script>
<style scoped>
.input-chat-box {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: #fff;
  height: 20vw;
  width: 100vw;
  align-items: center;
  justify-content: space-around;
}
.input-wrap {
  width: 65vw;
  height: 10vw;
  border-radius: 8px;
  border: 2px solid rgb(94, 93, 93);
  background-color: #fff;
  outline: none;
  padding: 0 3vw;
}
.send-btn {
  width: 18vw;
  height: 10vw;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgb(94, 93, 93);
  color: #000;
}
</style>
