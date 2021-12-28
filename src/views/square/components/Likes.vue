<template>
  <div class="wrapper-like">
    <div :class="[likethis ? 'likeon' : 'likeoff']" @click.stop="like"></div>
    <span class="like-num">{{ likes }}</span>
  </div>
</template>

<script>
import { toRef } from 'vue'
import { useStore } from 'vuex'
import axios from '../../../axios.js'

export default {
  name: 'Likes',
  props: ['praise', 'isPraise', 'type', 'id'],
  emits: ['likeChange'],
  setup(props, context) {
    let likethis = toRef(props, 'isPraise')
    let likes = toRef(props, 'praise')

    const store = useStore()

    const like = () => {
      if (likethis.value === 1) {
        axios
          .put(
            '/like',
            {
              todo: -1,
              type: props.type,
              id: props.id
            },
            {
              setToast: false
            }
          )
          .then((res) => {
            context.emit('likeChange', likethis.value)
          })
          .catch((err) => {
            console.log(err)
            store.commit('setToast', '嘤嘤嘤！取消点赞失败')
          })
      } else {
        axios
          .put(
            '/like',
            {
              todo: 1,
              type: props.type,
              id: props.id
            },
            {
              setToast: false
            }
          )
          .then((res) => {
            context.emit('likeChange', likethis.value)
          })
          .catch((err) => {
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
  background-image: url('../img/likeoff.png');
  background-size: 100% 100%;
}
.likeon {
  width: 5vw;
  height: 5vw;
  background-image: url('../img/likeon.png');
  background-size: 100% 100%;
}
.like-num {
  font-size: 4vw;
  margin-left: 5px;
}
</style>
