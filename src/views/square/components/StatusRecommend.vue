<template>
  <div class="status-recommend">
    <div class="status-title">大家都在</div>
    <div class="status-list">
      <div
        v-for="(state, index) in status"
        :key="index"
        class="state"
        :class="{chosen: chosen_index.includes(index)}"
        v-show="index<count*9+9 & index>=count*9"
        @click="choose(index, state)"
      >
        <div>{{state}}</div>
        <img
          v-show="chosen_index.includes(index)"
          src="../../../assets/star.png"
        >
      </div>
    </div>
    <div class="change" @click="change">换一批</div>
    <div class="bottom">
      <div class="add" @click="add">添加</div>
      <div class="hide" @click="hide">取消</div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRef, onActivated } from 'vue'
import { useStore } from 'vuex'
import axios from '../../../axios.js'

export default {
  name: 'StatusRecommend',
  props: ['statusCount'],
  emits: ['addStatusRecommend', 'hideStatusRecommend'],
  setup(props, context) {
    const store = useStore()
    const status = reactive([
      /*'上早课',
      '奔赴饭堂',
      '乐跑',
      '游泳',
      '等待外卖',
      '取快递',
      '学习中',
      '运动中',
      '工作中',
      '充能中',
      '奋斗中',
      '求锦鲤',
      '芜湖起飞',
      '喝奶茶',
      '自拍',
      '美滋滋',
      '滋润',
      '期待满满'*/
    ])
    let count = ref(0) // 显示第几批
    let total = ref(0) // 表示总批数
    let chosen_index = reactive([]) // 被选中状态的index
    let chosen_status = reactive([]) // 被选中的状态
    // 改成一次只能选一个
    // let statusCount = ref(toRef(props, 'statusCount').value)
    /*const choose = (index, status) => {
      console.log('hhh',props.statusCount)
      console.log('test', statusCount.value)
      if (chosen_index.includes(index)) {
        const index_list = chosen_index.filter((p) => {
          return p != index
        })
        chosen_index.length = 0
        index_list.forEach((el) => {
          chosen_index.push(el)
        })
        statusCount.value -= 1
        const status_list = chosen_status.filter((p) => {
          return p != status
        })
        chosen_status.length = 0
        status_list.forEach((el) => {
          chosen_status.push(el)
        }) 
      } else {
        statusCount.value += 1
        console.log(statusCount.value)
        if (statusCount.value >= 4) {
          store.commit('setToast', '最多只能有三个状态哦~')
          statusCount.value -= 1
        } else {
          chosen_index.push(index)
          chosen_status.push(status)
        }
      }
      console.log('statusRecommend', statusCount)
    }*/
    const choose = (index, state) => {
      if (chosen_index.includes(index)) {
        chosen_index.length = 0
        chosen_status.length = 0
      } else {
        chosen_index.length = 0
        chosen_status.length = 0
        chosen_index.push(index)
        chosen_status.push(state)
      }
    }
    const change = () => {
      if (count.value === total.value) {
        count.value = 0
      } else {
        count.value += 1
      }
    }
    const add = () => {
      context.emit('addStatusRecommend', chosen_status)
      chosen_index.length = 0
      chosen_status.length = 0
    }
    const hide = () => {
      context.emit('hideStatusRecommend')
      chosen_index.length = 0
      chosen_status.length = 0
    }
    onActivated(() => {
      axios
        .get(`/dynamics/ourstates`)
        .then(res => {
          status.length = 0
          res.data.forEach((el) => {
            status.push(el)
          })
          if (status.length % 9 === 0) {
            total.value = parseInt(status.length / 9) - 1
          } else {
            total.value = parseInt(status.length / 9)
          }
        })
        .catch(err => {
          console.log(err)
        })
    })

    return {
      status,
      count,
      total,
      // statusCount,
      chosen_index,
      chosen_status,
      choose,
      change,
      add,
      hide
    }
  },
}
</script>

<style scoped>
  .status-recommend {
    z-index: 300;
    width: 70vw;
    height: 80vw;
    background-color: white;
    border: 1px solid white;
    border-radius: 5vw;
    position: absolute;
    top: 30vw;
    left: 15vw;
    font-family: MicrosoftYaHei;
  }
  .status-title {
    width: 55vw;
    text-align: center;
    margin-top: 6vw;
    margin-left: 7.5vw;
    font-size: 5vw;
    color: rgb(20, 56, 83);
    font-weight: 600;
  }
  .status-list {
    display: grid;
    grid-template-columns: 3fr 3fr 3fr;
    grid-column-gap: 2vw;
    font-size: 4.2vw;
    color:rgb(20, 56, 83);
    margin-left: 3vw;
    margin-top: 1vw;
    width: 55vw;
  }
  .state {
    width: 19vw;
    height: 6.5vw;
    border: 1.6px solid rgb(20, 56, 83);
    border-radius: 1.5vw;
    text-align: center;
    margin-top: 6vw;
    padding-top: 0.5vw;
  }
  .chosen {
    background-color: rgb(47, 110, 157);
    color: white;
  }
  .state > img {
    z-index: 300;
    width: 5vw;
    height: 5vw;
    position: relative;
    left: 9.2vw;
    top: -3.6vw;
  }
  .change {
    float: right;
    color: rgb(23, 56, 82);
    width: 3.22em;
    text-align: center;
    font-size: 3.5vw;
    margin-top: 2vw;
    margin-right: 3vw;
    border-bottom: 1.6px solid rgb(23, 56, 82);
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    width: 55vw;
    margin-top: 9vw;
    margin-left: 8vw;
  }
  .add,
  .hide {
    width: 18vw;
    font-size: 4.2vw;
    color:rgb(20, 56, 83);
    border: 1.6px solid rgb(23, 56, 82);
    border-radius: 1vw;
    text-align: center;
    padding-top: 0.1vw;
    padding-bottom: 0.1vw;
  }
</style>
