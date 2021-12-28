<template>
  <div class="add-status">
    <input
      placeholder="单击输入状态词"
      v-model="statusInput"
      maxlength="4"
    >
    <div class="middle">
      <div class="alert">请输入四个字以内的状态词</div>
      <div class="status-recommend" @click="goToStatusRecommend">看推荐</div>
    </div>
    <div class="bottom">
      <div class="add-input" @click="addInput">添加</div>
      <div class="hide-input" @click="hideInput">取消</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
  name: 'AddStatus',
  emits: ['addStatusInput', 'hideStatusInput', 'showStatusRecommend'],
  setup(props, context) {
    const store = useStore()
    const statusInput = ref ('')

    const addInput = () => {
      if (statusInput.value.length != 0) {
        context.emit('addStatusInput', statusInput.value)
        statusInput.value = ''
      } else {
        store.commit('setToast', '输入的内容不能为空哦~')
      }
    }
    const hideInput = () => {
      context.emit('hideStatusInput')
      statusInput.value = ''
    }
    const goToStatusRecommend = () => {
      context.emit('showStatusRecommend')
    }

    return {
      statusInput,
      addInput,
      hideInput,
      goToStatusRecommend
    }
  },
}
</script>

<style scoped>
  .add-status {
    z-index: 300;
    width: 70vw;
    height: 44vw;
    background-color: white;
    border: 1px solid white;
    border-radius: 5vw;
    position: absolute;
    top: 50vw;
    left: 15vw;
    font-family: MicrosoftYaHei;
  }
  input {
    outline: none;
    border: 1.6px solid rgb(23, 56, 82);
    border-radius: 2vw;
    color: rgb(122, 176, 213);
    font-size: 5vw;
    background-color: transparent;
    width: 55vw;
    margin-top: 7vw;
    margin-left: 7vw;
    text-align: center;
  }
  input::-webkit-input-placeholder {
    color: rgb(171, 191, 207);
    font-size: 4.2vw;
    text-align: center;
  }
  .middle {
    display: grid;
    grid-template-columns: 6fr 2fr;
    grid-column-gap: 4vw;
    width: 55vw;
    margin-top: 2vw;
    margin-left: 7vw;
  }
  .alert {
    color: rgb(171, 191, 207);
    font-size: 2.8vw;
  }
  .status-recommend {
    text-align: center;
    color: rgb(23, 56, 82);
    font-size: 3.5vw;
    border-bottom: 1.6px solid rgb(23, 56, 82);
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    width: 55vw;
    margin-top: 7vw;
    margin-left: 8vw;
  }
  .add-input,
  .hide-input {
    color: rgb(23, 56, 82);
    width: 18vw;
    font-size: 4.2vw;
    border: 1.6px solid rgb(23, 56, 82);
    border-radius: 1vw;
    text-align: center;
    padding-bottom: 0.3vw;
  }
</style>
