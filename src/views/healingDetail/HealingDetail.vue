<script>
export default {
  name: 'HealingDetail'
}
</script>
<template>
  <div class="page-container">
    <div class="top">
      <img
        @click="goBack"
        src="@/assets/fanhui.png" alt="" class="back-icon">
        <div class="song-name">
          {{user.song_name}}
        </div>
    </div>
    <div class="info">
      <div class="top">
        <img :src="user.avatar" alt="" class="icon" @click="toPersonal" />
        <div class="name" @click="toHealingDetail">{{ user.nickname }}</div>
        <div class="style">{{ user.style === '' ? '风格' : user.style }}</div>
        <div class="time">{{ formatter.formatDate(user.created_at, 7) }}</div>
      </div>
      <div class="bottom">
        {{ user.remark === '' ? `我点了一首《${user.song_name}》，快来治愈我吧~` : user.remark }}
      </div>
    </div>
    <div class="list-container">
      <song-item
        v-for="item of singer"
        :itemInfo='{...item,song_name:user.song_name}'
        :key="item.id"
      ></song-item>
      <!-- <div class="tips" v-if()></div> -->
    </div>
    <div class="btn-container">
      <div @click="toRecordPage" class="pillow">
        我也要唱
      </div>
    </div>
    <div v-if="store.state.currentMusic.file !== ''" class="placeholder"></div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from '@/axios.js'
import formatter from '@/utils/format.js'
import SongItem from './SongItem.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const store = useStore()
const route = useRoute()
let user = ref({})
let singer = ref({})
axios
  .get('/healingPage', { params: { selectionId: parseInt(route.params.id) } })
  .then((res) => {
    console.log(res);
    user.value = res.data.user
    singer.value = res.data.cover
  })
function toRecordPage() {
  router.push({
    path: '/record',
    query: {
      type: 'normal',
      name: user.value.song_name,
      id: route.params.id
    }
  })
}
function goBack() {
  router.go(-1)
}

const toPersonal = () => {
  router.push({
    path: '/personal',
    query: {
      id: user.value.user_id
    }
  })
}
// function isDisturbTime (time) {
//   return time.hour < 9 || (time.hour === 23 && time.minute >= 30)
// }
// function phoneHealing () {
//   const nowTime = new Date()
//   const hour = nowTime.getHours()
//   const minute = nowTime.getMinutes()
//   const time = {
//     hour,
//     minute
//   }
//   if (isDisturbTime(time)) {
//     setToast('23：30~9：00是免打扰时段哦')
//   } else {
//     if (dialogSongData.phone !== '') {
//       location.href = `tel:${this.dialogSongData.phone}`
//       if (this.wsConnectState && this.dialogSongData.userid !== 0) {
//         ws.send.message(this.userData.ID, this.dialogSongData.userid, '我向你发起了语音通话，现在我们可以聊天啦！')
//       }
//     } else {
//       this.setToast('对方没有留手机号哦，给他录一段音吧')
//     }
//   }
// }
</script>

<style lang="less" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .top {
    width: 100%;
    height: 74px;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 26px;
    .song-name{
      width: 200px;
      text-align: center;
      // display: flex;
      justify-content: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 22px;
    }
    .back-icon {
      position: absolute;
      top: 18px;
      left: 23px;
      height: 34px;
    }
    // background-color: #fff;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    height: 140px;
    width: 84vw;
    border: 2px solid white;
    border-radius: 6px;
    .top {
      margin-top: 5px;
      display: flex;
      justify-content: space-around;
      font-size: 14px;
      height: 60px;
      .icon {
        margin-left: 5px;
        height: 45px;
        border-radius: 50%;
      }
      .name {
        font-size: 17px;
        width: 20vw;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .style {
        font-size: 12px;
        border: 1px solid white;
        border-radius: 3px;
        padding: 1px 3px;
      }
      .time {
        width: 80px;
        margin-right: 5px;
      }
    }
    .bottom {
      color: white;
      padding: 6px 14px 0 14px;
    }
  }
  .list-container {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    align-items: center;
    flex: 1;
    width: 100%;
    min-height: 0;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .btn-container {
    height: 100px;
    display: flex;
    justify-content: center;
    width: 100%;
    .pillow {
      width: 90px;
      height: 40px;
      color: rgb(82, 82, 82);
      font-size: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('../../assets/pillow.png');
      background-size: 100% 100%;
    }
  }
  .placeholder {
    height: 20px;
    width: 20px;
  }
}
</style>
