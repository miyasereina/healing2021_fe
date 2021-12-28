import axios from '@/axios.js'

export default {
  //获取歌曲列表
  getHealingDevotion(){
    return axios.get('/healing/devotion/')
    .then(res=>{
      return res.data
    })
  }
}