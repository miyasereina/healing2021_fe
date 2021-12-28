<template>
  <div class="nav-bar">
    <div class="options">
      <div class="option">
        <img
          @click="routerReplace('/')"
          id="taghealing"
          :class="{ greyIcon: currentPage !== 'healing' }"
          src="../assets/healing.png"
          alt=""
        />
        <div class="text">治愈</div>
      </div>
      <div class="option">
        <img
          @click="routerReplace('/square')"
          id="tagsquare"
          :class="{ greyIcon: currentPage !== 'square' }"
          src="../assets/square.png"
          alt=""
        />
        <div class="text">广场</div>
      </div>
      <div class="option">
        <n-badge :value="$store.getters.unreadMsgNum" :max="99">
          <img
            @click="routerReplace('/message')"
            id="tagMes"
            :class="{ greyIcon: currentPage !== 'message' }"
            src="../assets/message.png"
            alt=""
          />
        </n-badge>
        <div class="text">消息</div>
      </div>
      <div class="option">
        <img
          @click="routerReplace('/personal')"
          id="tagMine"
          :class="{ greyIcon: currentPage !== 'mine' }"
          src="../assets/mine.png"
          alt=""
        />
        <div class="text">我的</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    currentPage: {
      type: String,
      default: 'healing'
    }
  },
  methods: {
    routerReplace(to) {
      if (this.$route.path !== to) {
        if(to!=='/personal') {
        this.$router.replace(to)
        } else {
          this.$router.replace({
            name:'Personal',
            params:{
              id:-1,
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 78px;
  font-size: 15px;
  font-weight: bold;
  z-index: 200;
  line-height: 1;
  border-top: 2px solid #364e84;
  background-color: #0b314b;

  // .bg {
  //   z-index: -200;
  //   position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   height: 20vw;
  //   width: 100vw;
  //   background: rgb(49, 57, 77);
  //   opacity: 85%;
  // }
  .options {
    width: 100vw;
    margin-top: 8px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    text-align: center;
    color: white;
    font-weight: 400;
    font-size: 12px;
    .option {
      .text {
        margin-top: 2px;
      }
    }
  }
}

.option img {
  width: 10vw;
  height: 10vw;
}

.greyIcon {
  filter: grayscale(100%);
}
</style>
