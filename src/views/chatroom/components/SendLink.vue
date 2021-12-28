<template>
  <div class="send-chat-box">
    <div class="time-box">
      {{ time }}
    </div>
    <div class="main-box">
      <div class="left" style="position: relative; ">
        <!-- <div
          v-if="status"
          style="
            position: absolute;
            right: 65vw;
            top: 50%;
            transform: translateY(-50%);
          "
        >
          <i v-show="status === 'uploading'" class="el-icon-loading" />
          <i
            v-show="status === 'error'"
            class="el-icon-info"
            style="color: #F56C6C;"
          />
        </div> -->
        <div class="info-box" @click="toHealingDetail">
          {{ content }}
        </div>
      </div>
      <div class="right">
        <div class="avatar-box" @dblclick="$emit('tickle')">
          <img :src="avatarUrl" alt="头像" />
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
    link: {
      type: String
    },
    time: {
      type: String
    }
  },
  methods: {
    toHealingDetail() {
      this.$router.push(this.link)
    }
  }
}
</script>
<style scoped>
.send-chat-box {
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
  flex: 8;
}
.right {
  flex: 1;
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
  background-color: #dbc7e2;
  width: 50vw;
  border-radius: 4vw;
  padding: 3vw 4vw;
  margin: 0 0 0 20vw;
  word-wrap: break-word;
  color: rgb(78, 188, 221);
  text-decoration: underline;
}
</style>
