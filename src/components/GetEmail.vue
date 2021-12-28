<template>
  <div
    class="mask"
    v-show="dialogShow"
    @touchmove.prevent
    ref="mask"
  >
    <div ref="dialogWindow" class="dialog-window">
      <div class="title-text">
        <div class="title">在治愈系过得开心吗</div>
        <div class="title">留下你的邮箱说不定有神秘礼物哦(*^▽^*)</div>
      </div>
      <div class="input">
        <el-input size="mini" type="email" v-model="email" placeholder="请输入邮箱"/>
        <div v-show="isError" class="error">{{ errMessage }}</div>
      </div>
      <div class="btns">
        <div class="btn refuse" @click="close">放弃</div>
        <div class="btn comfirm" @click="confirm">确定</div>
      </div>
    </div>
  </div>
<!--  <el-dialog-->
<!--    class="eldialog"-->
<!--    :visible.sync="dialogVisible"-->
<!--    width="80%"-->
<!--    :showClose="false"-->
<!--  >-->
<!--    <div class="title">-->
<!--      在治愈系过得还开心吗？给我们留下你的邮箱吧，说不定会有神秘的礼品哦~-->
<!--    </div>-->
<!--    <el-input-->
<!--      style="width: 80%;"-->
<!--      size="mini"-->
<!--      type="email"-->
<!--      v-model="UserInput"-->
<!--      placeholder="请输入邮箱"-->
<!--    >-->
<!--    </el-input>-->
<!--    <p v-show="CheckFail" class="Error">{{ ErrorText[CheckFail - 1] }}</p>-->
<!--    <div class="ButtonGroup">-->
<!--      <el-button class="sure" @click="confirm()">确认</el-button>-->
<!--      <el-button class="sure" @click="dialogVisible = false">拒绝</el-button>-->
<!--    </div>-->
<!--  </el-dialog>-->
</template>

<script>
// <get-email v-if="dialogVisible"></get-email>使用此方法引入
export default {
  name: 'GetEmail',
  data () {
    return {
      email: '',
      CheckFail: 0,
      errMessage: '',
      isError: false
    }
  },
  props: {
    dialogShow: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    confirm () {
      const mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!this.email) {
        this.isError = true
        this.errMessage = '邮箱不能为空哦'
        setTimeout(() => {
          this.isError = false
          this.errMessage = ''
        }, 3000)
      } else {
        if (mailReg.test(this.email)) {
          this.CheckFail = 0
          var that = this
          this.$axios
            .post('/user/postbox', {
              id: that.$store.state.userData.ID,
              postbox: that.email
            })
            .then((res) => {
              console.log(res.data)
              that.$store.commit('setToast', '填写邮箱成功')
              this.$emit('close')
            })
            .catch((err) => {
              console.log(err)
              this.$emit('close')
            })
        } else {
          this.isError = true
          this.errMessage = '邮箱格式不正确哦'
          setTimeout(() => {
            this.isError = false
            this.errMessage = ''
          }, 3000)
        }
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
* {
  transition: all 0.2s ease-in-out;
}
.mask {
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 20;
  color: #000000
}
.dialog-window {
  width: 320px;
  max-width: 90vw;
  height: 210px;
  margin: 0 auto;
  background-color: #ffffff;
  background-image: url("http://cdn.healing2020.100steps.top/static/healing/bg2.png");
  background-repeat: no-repeat;
  background-size: 100% 105%;
  background-position: center center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: calc(50vh - 100px);
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 0 8px 5px rgba(82, 78, 78, 0.3);
}
.title-text {
  margin: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.title-text .title {
  padding: 5px 0;
  width: 100%;
  text-align: center;
  font-size: 0.76em;
}
.input {
  width: 80%;
  height: 20%;
}
.btns {
  height: 35%;
  width: 70%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btns .btn {
  width: 90px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid;
  border-radius: 15px;
}
.refuse {
  border-color: #9c77aa;
  color: #9c77aa;
}
.comfirm {
  background-color: #9c77aa;
  border-color: #ccc;
  color: #fff;
}
.error {
  padding: 4px 0;
  margin: 0 12px;
  color: red;
  font-size: 0.7em;
}
</style>
