<template>
  <div class="background" id="mainbox">
    <div class="title-box">
      <div class="back-button" @click="back">
        <img src="../../assets/BackBtn.png" alt="" />
      </div>
      <div class="title">个人设置</div>
    </div>
    <n-card
      :bordered="false"
      style="text-align:center;--color:var(#fff0);--padding-bottom:0;"
    >
      <n-space vertical>
        <!--头像-->
        <div style="min-height:60vw;">
          <n-card
            :bordered="false"
            style="--color:var(#fff0);--padding-bottom:0;min-height:60vw;"
            content-style="min-height:60vw;"
          >
            <n-Avatar round :src="imgURL" style="--size:15vw;" />
            <div class="box">
              <!--昵称-->
              <span class="text">昵称</span>
              <input
                v-model.lazy="nickname"
                placeholder=""
                class="input"
                maxlength="15"
              />

              <!--个性签名,样式仍然需要调整-->
              <span class="text">个性签名</span>
              <div class="signaturebox">
                <textarea
                  v-model="signature"
                  class="input"
                  maxlength="30"
                  rows="2"
                  @input="Count"
                  style="font-family: inherit;font-size: inherit;border-style:none;"
                >
                </textarea>
                <span class="count"> {{ count }}/30 </span>
              </div>

              <span class="text">电话</span>
              <input
                v-model.lazy="phone_number"
                placeholder=""
                class="input"
                maxlength="11"
              />
            </div>
          </n-card>
        </div>
        <!--个人设置-->
        <div style="padding-top:3vh;" v-show="!isInput">
          <n-card
            style="text-align:left;font-size:4vw;--color:var(#fff0);--border-color:rbga(0,0,0,0)"
          >
            <div class="setbox">
              <div>
                使用微信头像<!--is-->
                <n-switch
                  v-model:value="avatarVisible"
                  class="button"
                  style="--rail-color-active:rgb(44,241,211);--rail-width:13vw;"
                />
              </div>
              <div>
                允许他人通过姓名找到我
                <n-switch
                  v-model:value="realNameSearch"
                  class="button"
                  style="--rail-color-active:rgb(44,241,211);--rail-width:13vw;"
                />
              </div>
              <div>
                允许他人通过手机号找到我
                <n-switch
                  v-model:value="phoneSearch"
                  class="button"
                  style="--rail-color-active:rgb(44,241,211);--rail-width:13vw;"
                />
              </div>
            </div>
          </n-card>
          <!--免打扰提示字-->
          <span class="span">(23:30—次日9:00位免打扰时段）</span>

          <br />
          <div>&nbsp;</div>
          <n-button
            @click="saveUser"
            round
            style="--text-color:white;--text-color-hover:rgb(44,241,211);
            --border-focus: 1px solid rgb(44,241,211);--text-color-pressed:rgb(44,241,211);--text-color-focus:
            rgb(44,241,211);--border-hover: 1px solid rgb(44,241,211)"
          >
            保存修改
          </n-button>
        </div>
      </n-space>
    </n-card>
    <!-- <n-modal v-model:show="isShow">
      <div class="msgBox">{{ msg }}</div>
    </n-modal> -->
  </div>
</template>
<script>
import { defineComponent, toRef, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from '../../axios'
import BackBtn from '../../components/BackBtn.vue'

export default defineComponent({
  components: { BackBtn },
  setup() {
    const docHeight = ref(
      document.documentElement.clientHeight || document.body.clientHeight
    )
    let showHeight = ref(
      document.documentElement.clientHeight || document.body.clientHeight
    )
    let isInput = ref(false)

    onMounted(() => {
      window.onresize = () => {
        showHeight.value =
          document.documentElement.clientHeight || document.body.clientHeight
      }
    })
    watch(showHeight.value, () => {
      if (docHeight.value > showHeight.value) {
        isInput.value = true
      } else {
        isInput.value = false
      }
    })

    const router = useRouter()
    const store = useStore()

    let imgURL = store.state.user.avatar
    let nickname = toRef(store.state.user, 'nickname')
    let phone_number = toRef(store.state.user, 'phone_number')
    let signature = toRef(store.state.user, 'signature')

    // showMsg
    const isShow = ref(false)
    const msg = ref(null)

    const showMsg = (m) => {
      isShow.value = true
      msg.value = m
    }

    // 开关选择
    // let isCheck = reactive([true, true, true])
    console.log(store.state.user)
    const avatarVisible = ref(store.state.user.avatar_visible === 0)
    const phoneSearch = ref(store.state.user.phone_search === 0)
    const realNameSearch = ref(store.state.user.real_name_search === 0)

    // 保存修改
    const saveUser = () => {
      if (nickname.value === '') {
        store.commit('setToast', '记得填上你的昵称呀')
      } else if (nickname.value === '梯仔') {
        store.commit('setToast', '🤣不许你叫梯仔哼～')
      } else {
        if (phone_number.value !== '') {
          let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/
          if (!myreg.test(phone_number.value)) {
            // showPopover.value= false
            store.commit('setToast', '请填写正确的手机号')
          }
        }
        let user = {
          avatar: imgURL,
          nickname: nickname.value,
          signature: signature.value,
          phone_number: phone_number.value,
          avatar_visible: avatarVisible.value ? 0 : 1, // 1：隐藏头像，0：不隐藏
          phone_search: phoneSearch.value ? 0 : 1, // 0：允许通过手机号查找，1：不允许
          real_name_search: realNameSearch.value ? 0 : 1 // 0：允许通过姓名查找，1：不允许
        }
        // 保存更改信息
        axios
          .put('/user', user)
          .then((res) => {
            console.log(res)
            user.avatar = res.data.avatar
            store.commit('setUser', user)
            router.back()
            // router.replace({
            //   path: '/personal',
            //   query: {
            //     id: -1
            //   }
            // })
          })
          .catch((err) => {
            console.log(err)
            // router.push(
            //   {
            //     name:'Personal',
            //     params:{
            //       id:-1,
            //       nickname:nickname.value,
            //       signature:signature.value
            //     }
            //   }
            // )
            // errTimes++
            // if (errTimes < 3) {
            //   showMsg(err)
            // } else {
            //   showMsg(err)
            //   router.back()
            // }
          })
      }
    }
    let count = ref(signature.value.length)
    const Count = () => {
      count.value = signature.value.length
    }
    const back = () => {
      // router.replace({
      //   name: "Personal",
      //   params: { id: -1 }
      // });
      router.back()
    }
    return {
      imgURL,
      nickname,
      signature,
      saveUser,
      phone_number,
      avatarVisible,
      phoneSearch,
      realNameSearch,
      Count,
      count,
      isInput,
      back
    }
  }
})
</script>
<style scoped>
.background {
  background-image: url('../../assets/background-dark.png');
  background-size: cover;
  height: 100vh;
}
.msgBox {
  width: 50vw;
  background-color: white;
  color: black;
  height: 6vh;
  border-radius: 9vw;
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}
.box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 30vh;
  justify-content: space-between;
  min-height: 75vw;
}
.text {
  float: left;
  color: white;
}
.setbox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 18vh;
  color: white;
}
.button {
  float: right;

  width: 13vw;
}
.span {
  text-align: center;
  color: white;
}
.title-box {
  margin: 0 auto 5px;
  width: 100vw;
  height: 16vw;
  text-align: center;
  display: flex;
}
/* .title-box span {
  padding: 0 7px;
  font-size: 6vw;
  border-bottom: 2px solid #fff;
} */
.title-box .title {
  width: 80vw;
  /*border-bottom: 2px solid #fff;*/
  display: flex;
  font-family: '雅黑';
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 5vw;
}
.input {
  outline: none;
  background-color: transparent;
  width: 95%;
  padding: 2vw;
  color: white;
  border-color: white;
  border-width: thin;
  border-radius: 1vw;
  border-style: solid;
}
.input:focus {
  border-color: rgb(44, 241, 211);
}
.input:active {
  border-color: rgb(44, 241, 211);
}
.count {
  color: white;
  opacity: 0.5;
  float: right;
  padding-right: 3vw;
}
.signaturebox {
  border-color: white;
  border-width: thin;
  border-radius: 1vw;
  border-style: solid;
  width: 100%;
}
.signaturebox:focus {
  border-color: rgb(44, 241, 211);
}
.signaturebox:active {
  border-color: rgb(44, 241, 211);
}
.back-button {
  width: 10vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-button img {
  width: 4vw;
}
</style>
