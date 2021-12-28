<template>
  <div class="entry" @click="routerTo">
    <div
      class="entry-btn"
      :style="backgroundImage"
    >
      <div class="entry-badge" v-show="isBadge"></div>
    </div>
    <span class="entry-text">{{ title }}</span>
  </div>
</template>

<script>
export default {
  name: 'Entry',
  props: {
    entryProps: {
      type: Object,
      required: true
    }
  },
  computed: {
    title () {
      return this.entryProps.title
    },
    backgroundImage () {
      return {
        'background-image': `url(${this.entryProps.backgroundImage})`
      }
    },
    to () {
      return this.entryProps.to
    },
    isBadge () {
      return this.entryProps.isBadge
    }
  },
  methods: {
    routerTo () {
      const nowTime = new Date()
      const month = nowTime.getMonth() + 1
      const date = nowTime.getDate()
      const nowDate = month + '-' + date
      console.log(nowDate)
      if (localStorage.getItem(this.title) !== nowDate) {
        console.log('add localStorage')
        if (this.isBadge) {
          localStorage.setItem(this.title, nowDate)
          this.$emit('enter')
        }
      }
      this.$router.push(this.to)
    }
  }
}
</script>

<style scoped>
.entry {
  width: auto;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
}
.entry-btn {
  width: 6.5vh;
  height: 6.5vh;
  position: relative;
  border-radius: 50%;
  background-size: cover;
}
.entry-badge {
  width: 1.6vh;
  height: 1.6vh;
  position: absolute;
  left: 5vh;
  background-color: #ff0000;
  border-radius: 50%;
}
.entry-text {
  height: 3vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 14px;
}
</style>
