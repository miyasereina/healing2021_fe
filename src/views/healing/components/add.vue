<template>
  <div class="request-songs" @click="routerTo">
    <div
      class="add"
      :style="backgroundImage"
    >
      <div class="add-badge" v-show="isBadge"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Add',
  data () {
    return {
      
    }
  },
  computed:{
     backgroundImage () {
      return {
        'background-image': `url(${this.entryProps.backgroundImage})`
      }
    },
  }
}
</script>
