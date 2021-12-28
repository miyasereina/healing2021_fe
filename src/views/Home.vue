<template>
  <div class="home"></div>
</template>

<script>
import axios from '../axios.js'

export default {
  name: 'Home',
  // 测试请求用的 后面记得去掉或者改掉
  mounted () {
    // 默认拼接上'/api'
    axios
      .get('/healingPage?selectionId=1')
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })

    // 不带'/api'两种写法
    // 第一种，axios.post函数的三个参数分别是url，data，config（配置信息）
    // axios
    //   .post('/userEasy', {}, { baseURL: '' })
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })

    // 或者直接把配置信息传到axios里面去
    // axios({
    //   baseURL: '',
    //   url: '/wechatUser',
    //   data: {}
    // })
  }
}
</script>
