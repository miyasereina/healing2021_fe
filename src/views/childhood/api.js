import axios from '@/axios.js'

export default {
  //获取歌曲列表
  getChildHoodRank(){
    return axios.get('/childhood/rank/')
    .then(res=>{
      return res.data
    })
  },
  getChildhoodList(){
    return axios.get('/childhood/list/')
    .then(res=>{
      return res.data
    })
  },
  getChildhoodOriginalInfo(params){
    return axios.get(`/childhood/original/info/`,{params})
    .then( res=>{
      return res.data
    })
  },
  getChildhoodOriginalCovers(params){
    return axios.get(`/childhood/original/covers/`,{params})
    .then(res=>{
      return res.data
    })
  },
  //当前歌曲信息获取
  getHealingCoversPlayer(params){
    return axios.get('/healing/covers/player',{params})
    .then(res=>{
      return res.data
    })
  }
}