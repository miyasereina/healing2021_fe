<template>
  <n-card
    style="text-align:center;--color:var(#fff0);"
    content-style="text-align:left;"
    :bordered="false"
  >
  <div style="min-height: 93vw;"> 
    <n-space vertical>
      <div class="title-box"><span>注</span><span>册</span></div>
      <p style="color:white;">昵称（必填）</p>
      <input class="input"
        v-model="nickname"
        maxlength="15"
      />
      <!-- <n-popover trigger="manual" :show="showmsg" placement="bottom-end">
        <template #trigger>
          <n-input
            placeholder="必填"
            v-model.lazy="postMsg.nickname"
            style="letter-spacing: 0.4vw;--text-color:white;text-align:left;width:90vw;--caret-color:rgb(44,241,211);--border-hover: 1px solid rgb(44,241,211);
        --border-focus: 1px solid rgb(44,241,211);--color:none;--color-focus:none;"
          />
        </template>
        <span>昵称不能为空</span>
      </n-popover> -->
      <p style="color: white">真实姓名（选填）</p>
      <input
        v-model="realName"
        class="input"
        maxlength="15"
      />
      <p style="color:white;">手机号（选填）</p>
      <input class="input"
        v-model="phoneNumber"
        maxlength="15"
      />
    </n-space>
  </div>
    <p style="color:white;">性别</p>
    <!-- <n-radio
      style="--text-color:white;"
      value="1"
      :checked="gendervalue === 1"
      @change="genderChange"
    >
      男
    </n-radio> -->
    <n-radio-group v-model:value="sexValue" name="genders">
      <n-radio
        style="--text-color:white;"
        v-for="gender in genders"
        :key="gender.value"
        :value="gender.value"
      >
        {{ gender.label }}
      </n-radio>
    </n-radio-group>
    <p style="color:white;">学校</p>
    <!-- <n-radio
      style="--text-color:white;"
      value="华工"
      :checked="schoolvalue === '华工'"
      @change="schoolChange"
      >华工</n-radio
    > -->
    <n-radio-group v-model:value="schoolValue" name="schoolgroup">
      <n-radio
        style="--text-color:white;"
        v-for="school in schools"
        :key="school.value"
        :value="school.value"
      >
        {{ school.label }}
      </n-radio>
    </n-radio-group>
    <p>&nbsp;</p>
    <p></p>
    <div style="text-align: center">
      <n-button
        @click="register"
        round
        size="large"
        style="--text-color:white;--text-color-hover:rgb(44,241,211);
            --border-focus: 1px solid rgb(44,241,211);--text-color-pressed:rgb(44,241,211);--text-color-focus:
            rgb(44,241,211);--border-hover: 1px solid rgb(44,241,211)"
        >确认</n-button
      >
    </div>
  </n-card>
  <!-- <n-modal v-model:show="showModal">
    <n-card title="提示" :bordered="false" size="small">
      {{ msg }}
    </n-card>
  </n-modal> -->
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from '@/axios'

export default {
  setup() {
    const height = document.documentElement.clientHeight;
      // 在页面整体加载完毕时
      window.onload = function () {
        // 把获取到的高度赋值给根div
        document.getElementById('mainbox').style.height = `${height}px`
      }

    const router = useRouter()
    const store = useStore()

    const nickname = ref(store.state.user.nickname)
    const realName = ref('')
    const phoneNumber = ref('')
    const sexValue = ref(1)
    const schoolValue = ref('华工')

    const genders = ['男', '女', '不告诉你'].map((el, i) => ({
      value: i + 1,
      label: el
    }))
    const schools = ['华工', '广财','其他'].map((el) => ({
      value: el,
      label: el
    }))

    const register = () => {
      const data = {
        nickname: nickname.value,
        realName: realName.value, //选填
        phoneNumber: phoneNumber.value, //选填
        sex: sexValue.value, // 1:男 2:女 3:其他
        school: schoolValue.value //可以传缩写过来 scut
      }
      console.log(data)
      if (nickname.value === '') {
        store.commit('setToast', '请填写你的昵称')
      } else if (nickname.value === '梯仔') {
        store.commit('setToast', '🤣不许你叫梯仔哼～')
      } else {
        axios
          .post('/user', {
            nickname: nickname.value,
            real_name: realName.value, //选填
            phone_number: phoneNumber.value, //选填
            sex: sexValue.value, // 1:男 2:女 3:其他
            school: schoolValue.value //可以传缩写过来 scut
          })
          .then((res) => {
            // this.$router.replace('/preference')
            console.log(res)
            router.replace({
              path: '/preference',
              query: {
                flag: 1 // 1 代表从注册页过来
              }
            })
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }

    return {
      nickname,
      realName,
      phoneNumber,
      sexValue,
      schoolValue,
      genders,
      schools,
      register
    }
  }
}
</script>

<style scoped>
.title-box {
  margin: 0 auto 5px;
  width: 80vw;
  /* height: 16vw; */
  text-align: center;
  border-bottom: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}
.title-box span {
  padding: 0 7px;
  font-size: 6vw;
}
.input{
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
.input:focus{
  border-color: rgb(44,241,211);
}
.input:active{
  border-color: rgb(44,241,211);
}
</style>
