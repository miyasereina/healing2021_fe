<template>
  <div class="dailyrank">
    <div class="top">
      <img class="backbtn" @click="back" src="../../../assets/BackBtn.png" />
        <div class="hot-title">热&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;榜</div>
    </div>
    <div class="dateline">
      <img class="all" src="../../../assets/calendar.png" @click="showall" />
      <ul class="datelist">
        <li
          class="date"
          v-for="eday in dateList"
          :key="eday.i"
          :class="eday.i === dateC ? 'activedate' : 'date'"
          @click="choose(eday.i)"
        >
          {{ eday.day }}
        </li>
      </ul>
    </div>
    <div class="listdetail">
      <hot-song
        v-for="(item, i) of hotitem"
        :key="i"
        :playingID="playingID"
        :user="item.nickname"
        :avatar="item.avatar"
        :time="item.post_time"
        :name="item.song_name"
        :id="item.cover_id"
        :OnWhichpage="'Toptoday'"
        :user_id="item.cover_id"
      >
      </hot-song>
    </div>

  </div>
</template>

<script>
import axios from '@/axios'


import HotSong from './components/HotSong.vue'


export default {
  name: 'dailyrank',
  components: { HotSong },
  data() {
    return {
      playingID: 0,
      returnData: [],
      hotitem: [],
      nowDate: '',
      chosedDate: '',
      startDay: '1',
      day: '',
      date: [],
      dateL: 0,
      dateC: 0,
      dateNum: 0,
      playing: ''
    }
  },
    computed: {
  
      dateList: function() {
        return this.date
      }
    },
  created() {
    this.formatDate()
    this.date.push({
      day: this.nowDate,
      i: this.dateNum++
    })
    let datee = new Date()
    let month = (datee.getMonth() + 1 < 10 ? '0' : '') + (datee.getMonth() + 1)

    this.day = datee.getDate() < 10 ? '0' + datee.getDate() : datee.getDate()
    let d = this.day
    for (; d >= this.startDay; d--) {
      const dday = `${month}-${d}`
      this.date.push({ day: dday, i: this.dateNum++ })
    }
    axios
      .get(`/healing/dailyrank/${this.nowDate}`)
      .then((res) => {
        this.returnData = res.data
      })
      .catch((err) => {
        console.log('Error', err.message)
        if (err.response.status === 403) {
          this.$store.commit('setToast', '加载排行榜失败')
        }
      })
      .finally(() => {
        this.hotitem = this.returnData
      })
  },
  mounted() {
    this.currentDate()
  },
  methods: {
    back() {
      this.$router.replace('/')
    },
    currentDate() {
      setInterval(this.formatDate, 500)
    },
    formatDate() {
      let datee = new Date()
      let month =
        datee.getMonth() + 1 < 10
          ? '0' + datee.getMonth() + 1
          : datee.getMonth() + 1
      let day = datee.getDate() < 10 ? '0' + datee.getDate() : datee.getDate()
      this.nowDate = `${month}-${day}`
    },
    showall() {
      axios
        .get('/healing/dailyrank/all')
        .then((res) => {
          this.returnData = res.data
        })
        .catch((err) => {
          console.log('Error', err.message)
          if (err.response.status === 403) {
            this.$store.commit('setToast', '加载排行榜失败')
          }
        })
        .finally(() => {
          this.hotitem = this.returnData
        })
    },

    choose(index) {

      this.dateC = index

      var that = this
      let dateF = new Date()
      let monthF =
        dateF.getMonth() + 1 < 10
          ? '0' + (dateF.getMonth() + 1)
          : dateF.getMonth() + 1
      let dayF =
        dateF.getDate() - index < 10
          ? '0' + (dateF.getDate() - index)
          : dateF.getDate()
      this.chosedDate = `${monthF}-${dayF}`
      axios
        .get(`/healing/dailyrank/${this.chosedDate}`)
        .then(function(res) {
          that.returnData = res.data
        })
        .catch((err) => {
          console.log('Error', err.message)
          if (err.response.status === 403) {
            this.$store.commit('setToast', '加载排行榜失败')
          }
        })
        .finally(function() {
          that.hotitem = that.returnData
        })

      console.log(this.dateC)
    }

  },
  beforeDestroy() {
    if (this.formatDate) {
      clearInterval(this.formatDate)
    }
  }
}
</script>

<style lang="less" scoped>
.dailyrank {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.top{
  position: relative;
  margin-top: 13px;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .hot-title{
    color: white;
    font-size: 26px;
  }
  .backbtn {
    position: absolute;
    left: 25px;
    top:15px;
    height: 30px;
  }
  
}

.dateline {
  display: flex;
  height: 60px;
  overflow-x: hidden;
  overflow-y: hidden ;
  margin-right: 3vw;
  margin-left: 3vw;
  align-items: center;
  .all {
    height: 7vw;
    margin-left: 20px;
  }
  .datelist {
    flex: 1;
    min-width: 0;
    display: flex;
    overflow-x: scroll;
    position: relative;
    width: 70vw;
    margin-left: 4vw;
    margin-right: 4vw;
    list-style: none;
    background-size: 100% 130%;
    padding: 0;
    .date {
      flex-shrink: 0;
      list-style: disc;
      opacity: 1;
      position: relative;
      display: inline-block;
      left: 0vw;
      text-align: center;
      color: rgb(255, 255, 255);
      width: 70px;
      line-height: 16px;
      font-size: 16px;
    }
  }
}

.listdetail {
  width: 100%;
  height: 50%;
  overflow-y: scroll;
  position: relative;
  list-style: none;
}

</style>
