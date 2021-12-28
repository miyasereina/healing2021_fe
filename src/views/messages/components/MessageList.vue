<template>
  <div class="info-box">
    <div class="left-box">
      <div class="avatar-box">
        <img :src="avatarUrl" alt="头像">
      </div>
    </div>
    <div class="right-box">
      <div class="top-content">
        <div class="username-box" style="width: 0; flex: 1;overflow: hidden; text-overflow: ellipsis;">{{nickname}}</div>
        <div class="time-box">{{time}}</div>
      </div>
      <div class="bottom-content" style="display: flex;">
        <div class="content-box" style="width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis;">{{type !==1 ? systemMes : userMes}}</div>
        <el-badge :value="newMsg" style="flex: none;" :max="99" :hidden="newMsg < 1" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'messageList',
  props: {
    nickname: {
      type: String
    },
    time: {
      type: String
    },
    avatarUrl: {
      type: String
    },
    systemMes: {
      type: String
    },
    userMes: {
      type: String
    },
    type: {
      type: Number
    },
    newMsg: {
      type: Number
    }
  }
}
</script>

<style scoped>

</style>>
