<template>
  <div class="user-item" @click="toProfile">
    <div class="avatar">
      <div class="avatar-image">
        <img :src="userData.avatar" alt="">
      </div>
    </div>
    <div class="username">{{ userData.userName }}</div>
    <div class="bio">{{ userData.more }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  props: {
    userData: {
      type: Object,
      required: true
    }
  },
  computed: {
    // background () {
    //   return `http://cdn.healing2020.100steps.top/static/search/search-bg-${this.userData.background}.png`
    // }
  },
  methods: {
    toProfile () {
      this.$router.push({
        path: '/profile',
        query: {
          id: this.userData.userid
        }
      })
    }
  }
}
</script>

<style scoped>
.user-item {
  width: 88vw;
  height: 68px;
  border: 1px solid #545454;
  border-radius: 12px;
  display: grid;
  grid-template: 0.5fr 1fr 1fr 0.5fr / 2vw 18vw 1fr 95px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-blend-mode: screen;
  overflow: hidden;
}
.avatar {
  grid-row: 1 / 5;
  grid-column: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-image {
  width: 10vw;
  height: 10vw;
  background-color: #BFBFBF;
  border-radius: 5vw;
  overflow: hidden;
}
.avatar-image img {
  width: 100%;
  height: auto;
}
.username {
  grid-row: 2;
  grid-column: 3;
  font-size: 0.9em;
}
.bio {
  grid-row: 3;
  grid-column: 3;
  font-size: 0.8em;
}
.username,
.bio {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: #ffffff;
}
</style>
