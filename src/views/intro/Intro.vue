<template>
<div style="height:100vh;">
  <div style="height:5vh;"></div>
  <img class="kite" src="../../assets/kite5.png" />
  <div class="alltextbox">
    <div
      v-for="(intro, i) in introText"
      class="textbox"
      :style="{ animationDelay: 1.5 * i + 's' }"
      :key="i"
    >
      {{ intro }}
    </div>
    <!-- <div class="textbox">引导的第一句话</div>
    <div
      class="textbox"
      style="animation-delay:1.5s;-webkit-animation-delay:1.5s;"
    >
      引导的第二句话
    </div>
    <div class="textbox" style="animation-delay:3s;-webkit-animation-delay:3s;">
      引导的第三句话
    </div> -->
  </div>
  <div style="height:25vh;"></div>
  <div class="titlebox">
    <!-- <span>治</span>&nbsp;<span>愈</span>&nbsp;<span>系</span> -->
    <img class="title" src="../../assets/title.png" />
  </div>
  <div class="btnbox">
    <n-button
      round
      style="font-weight: bold;--text-color: black;--text-color-focus: rgb(44,241,211);
--border-focus: 1px solid rgb(44,241,211);--width:30vw;--color:white;"
      @click="toHealing"
    >
      开始治愈
    </n-button>
  </div>
  <!-- <Bgcloud></Bgcloud> -->
</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Bgcloud from './Bgcloud.vue'
export default defineComponent({
  setup() {
    const router = useRouter()

    const introText = [
      '如果把童年再放映一遍',
      '我们一定会先大笑',
      '然后放声大哭，最后挂着泪，微笑着睡去',
      '——————《龙猫》'
    ]

    const toHealing = () => {
      router.replace('/')
    }

    return {
      introText,
      toHealing
    }
  },
  components: {
    Bgcloud
  }
})
</script>
<style scoped>
.btnbox {
  text-align: center;
  animation: btn 1.5s;
  animation-iteration-count: 1;
  -webkit-animation: btn 1.5s;
  -webkit-animation-iteration-count: 1;
  opacity: 0;
  animation-fill-mode: forwards;

  animation-delay: 11.5s;
  -webkit-animation-delay: 11.5s;
}
@keyframes btn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes btn /*Safari and Chrome*/ {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.textbox {
  margin: 0 auto;
  width: 80vw;
  z-index: 3;
  height: 15vh;
  font-family: '宋体';
  color: white;
  font-weight: bolder;
  font-size: 5vw;
  letter-spacing: 1vw;
  text-align: left;
  animation: intro 1.5s;
  animation-iteration-count: 1;
  -webkit-animation: intro 1.5s;
  -webkit-animation-iteration-count: 1;
  opacity: 0;
  animation-fill-mode: forwards;
}
@keyframes intro {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@-webkit-keyframes intro /*Safari and Chrome*/ {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.alltextbox {
  animation-fill-mode: forwards;
  animation: disappear 2s;
  animation-iteration-count: 1;
  -webkit-animation: disappear 2s;
  -webkit-animation-iteration-count: 1;
  animation-delay: 6s;
  -webkit-animation-delay: 6s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes disappear {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@-webkit-keyframes disappear /*Safari and Chrome*/ {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.title {
  width: 70vw;
  transform: translateY(10vh);
  /* transform: translate(-50%, 10vh); */
}
.titlebox {
  height: 45vh;
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: '宋体';
  color: white;
  font-weight: bolder;
  font-size: 13vw;
  letter-spacing: 3vh;
  text-align: center;
  opacity: 0;

  animation-fill-mode: forwards;
  animation: title 3s;
  animation-iteration-count: 1;
  -webkit-animation: title 3s;
  -webkit-animation-iteration-count: 1;
  animation-delay: 8.5s;
  -webkit-animation-delay: 8.5s;
  -webkit-animation-fill-mode: forwards;
}
@keyframes title {
  from {
    opacity: 0;
    font-size: 0vw;
  }
  to {
    opacity: 1;
    font-size: 13vw;
  }
}

@-webkit-keyframes title  /*Safari and Chrome*/ {
  from {
    opacity: 0;
    font-size: 0vw;
  }
  to {
    opacity: 1;
    font-size: 13vw;
  }
}
.kite {
  left: 20vw;
  width: 60vw;
  position: absolute;
  top: 20vh;
}
</style>
