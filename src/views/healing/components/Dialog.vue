<!--
弹窗
-->
<template>
  <div
    class="mask"
    v-show="isShow"
    @click.self="maskClickHandler"
    @touchmove.prevent
    ref="mask"
  >
    <div ref="dialogWindow" class="dialog-window">
      <div ref="avatar" class="user-avatar">
        <div class="avatar-img">
          <img :src="dialogSongData.avatar" alt="">
        </div>
      </div>
      <div class="substitute" v-show="isSubstituteShow">
        <div ref="subUsername" class="username">
          {{ dialogSongData.user }}
        </div>
        <div ref="subSongDate" class="song-date">
          {{ dialogDate }}
        </div>
        <div ref="subSongName" class="song-name">
          <div class="song-name-text">
            {{ dialogSongData.name ? dialogSongData.name.substr(0, 10) : '' }}
          </div>
        </div>
      </div>
      <div
        class="song-data"
        v-show="isTrueDataShow"
        ref="trueData"
      >
        <div class="fake-avatar" ref="fakeAvatar">
          <div class="avatar-img" @click="toProfile">
            <img :src="dialogSongData.avatar" alt="">
          </div>
        </div>
        <div class="top-part">
          <div class="username">
            <span>{{ username }}</span>
            <span>{{ dialogSongData.sex === 1 ? '♂' : '♀'}}</span>
          </div>
          <div class="date">
            <span>{{ dialogDate }}</span>
            <span>{{ dialogTime }}</span>
          </div>
        </div>
        <div ref="separator" class="separator"></div>
        <div class="bot-part">
          <div class="song-name-text">
            <div class="song">
              <span class="song-name">{{ dialogSongData.name }}</span>
              <span class="artist-name">{{ dialogSongData.singer }}</span>
            </div>
            <div class="remark">
              {{ dialogSongData.more }}
            </div>
          </div>
          <div class="healing-btn-wrapper">
            <button class="healing-btn" @click="phoneHealing">电话治愈</button>
            <button class="healing-btn" @click="recordHealing">录音治愈</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import ws from '@/websocket/index.js'

export default {
  name: 'HealingDialog',
  data () {
    return {
      isSubstituteShow: true,
      isTrueDataShow: false
    }
  },
  computed: {
    ...mapState({
      isShow: 'isHealingDialogShow',
      healingDialogData: 'healingDialogData',
      wsConnectState: 'wsConnectState',
      userData: 'userData'
    }),
    username () {
      if (this.dialogSongData.user) {
        if (this.dialogSongData.user.length > 6) {
          return this.dialogSongData.user.substr(0, 6) + '…'
        } else {
          return this.dialogSongData.user
        }
      } else {
        return ''
      }
    },
    dialogSongData () {
      return this.healingDialogData.songData
    },
    songItemDOM () {
      return this.healingDialogData.itemDOM
    },
    dialogWindow () {
      return this.$refs.dialogWindow
    },
    avatar () {
      return this.$refs.avatar
    },
    subUsername () {
      return this.$refs.subUsername
    },
    subSongDate () {
      return this.$refs.subSongDate
    },
    subSongName () {
      return this.$refs.subSongName
    },
    trueData () {
      return this.$refs.trueData
    },
    separator () {
      return this.$refs.separator
    },
    dialogDate () {
      return this.dialogSongData.time ? this.dialogSongData.time.split('T')[0] : ''
    },
    dialogTime () {
      return this.dialogSongData.time ? this.dialogSongData.time.split(/[TZ+]/)[1] : ''
    }
  },
  methods: {
    maskClickHandler () {
      this.resetAll()
    },
    resetAll () {
      (() => {
        return new Promise(resolve => {
          setTimeout(() => {
            this.trueData.style.opacity = '0'
            this.separator.style.width = '0'
            this.$refs.fakeAvatar.style.opacity = '0'
            resolve()
          }, 0)
        })
      })().then(() => new Promise(resolve => {
        setTimeout(() => {
          this.isSubstituteShow = true
          this.isTrueDataShow = false
          Object.assign(this.dialogWindow.style, {
            width: '80px',
            height: '70px',
            top: this.songItemDOM.getBoundingClientRect().top + 'px',
            transform: 'rotate(0deg)'
          })
          Object.assign(this.avatar.style, {
            left: '0',
            top: '0',
            transform: 'rotate(0deg)'
          })
          resolve()
        }, 200)
      })).then(() => new Promise(resolve => {
        setTimeout(() => {
          Object.assign(this.dialogWindow.style, {
            width: '100vw',
            borderRadius: '0'
          })
          Object.assign(this.subUsername.style, {
            opacity: '1',
            left: '0'
          })
          Object.assign(this.subSongDate.style, {
            opacity: '1',
            left: '0'
          })
          Object.assign(this.subSongName.style, {
            opacity: '1',
            left: '100px'
          })
          resolve()
        }, 200)
      })).then(() => {
        setTimeout(() => this.hideHealingDialog(), 200)
      })
    },
    phoneHealing () {
      console.log(this.dialogSongData)
      // this.resetAll()
      const nowTime = new Date()
      const hour = nowTime.getHours()
      const minute = nowTime.getMinutes()
      const time = {
        hour,
        minute
      }
      // alert(time.hour)
      // alert(time.minute)
      if (this.isDisturbTime(time)) {
        this.setToast('23：30~9：00是免打扰时段哦')
      } else {
        if (this.dialogSongData.phone !== '') {
          location.href = `tel:${this.dialogSongData.phone}`
          if (this.wsConnectState && this.dialogSongData.userid !== 0) {
            ws.send.message(this.userData.ID, this.dialogSongData.userid, '我向你发起了语音通话，现在我们可以聊天啦！')
          }
        } else {
          this.setToast('对方没有留手机号哦，给他录一段音吧')
        }
        // this.$axios({
        //   url: '/usermodel/' + this.dialogSongData.userid
        // }).then(res => {
        //   console.log(res)
        //   // alert(res.data.Phone)
        //   if (res.data.Phone) {
        //     location.href = `tel:${res.data.Phone}`
        //     if (this.wsConnectState) {
        //       ws.send.message(this.userData.ID, this.dialogSongData.userid, '我向你发起了语音通话，现在我们可以聊天啦！')
        //     }
        //   } else {
        //     this.setToast('对方没有留手机号哦，给他录一段音吧')
        //   }
        // }).catch(err => {
        //   this.setToast('对方没有留手机号哦，给他录一段音吧')
        //   console.log(err)
        // })
        // location.href = 'tel:示例电话'
      }
    },
    recordHealing () {
      this.resetAll()
      this.$router.push({
        path: '/record',
        query: {
          id: this.dialogSongData.id || this.dialogSongData.vodid,
          name: this.dialogSongData.name,
          type: 'song'
        }
      })
      console.log(this.dialogSongData)
    },
    isDisturbTime (time) {
      return time.hour < 9 || (time.hour === 23 && time.minute >= 30)
    },
    toProfile () {
      console.log(this.dialogSongData)
      if (this.dialogSongData.userid !== 0) {
        this.$router.push('/profile?id=' + this.dialogSongData.userid)
      } else {
        const randomNum = Math.floor(Math.random() * 3)
        const messages = [
          '你拍了拍匿名小伙伴~',
          '人家都匿名了，不要点我啦！',
          '不要点我，人家害羞'
        ]
        this.$store.commit('setToast', messages[randomNum])
      }
    },
    ...mapMutations([
      'hideHealingDialog',
      'setToast'
    ])
  },
  watch: {
    isShow (val) {
      if (val) {
        Object.assign(this.dialogWindow.style, {
          top: this.songItemDOM.getBoundingClientRect().top + 'px',
          left: this.songItemDOM.getBoundingClientRect().left + 'px'
        })
        ;(() => new Promise(resolve => {
          setTimeout(() => {
            Object.assign(this.dialogWindow.style, {
              width: '80px',
              borderRadius: '15px'
            })
            Object.assign(this.subUsername.style, {
              opacity: '0',
              left: '0'
            })
            Object.assign(this.subSongDate.style, {
              opacity: '0',
              left: '0'
            })
            Object.assign(this.subSongName.style, {
              opacity: '0',
              left: '0'
            })
            resolve()
          }, 0)
        }))().then(() => new Promise(resolve => {
          setTimeout(() => {
            this.isSubstituteShow = false
            this.isTrueDataShow = true
            Object.assign(this.dialogWindow.style, {
              width: '240px',
              height: '300px',
              top: 'calc(50vh - 120px)',
              transform: 'rotate(-90deg)'
            })
            Object.assign(this.avatar.style, {
              left: '155px',
              top: '10px',
              transform: 'rotate(90deg)'
            })
            this.$refs.fakeAvatar.style.opacity = '1'
            resolve()
          }, 200)
        }).then(() => {
          setTimeout(() => {
            this.trueData.style.opacity = '1'
            this.separator.style.width = '80%'
          }, 100)
        }))
      }
    }
  }
}
</script>
