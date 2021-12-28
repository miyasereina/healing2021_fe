import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/twoSinger',
    name: 'twoSinger',
    component: () => import('../views/twoSinger/TwoSinger.vue')
  },
  {
    path: '/cover',
    name: 'Cover',
    component: () => import('../views/childhood/Cover.vue')
  },
  {
    path: '/',
    name: 'Healing',
    component: () => import('../views/healing/Healing.vue')
  },
  {
    path: '/healingsearch',
    name: 'HealingSearch',
    component: () => import('../views/healing/search/Search.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/square/Search.vue')
  },
  {
    path: '/lotterybox',
    name: 'Lottertbox',
    component: () => import('../views/lotterybox/Lotterybox.vue')
  },
  {
    path: '/healingRank',
    name: 'Rank',
    component: () => import('../views/healing/rank/Rank.vue')
  },
  {
    path: '/healingDailyRank',
    name: 'DailyRank',
    component: () => import('../views/healing/dailyRank/DailyRank.vue')
  },
  {
    path: '/playsong',
    name: 'PlaySong',
    component: () => import('../views/childhood/PlaySong.vue')
  },
  {
    path: '/recallchildhood',
    name: 'RecallChildhood',
    component: () => import('../views/childhood/RecallChildhood.vue')
  },
  {
    path: '/record',
    name: 'Record',
    component: () => import('../views/record/Record.vue')
  },
  {
    path: '/healingdetail/:id',
    name: 'HealingDetail',
    component: () => import('../views/healingDetail/HealingDetail.vue')
  },
  {
    path: '/square',
    name: 'Square',
    component: () => import('../views/square/Square.vue')
  },
  {
    path: '/dynamicdetail',
    name: 'DynamicDetail',
    component: () => import('../views/square/DynamicDetail.vue')
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('../views/messages/Message.vue')
  },
  {
    path: '/chatroom/:target',
    name: 'Chatroom',
    component: () => import('../views/chatroom/Chatroom.vue')
  },
  {
    path: '/searchdialog',
    name: 'SearchDialog',
    component: () => import('../views/square/SearchDialog.vue')
  },
  {
    path: '/publishdynamic',
    name: 'PublishDynamic',
    component: () => import('../views/square/PublishDynamic.vue')
  },
  {
    path: '/songrecommend',
    name: 'SongRecommend',
    component: () => import('../views/square/SongRecommend.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/register/Register')
  },
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('../views/personal/Personal.vue')
  },
  {
    path: '/requestsong',
    name: 'RequestSong',
    component: () => import('../views/healing/requestSong/RequestSong.vue')
  },
  {path: '/setting',
    name: 'Setting',
    component: () => import('../views/personal/Setting.vue')
  },
  {
    path: '/intro',
    name: 'Intro',
    component: () => import('../views/intro/Intro.vue')
  },
  {
    path: '/preference',
    name: 'Preference',
    component: () => import('../views/register/Preference.vue')
  },
  {
    path: '/qrcode',
    name:'QRcode',
    component: () => import('../views/personal/QRcode.vue')
  },
  {
    path: '/end',
    name:'End',
    component: () => import('../views/end/End.vue')
  }
]



const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const endTime = 1640059200 // 2021/12/21 12:00
  const nowTime = Date.now()
  if (nowTime >= endTime && !to.path.match(/\/end/)) {
    next('/end')
  } else {
    next()
  }
})

export default router
