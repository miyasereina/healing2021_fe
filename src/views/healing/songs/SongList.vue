<script setup>
import { defineProps, defineEmits, toRef, ref, onMounted, watch } from 'vue'
import SongItem from './SongItem.vue'

const emits = defineEmits(['reachBottom'])
const props = defineProps({
  songList: {
    type: Array
  }
})
const songList = toRef(props, 'songList')

// const songListWrapper = ref(null)

// const scrollToBottomTrigger = () => {
//   if (
//     songListWrapper.value.scrollHeight -
//       (songListWrapper.value.scrollTop + songListWrapper.value.offsetHeight) <
//     10
//   ) {
//     emits('reachBottom')
//   }
// }

// onMounted(() => {
//   scrollToBottomTrigger()

//   songListWrapper.value.addEventListener('scroll', scrollToBottomTrigger)
// })
</script>

<template>
  <div class="song-list-wrapper" ref="songListWrapper">
    <song-item v-for="(song, i) in songList" :key="i" :song-data="song" />
  </div>
</template>

<!-- <script>
import { mapState, mapMutations } from 'vuex'
import SongItem from './SongItem.vue'
import axios from '@/axios'

export default {
  name: 'SongList',
  data() {
    return {
      songsData: {},
      songTypesPages: {},
      isRequesting: false
    }
  },
  created() {
    const allSongsTypes = [
      '推荐',
      '全部',
      '国语',
      '粤语',
      '英语',
      '日语',
      '流行',
      '古风',
      '民谣',
      '摇滚',
      '抖音热歌',
      'ACG'
    ]
    for (const type of allSongsTypes) {
      for (const sort in [0, 1]) {
        this.songsData[type + sort] = {}
        this.songsData[type + sort].sing = []
        this.songsData[type + sort].listen = []
        this.songTypesPages[type + sort] = 1
      }
    }
    this.getSongsData()
  },
  computed: {
    ...mapState({
      songTypes: 'songTypes',
      songTypeIndex: 'songTypeIndex',
      rankMode: 'songRankMode',
      songListMode: 'songListMode',
      isListModeToggling: 'isListModeToggling'
    }),
    songListMode() {
      return this.$store.state.songListMode ? 'listen' : 'sing'
    },
    songSlideData() {
      // return this.songTypes
      //   .flatMap((el) => [el, el])
      //   .map((el, i) => ({
      //     title: el,
      //     mode: i % 2,
      //     swiperIndex: Math.floor(i / 2)
      //   }))
    },
    songListSwiper() {
      return this.$refs.songListSwiper.$swiper
    },
    activeSongType() {
      return this.songTypes[this.songTypeIndex]
    }
  },
  methods: {
    ...mapMutations([
      'toggleSongListMode',
      'toggleSongRankMode',
      'changeListModeToggleState',
      'showHealingDialog'
    ]),
    getSongsData(style, language) {
      if (!this.isRequesting) {
        this.isRequesting = true
        style = style || ''
        language = language || ''
        let type
        if (!style && !language) {
          type = '全部'
        } else {
          type = style || language
        }
        // if (this.songTypesPages[type + this.rankMode] !== -1) {
        //   axios
        //     .get('/main/page', {
        //       params: {
        //         sort: this.rankMode,
        //         style,
        //         language,
        //         page: this.songTypesPages[type + this.rankMode]
        //       }
        //     })
        //     .then((res) => {
        //       if (style === '' && language === '') {
        //         res.data.sing
        //           .filter((el) => el.id !== 0)
        //           .map((el) => {
        //             this.songsData['全部' + this.rankMode].sing.push(el)
        //           })
        //         res.data.listen
        //           .filter((el) => el.id !== 0)
        //           .map((el) => {
        //             this.songsData['全部' + this.rankMode].listen.push(el)
        //           })
        //       } else {
        //         const propName = style || language
        //         res.data.sing
        //           .filter((el) => el.id !== 0)
        //           .map((el) => {
        //             this.songsData[propName + this.rankMode].sing.push(el)
        //           })
        //         res.data.listen
        //           .filter((el) => el.id !== 0)
        //           .map((el) => {
        //             this.songsData[propName + this.rankMode].listen.push(el)
        //           })
        //       }
        //       console.log(res.data)
        //       this.songListSwiper.update()
        //       this.$forceUpdate()
        //       this.isRequesting = false
        //     })
        //     .catch((err) => {
        //       console.log(err)
        //       if (err.response.status === 403) {
        //         const songType = this.songTypes[this.songTypeIndex]
        //         if (this.songTypesPages[type + this.rankMode] === 1) {
        //           this.$store.commit('setToast', '还没有歌曲数据哦~')
        //         } else {
        //           this.$store.commit('setToast', '找不到歌曲数据了哦~')
        //         }
        //         this.songTypesPages[songType + this.rankMode] = -1
        //       }
        //       setTimeout(() => {
        //         this.isRequesting = false
        //       }, 3000)
        //     })
        // }
      }
    },
    // updateSongsData (data) {
    //   const songListName =
    //     '' + this.songTypeIndex + this.songListMode + this.songRankMode
    //   if (!this.songsData[songListName]) {
    //     this.songsData[songListName] = data
    //   } else {
    //     data.map((el) => this.songsData[songListName].push(el))
    //   }
    // },
    isSlideShow(songSlide) {
      if (!this.isListModeToggling) {
        return (songSlide.mode ? 'listen' : 'sing') === this.songListMode
      } else {
        // return songSlide.mode === this.songListMode || songSlide.swiperIndex === this.songTypeIndex
        return true
      }
    },
    onSlideChangeHandler() {
      if (!this.isListModeToggling) {
        this.$store.commit('setSongTypeIndex', this.songListSwiper.activeIndex)
      }
    },
    changeListMode(mode) {
      // if (this.isListModeToggling) return
      // const timerPromise = new Promise((resolve) => {
      //   this.changeListModeToggleState()
      //   if (mode === 'listen') {
      //     this.songListSwiper.activeIndex = 2 * this.songTypeIndex
      //     this.$nextTick(() => {
      //       this.songListSwiper.slideNext(300)
      //     })
      //   } else {
      //     this.songListSwiper.activeIndex = 2 * this.songTypeIndex + 1
      //     this.$nextTick(() => {
      //       this.songListSwiper.slidePrev(300)
      //     })
      //   }
      //   setTimeout(() => resolve(), 350)
      // })
      // timerPromise.then(() => {
      //   this.toggleSongListMode()
      //   this.changeListModeToggleState()
      //   this.songListSwiper.activeIndex = this.songTypeIndex
      //   // console.log(this.currentSongListName)
      // })
    },
    changeRankMode() {
      // this.toggleSongRankMode()
      // if (
      //   !this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode].sing
      //     .length &&
      //   !this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode]
      //     .listen.length
      // ) {
      //   console.log(
      //     this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode]
      //   )
      //   this.updateSongsData()
      // }
    },
    updateSongsData() {
      const songType = this.songTypes[this.songTypeIndex]
      const languages = ['国语', '粤语', '英语', '日语']
      if (songType === '全部') {
        this.getSongsData()
      } else if (languages.includes(songType)) {
        this.getSongsData('', songType)
      } else {
        this.getSongsData(songType)
      }
    },
    updateSongPageIndex() {
      const songType = this.songTypes[this.songTypeIndex]
      if (this.songTypesPages[songType + this.rankMode] !== -1) {
        this.songTypesPages[songType + this.rankMode]++
      }
    },
    itemClickHandler(itemData) {
      if (itemData.songData.source === '') {
        console.log(itemData)
        this.showHealingDialog(itemData)
      } else {
        // this.setHealingDetailData(itemData.songData)
        this.$router.push('/healingDetail/' + itemData.songData.id)
      }
    }
  },
  watch: {
    songTypeIndex: function(val) {
      this.$nextTick(() => {
        this.songListSwiper.slideTo(val, 500, false)
        setTimeout(() => {
          if (
            !this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode]
              .sing.length &&
            !this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode]
              .listen.length
          ) {
            // console.log(this.songsData[this.songTypes[this.songTypeIndex] + this.rankMode])
            this.updateSongsData()
          }
        }, 600)
      })
    }
  },
  components: {
    SongItem
  }
}
</script> -->

<style scoped>
.song-list-wrapper {
  /* margin-bottom: 90px; */
  width: 100vw;
  height: auto;
  /* max-height: calc(50vh - 13vw - 20px); */
}
.tip-bottom {
  width: 100vw;
  text-align: center;
  color: #6c6b6f;
  font-size: 3.06vw;
  margin-top: 3vw;
}
</style>
