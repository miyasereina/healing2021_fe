<template>
  <div class="rankpage">
    <nav-bar>
      <template #left>
        <back-btn />
      </template>

      <template #middle>
        <div class="rank-title">排&nbsp;&nbsp;&nbsp;行&nbsp;&nbsp;&nbsp;榜</div>
      </template>
    </nav-bar>
    <!-- <div class="topline">
      <ul class="schoollist">
        <li
          class="list"
          v-for="(school, i) in schools"
          :key="i"
          :class="i === typeC ? 'activedate' : '' "
          :type="i"
          @click="choose"
        >
          {{ school }}
        </li>
      </ul>
    </div> -->
    <div class="rankdetail">
      <div>
        <block class="fsheet" :User="topData[0]"></block>
      </div>

      <div>
        <block class="ssheet" :User="topData[1]"></block>
        <block class="ssheet" :User="topData[2]"></block>
      </div>
      <div>
        <block class="tsheet" :User="topData[3]"></block>
        <block class="tsheet" :User="topData[4]"></block>
        <block class="tsheet" :User="topData[5]"></block>
      </div>
      <div>
        <block class="frsheet" :User="topData[6]"></block>
        <block class="frsheet" :User="topData[7]"></block>
        <block class="frsheet" :User="topData[8]"></block>
        <block class="frsheet" :User="topData[9]"></block>
      </div>
    </div>
    <div class="myrank">
      <p>我的排名：{{ rank.rank }}</p>
    </div>
  </div>
</template>

<script>
import axios from '../../../axios'
import NavBar from '../../../components/NavBar.vue'
import Block from '../../healing/components/Block.vue'
import BackBtn from '@/components/BackBtn.vue'

export default {
  name: 'Rank',
  data() {
    return {
      UserId: 1,
      typeC: 0,
      returnData: [],
      topData: [],
      rank: 0,
      time: 0,
      checkindex: 0
      // schools: ['全部', '华工', '中大', '暨大', '华农', '华师', '广工', '广医']
    }
  },
  // activated () {
  //   document.getElementById('0').className = 'active'
  //   this.getUserRank()
  //   this.getSongRank()
  // },
  created() {
    this.getSongRank()
    this.getUserRank()
  },
  methods: {
    back() {
      this.$router.replace('/')
    },
    // choose (e) {
    //   this.typeC = +e.target.type
    //   this.getSongRank()
    //   this.getUserRank()
    //   // this.topData = this.returnData
    //   console.log(this.typeC)
    // },
    getSongRank() {
      this.topData = []
      // this.topData = this.fakeData
      var that = this
      axios
        .get('/healing/rank/All')
        .then(function(res) {
          console.log('donegetSongRank')
          that.returnData = res.data // returnData是该学校的返回数据
        })
        .finally(function(flag) {
          that.time = that.returnData.time
          // console.log(that.returnData, 'all')
          that.topData = that.returnData
        })
        .catch(function(err) {
          console.log(err)
          if (err.response.status === 403) {
            this.$store.commit('setToast', '加载排行榜失败')
          }
        })
    },
    getUserRank() {
      // console.log('getUserRank')
      // if (this.$store.state.userData.id) {
      //   this.userId = this.$store.state.userData.ID
      // }
      // var userId = '/user/rank?id=' + this.$store.state.userData.ID
      // axios.get(userId).then((res) => {
      //   this.rank = res.data.rank
      // })
      var that = this
      axios
        .get('/healing/rank/user')
        .then(function(res) {
          console.log(res.data);
          that.rank = res.data
          that.time = that.rank.time
        })
        .catch(function(err) {
          console.log(err)
          if (err.response.status === 403) {
            this.$store.commit('setToast', '加载用户排名失败')
          }
        })
    }
  },
  components: {
    NavBar,
    Block,
    BackBtn
  }
}
</script>

<style scoped>
.rankpage {
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  color: white;
}
.nav {
  position: relative;
  top: 1vh;
  height: 45px;
}
.backbtn {
  height: 100%;
  background-size: 100% auto;
}

.rank-title {
  width: 80vw;
  color: white;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .topline{
  position: relative;
  height: 50px;
  overflow-x: hidden;
  bottom: 5vh;
}
.schoollist{
  display: flex;
  overflow-x: scroll;
  position: relative;
  height: 40px;
  width: 100vw;
  margin-left: 5px;
  margin-right: 10px;
  list-style: none;
  background-size: 100% 130%;
}

.list{
  flex-shrink: 0;
  list-style: disc;
  opacity: 1;
  position: relative;
  display: inline-block;
  left: 0vw;
  text-align: center;
  color: black;
  width: 20vw;
  height: 35px;
  line-height: 40px;
  font-size: 4vw;
}

.activedate {
  z-index: 10;
  height: 45px;
  font-size: 6vw;
  background-size: 100% 120%;
} */

.fsheet {
  display: inline-table;
  bottom: 2vh;
}
.ssheet {
  display: inline-table;
  bottom: 2vh;
}
.tsheet {
  display: inline-table;
  bottom: 2vh;
}
.frsheet {
  display: inline-table;
  bottom: 2vh;
}
.rankdetail {
  margin: 8vh auto;
  position: relative;
  text-align: center;
}
.myrank {
  text-align: center;
  font-weight: 500;
}
</style>
