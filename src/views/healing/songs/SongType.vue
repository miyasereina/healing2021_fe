<script setup>
import {
  defineProps,
  defineEmits,
  ref,
  toRef,
  computed,
  watch,
  nextTick
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const emits = defineEmits(['update:value'])
const props = defineProps({
  value: String
})

const store = useStore()
const router = useRouter()

const songTypes = toRef(store.state.user, 'hobby')
const songTypeIndex = ref(0)
const isTypeChanging = ref(false)
const songTypeContainer = ref(null)
const songTypeList = ref(null)

const songTypeValue = computed(() => {
  return ['all', 'recommend', ...songTypes.value][songTypeIndex.value]
})

const setSongTypeIndex = (index) => {
  songTypeIndex.value = index
}

const songTypeScroll = (distance, duration) => {
  const easeInOutComputed = (time) => {
    const a = (2 * distance) / (duration * duration)
    let changeDistance
    if (time < duration / 2) {
      changeDistance = a * time * time
    } else {
      changeDistance = -a * (time - duration) * (time - duration) + distance
    }
    return changeDistance
  }

  const initLeft = songTypeList.value.scrollLeft
  const interval = duration / 100
  let t = 0
  const scrollTransition = setInterval(() => {
    if (t < duration) {
      songTypeList.value.scrollLeft = initLeft + easeInOutComputed(t)
      t += interval
    } else {
      isTypeChanging.value = false
      clearInterval(scrollTransition)
    }
  }, interval)
}

const listScrollHandler = () => {
  if (!isTypeChanging.value) {
    // console.log(this.songTypeList.scrollLeft)
    songTypeContainer.value.style.setProperty(
      '--hint-left',
      -songTypeList.value.scrollLeft + 'px'
    )
  }
}

watch(songTypeIndex, () => {
  isTypeChanging.value = true

  emits('update:value', songTypeValue.value)

  // 更新index的值后，nextTick才会更新DOM元素，回调才能获取到新元素的宽度
  nextTick(() => {
    const activeSongType = document.getElementsByClassName(
      'song-type-active'
    )[0]
    const startPosition =
      activeSongType.offsetLeft -
      songTypeList.value.scrollLeft +
      songTypeContainer.value.offsetLeft
    const endPosition =
      (document.body.clientWidth - activeSongType.offsetWidth) * 0.45
    // const endPosition = (this.songTypeList.offsetWidth - activeSongType.offsetWidth) * 0.6 // 不是乘0.5 使中点位于屏幕中央而不是元素中央
    const distance = startPosition - endPosition
    songTypeScroll(distance, 500)
  })
})

const selectType = () => {
  router.push('/preference')
}
</script>

<template>
  <div class="song-type">
    <div class="song-type-wrapper">
      <div class="song-type-container" ref="songTypeContainer">
        <ul
          ref="songTypeList"
          class="song-type-list"
          @scroll="listScrollHandler"
        >
          <li
            v-for="(type, index) in ['全部', '推荐', ...songTypes]"
            :key="index"
            :class="{ 'song-type-active': songTypeIndex === index }"
            @click="setSongTypeIndex(index)"
          >
            {{ type }}
          </li>
        </ul>
      </div>
    </div>
    <div class="song-type-selector-wrapper">
      <div class="song-type-selector" @click="selectType">
        <img
          src="http://cdn.healing2020.100steps.top/static/healing/change.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<!-- <script>
import { mapState } from 'vuex'

export default {
  name: 'SongType',
  computed: {
    ...mapState({
      songTypes: 'songTypes',
      songTypeIndex: 'songTypeIndex'
    }),
    songTypeList() {
      return this.$refs.songTypeList
    },
    songTypeContainer() {
      return document.getElementsByClassName('song-type-container')[0]
    }
  },
  methods: {
    setSongTypeIndex(index) {
      this.$store.commit('setSongTypeIndex', index)
    },
    songTypeScroll(distance, duration) {
      const initLeft = this.songTypeList.scrollLeft
      const easeInOutComputed = function(time) {
        const a = (2 * distance) / (duration * duration)
        let changeDistance
        if (time < duration / 2) {
          changeDistance = a * time * time
        } else {
          changeDistance = -a * (time - duration) * (time - duration) + distance
        }
        return changeDistance
      }
      const interval = duration / 100
      const _this = this // 在定时器中用_this，防止定时器中的this不能指向当前vue实例
      let t = 0
      const scrollTransition = setInterval(function() {
        if (t < duration) {
          _this.songTypeList.scrollLeft = initLeft + easeInOutComputed(t)
          t += interval
        } else {
          _this.isTypeChanging = false
          clearInterval(scrollTransition)
        }
      }, interval)
    },
    listScrollHandler() {
      if (!this.isTypeChanging) {
        // console.log(this.songTypeList.scrollLeft)
        this.songTypeContainer.style.setProperty(
          '--hint-left',
          -this.songTypeList.scrollLeft + 'px'
        )
      }
    },
    selectType() {
      this.$router.push('/preference')
    }
  },
  watch: {
    songTypeIndex: function() {
      this.isTypeChanging = true
      // 更新index的值后，nextTick才会更新DOM元素，回调才能获取到新元素的宽度
      this.$nextTick(() => {
        const activeSongType = document.getElementsByClassName(
          'song-type-active'
        )[0]
        const startPosition =
          activeSongType.offsetLeft -
          this.songTypeList.scrollLeft +
          this.songTypeContainer.offsetLeft
        const endPosition =
          (document.body.clientWidth - activeSongType.offsetWidth) * 0.5
        // const endPosition = (this.songTypeList.offsetWidth - activeSongType.offsetWidth) * 0.6 // 不是乘0.5 使中点位于屏幕中央而不是元素中央
        const distance = startPosition - endPosition
        this.songTypeScroll(distance, 500)
      })
    }
  }
}
</script> -->

<style scoped>
.song-type {
  width: 100%;
  height: 6vh;
  background-color:#3A87BB;
  /* background-color: #0b77a5; */
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: sticky;
  top: 0;
  /* mask-10->10 sticky两行是5 弹窗是15 列表项是0 */
  z-index: 1;
}
.song-type-wrapper {
  width: 80%;
  height: 100%;
  overflow: hidden;
}
.song-type-container {
  height: 100%;
  position: relative;
}
.song-type-container > input {
  z-index: 200;
  left: 0;
  top: 0;
  position: absolute;
}
.song-type-list {
  margin: 0;
  padding: 0;
  width: auto;
  height: 100%;
  list-style: none;
  border-top: 2px solid #ffffff80;
  position: relative;
  white-space: nowrap;
  overflow: auto;
  display: flex;
  align-items: center;
  user-select: none;
}
.song-type-list > li {
  line-height: 100%;
  padding: 0 6px;
  color: #ffffff80;
  font-size: 1rem;
}
.song-type-list > li.song-type-active {
  font-weight: bold;
  font-size: 1.3rem;
  position: relative;
}
/* .song-type-list > li.song-type-active::after {
  content: '';
  width: 100%;
  height: 0.6rem;
  left: 0;
  bottom: 0;
  border-radius: 0.2rem;
  position: absolute;
  background-color: rgba(54, 74, 142, 0.4);
} */
::-webkit-scrollbar {
  display: none;
}
.song-type-selector-wrapper {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.song-type-selector {
  width: 6vw;
  height: 8vw;
  max-width: 40px;
  max-height: 40px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.song-type-selector > img {
  width: 100%;
  height: auto;
}
</style>
