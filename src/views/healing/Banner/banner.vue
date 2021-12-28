<script setup>
import SwiperCore, { Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.min.css'

const modules = [Autoplay]

SwiperCore.use(modules)

const bannerList = [
  {
    src:
      'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211116134853.jpg',
    to: '/twoSinger'
  },
  {
    src:
      'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211111112106.jpg'
  },
  {
    src:
      'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211117235937.jpg'
  },
  {
    src:
      'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211119200830.jpg'
  }
]
</script>

<template>
  <div class="banner-wrapper">
    <swiper :space-between="50" :autoplay="{ delay: 4000 }">
      <swiper-slide v-for="(img, i) in bannerList" :key="i">
        <img
          class="carousel-img"
          :src="img.src"
          @click="img.to && $router.push(img.to)"
        />
      </swiper-slide>
    </swiper>
    <!-- <n-carousel autoplay>
      <img
        v-for="(img, i) in bannerList"
        :key="i"
        class="carousel-img"
        :src="img.src"
        @click="img.to && $router.push(img.to)"
      />
    </n-carousel> -->
  </div>
</template>

<!-- <script>
export default {
  name: 'banner',
  data() {
    return {
      bannerList: [
        {
          src:
            'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211111112128.jpg',
          to: '/twoSinger'
        },
        {
          src:
            'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211111112106.jpg'
        },
        {
          src:
            'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211111112050.jpg'
        }
      ]
    }
  },
  methods: {
    bannerJump(path) {
      if (path) {
        this.$router.push(path)
      }
    }
  }
}
</script> -->

<style scoped>
.banner-wrapper {
  margin: 0 auto;
  width: 100vw;
  height: 20vh;
}
.swiper-container img {
  display: block;
  margin: 0 auto;
  width: 90%;
  max-height: 20vh;
}
</style>
