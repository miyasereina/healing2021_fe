


<template>
  <div class="nav-bar">
    <div class="bg"></div>
    <div class="options">
      <div class="option">
        <img
          @click="routerReplace('/')"
          id="taghealing"
          :class="{ greyIcon: currentPage !== 'healing' }"
          src="../assets/healing.png"
          alt=""
        />
        <div>治愈</div>
      </div>
      <div class="option">
        <img
          @click="routerReplace('/square')"
          id="tagsquare"
          :class="{ greyIcon: currentPage !== 'square' }"
          src="../assets/square.png"
          alt=""
        />
        <div>广场</div>
      </div>
      <div class="option">
        <img
          @click="routerReplace('/message')"
          id="tagMes"
          :class="{ greyIcon: currentPage !== 'message' }"
          src="../assets/message.png"
          alt=""
        />
        <div>消息</div>
      </div>
      <div class="option">
        <img
          @click="routerReplace('/personal')"
          id="tagMine"
          :class="{ greyIcon: currentPage !== 'mine' }"
          src="../assets/mine.png"
          alt=""
        />
        <div>我的</div>
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
        this.$router.replace(to)
      }
    }
  }
}
</script>

<style scoped>
.nav-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20vw;
  font-size: 4.2vw;
  font-weight: bold;
  z-index: 200;
  line-height: 1;
  border-top: 0.8vw solid rgb(59, 81, 138);
}
.bg {
  z-index: -200;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 20vw;
  width: 100vw;
  background: rgb(49, 57, 77);
  opacity: 85%;
}
.options {
  width: 100vw;
  padding-top: 2vw;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  text-align: center;
  color: white;
  font-weight: 500;
}

.option div {
  margin-top: 1vw;
}

.option img {
  width: 10vw;
  height: 10vw;
}

.greyIcon {
  filter: grayscale(100%);
}
</style>
