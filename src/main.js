import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  create,
  NAvatar,
  NButton,
  NTabs,
  NInput,
  NCard,
  NSwitch,
  NImage,
  NSpace,
  NRadio,
  NRadioGroup,
  NPopover,
  NTag,
  NScrollbar,
  NEllipsis,
  useNotification,
  NNotificationProvider,
  NMessageProvider,
  useMessage,
  NSlider,
  NSpin,
  NDrawer,
  NDrawerContent,
  NModal,
  NCheckboxGroup,
  NCheckbox,
  NGrid,
  NGi,
  NTabPane,
  NCarousel,
  NDivider,
  NProgress,
  NBadge,
  NPopconfirm
} from 'naive-ui'
// import VueLazyload from 'vue-lazyload'

const naive = create({
  components: [
    NButton,
    NAvatar,
    NTabs,
    NTabPane,
    NInput,
    NCard,
    NSwitch,
    NImage,
    NSpace,
    NRadio,
    NRadioGroup,
    NSlider,
    NSpace,
    NPopover,
    NTag,
    NScrollbar,
    NEllipsis,
    NNotificationProvider,
    NMessageProvider,
    useNotification,
    useMessage,
    NSpin,
    NDrawer,
    NDrawerContent,
    NModal,
    NCheckboxGroup,
    NCheckbox,
    NGrid,
    NGi,
    NCarousel,
    NDivider,
    NProgress,
    NBadge,
    NPopconfirm
  ]
})

createApp(App)
  .use(store)
  .use(router)
  .use(naive)
  .mount('#app')
