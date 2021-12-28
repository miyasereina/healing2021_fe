<template>
  <div class="wrapper-like">
    <div
      :class="[likethis ? 'likeon' : 'likeoff']"
      @click.stop="like()"
    ></div>
    <span class="like-num">{{ likes }}</span>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import axios from '../axios.js'

export default {
  name: 'Likes',
  props: ['praise', 'isPraise', 'type', 'id'],
  emits: ['likeChange'],
  setup (props, context) {
    let likethis = ref(props.isPraise)
    let likes = ref(props.praise)

    const store = useStore()

    watch(props.praise, (newValue, oldValue) => {
      likes.value = newValue
    })
    watch(props.isPraise, (newValue, oldValue) => {
      likethis.value = newValue
    })

    const like = () => {
      if (likethis.value === true) {
        axios
          .put('/like', {
            todo: -1,
            type: props.type,
            id: props.id
          })
          .then(res => {
            likes.value -= 1
            likethis.value = false
            context.emit('likeChange', likethis.value)
          })
          .catch(err => {
            console.log(err)
            store.commit('setToast', '嘤嘤嘤！点赞失败')
          })
      } else {
        axios
          .put('/like', {
            todo: 1,
            type: props.type,
            id: props.id
          })
          .then(res => {
            likes.value += 1
            likethis.value = true
            context.emit('likeChange', likethis.value)
          })
          .catch(err => {
            console.log(err)
            store.commit('setToast', '嘤嘤嘤！点赞失败')
          })
      }
    }

    return {
      likethis,
      likes,
      like
    }
  }
}
</script>

<style scoped>
  .wrapper-like {
    text-align: center;
    display: flex;
    position: relative;
    left: 2vw;
  }
  .likeoff {
    width: 5vw;
    height: 5vw;
    background-image: url('../assets/shixin.png');
    background-size: 100% 100%;
  }
  .likeon {
    width: 5vw;
    height: 5vw;
    background-image: url('../assets/shixin1.png');
    background-size: 100% 100%;
  }
  .likenum {
    font-size: 4vw;
  }
</style>
