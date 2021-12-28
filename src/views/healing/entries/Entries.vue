<template>
  <div class="entries-wrapper">
    <entry
      v-for="(entry, index) in entries"
      :key="index"
      :entryProps="entry"
      @enter="enter(index)"
    ></entry>
  </div>
</template>

<script>
import Entry from '@/views/healing/entries/Entry'

export default {
  name: 'Entries',
  data() {
    return {
      entries: [
        {
          title: '点歌',
          backgroundImage: require('../../../assets/requestSong.png'),
          to: '/requestsong'
        },
        {
          title: '抽奖',
          backgroundImage: require('../../../assets/抽奖.png'),
          to: '/lotterybox'
        },
        {
          title: '排行榜',
          backgroundImage: require('../../../assets/排行榜.png'),
          to: '/healingRank'
        },
        {
          title: '每日热榜',
          backgroundImage: require('../../../assets/热榜.png'),
          to: '/healingDailyRank'
          // isBadge: true
        }
      ]
    }
  },
  created() {
    this.entries.forEach((el) => {
      if (el.isBadge) {
        const nowTime = new Date()
        const month = nowTime.getMonth() + 1
        const date = nowTime.getDate()
        const nowDate = month + '-' + date
        if (localStorage.getItem(el.title) === nowDate) {
          el.isBadge = false
          console.log(el.isBadge)
        }
      }
    })
  },
  methods: {
    enter(index) {
      console.log(this.entries[index])
      if (this.entries[index].isBadge) {
        this.entries[index].isBadge = false
      }
    }
  },
  components: {
    Entry
  }
}
</script>

<style scoped>
.entries-wrapper {
  width: 100vw;
  height: 12vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
