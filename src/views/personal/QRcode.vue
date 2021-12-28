<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import VueQr from '@chenfengyuan/vue-qrcode'
import html2canvas from 'html2canvas'
import NavBar from '@/components/NavBar.vue'
import BackBtn from '@/components/BackBtn.vue'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()
const imageSrc = ref('')
const isImageCreated = ref(false)

const qrcodeUrl =
  'https://healing2021.100steps.top/' +
  `#/record?type=normal&id=${route.query.id}&name=${route.query.song_name}&user=${store.state.user.id}`

store.commit('setToast', '生成分享图片中...')

const generateImage = async () => {
  if (imageSrc.value) {
    isImageCreated.value = true
    return
  }

  const sharePage = document.querySelector('.mainbox')
  const width = sharePage.offsetWidth
  const height = sharePage.offsetHeight
  const canvas = document.createElement('canvas')
  const scale = 2
  canvas.width = String(+width * scale)
  canvas.height = String(+height * scale)

  const options = {
    scale,
    canvas,
    allowTaint: true,
    width,
    height,
    dpi: 4,
    useCORS: true
  }

  const canvasInstace = await html2canvas(sharePage, options)
  const context = canvasInstace.getContext('2d')

  context.mozImageSmoothingEnabled = false
  context.webkitImageSmoothingEnabled = false
  context.msImageSmoothingEnabled = false
  context.imageSmoothingEnabled = false

  imageSrc.value = canvasInstace.toDataURL('png')
  isImageCreated.value = true
  store.commit('setToast', '长按图片保存分享吧～')
}

onMounted(() => {
  generateImage()
})
</script>

<template>
  <div class="navbar-absolute">
    <nav-bar>
      <template #left>
        <back-btn />
      </template>
    </nav-bar>
  </div>
  <div class="box">
    <div class="mainbox" v-if="!isImageCreated">
      <!-- <p>我点了一首歌，快来治愈我吧～</p> -->
      <div class="borderbox">
        <p class="p1">治愈系</p>
        <p class="p2">扫码唱歌</p>
        <div class="imgborder">
          <vue-qr :value="qrcodeUrl" :options="{ width: 120 }" />
        </div>
      </div>
    </div>
    <div class="share-image" v-else>
      <img :src="imageSrc" alt="" />
    </div>
  </div>
</template>

<!-- <script>
import QRCode from 'qrcodejs2'
import BackBtn from '../../components/BackBtn.vue'
export default {
  components: { BackBtn },
  name: 'QRCode',
  data() {
    return {}
  },
  mounted: function() {
    this.$nextTick(function() {
      this.bindQRCode()
    })
  },
  methods: {
    bindQRCode: function() {
      let id = toString(this.$route.query.selectionId)
      new QRCode(this.$refs.qrCodeDiv, {
        // url待补充
        text: 'https://healing2021.100steps.top',
        width: 200,
        height: 200,
        colorDark: '#333333', //二维码颜色
        colorLight: '#ffffff', //二维码背景色
        correctLevel: QRCode.CorrectLevel.H //容错率，L/M/H
      })
      let canvas = document.getElementsByTagName('canvas')[0]
      let img = convertCanvasToImage(canvas)
      $('#qrcode').append(img) // 添加DOM
      //从 canvas 提取图片 image
      function convertCanvasToImage(canvas) {
        //新建Image对象
        let image = new Image()
        // canvas.toDataURL 返回的是一串Base64编码的URL
        image.src = canvas.toDataURL('image/png')
        return image
      }
    }
  }
}
</script> -->

<style scoped>
.navbar-absolute {
  position: absolute;
  top: 0;
  left: 0;
}

p {
  margin: 0;
  padding: 0;
}

.qrcode {
  /*display: inline-block;*/
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translateY(29vh); */
  /*height: 90vh;*/
}
.qrcode img {
  /* width: 90vw;
        height: 90vw; */
  background-color: #fff; /*设置白色背景色*/
  padding: 10vw; /* 利用padding的特性，挤出白边*/
  box-sizing: border-box;
  -webkit-touch-callout: none;
}
/* .background{
  background-image: url('../../assets/qrcode.jpg');
  background-size: cover;
  height: 60vh;
} */
.box {
  height: 100vh;
}
.title-box {
  margin: 0 auto 5px;
  width: 100vw;
  height: 100vh;
  text-align: center;
  display: flex;
}
.title-box .title {
  width: 80vw;
  border-bottom: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 5vw;
}
.p1 {
  text-align: center;
  color: #eae3e3;
  font-size: 7vw;
  letter-spacing: 0.5vw;
  font-family: '宋体';
  border-style: solid;
  border-bottom: none;
  padding-top: 5vw;
  border-width: 3vw;
  padding-bottom: 5vw;
  margin-bottom: 0;
}
.p2 {
  color: #eae3e3;
  font-size: 10vw;
  text-align: center;
  font-family: '宋体';
  margin-top: 0;
  margin-bottom: 0;
}
/* .borderbox{
   width: 67vw; 
} */
.mainbox {
  height: 100%;
  color: #eae3e3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('../../assets/bg.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.borderbox {
  width: 60vw;
}
.imgborder {
  color: #eae3e3;
  border-style: solid;
  border-top: none;
  border-width: 3vw;
  padding: 7vw;
}
.imgborder canvas {
  margin: 0 auto;
  display: block;
}

.share-image {
  width: 100vw;
  height: 100vh;
}
.share-image img {
  width: 100%;
}
</style>
