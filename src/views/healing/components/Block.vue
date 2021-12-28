<template>
  <div class="block" @click="Jumpto()">
    <img class="blockimg" :src="User?.avatar" />
    <p class="blockp">{{ User?.nickname }}</p>
  </div>
</template>

<script>
export default {
  name: 'Block',
  methods: {
    Jumpto () {
      // console.log(this.User);
      // console.log('click')
      this.$router.push({
        path: '/personal',
        query: {
          id: this.User.userid
        }
      })
    }
  },
  props: ['User']
}
</script>

<style scoped>
.block {
  height: 66px;
  width: 66px;
}
.blockimg {
  height: 55px;
  width: 55px;
  border-radius: 50%;
}
.blockp {
  height: auto;
  width: 60px;
  font-size: 11px;
}
</style>>

