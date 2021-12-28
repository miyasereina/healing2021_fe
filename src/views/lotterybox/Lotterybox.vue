<template>
  <div class="title-box">
      <back-btn/>
      <div class="title">抽&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;奖</div>
  </div>
  <n-card :bordered="false" class="container"
    ><!---->
    <n-space vertical>
      <n-button
        round
        @click="activate()"
        style="--color-target:rgb(44,241,211);--text-color:white;float:right;--text-color-hover:rgb(44,241,211);
            --border-focus: 1px solid rgb(44,241,211);--text-color-pressed:rgb(44,241,211);--text-color-focus:
            rgb(44,241,211);--border-hover: 1px solid rgb(44,241,211)"
      >
        抽奖规则
      </n-button>
      <img class="image" @click="Lottery" src="../../assets/4.png"/>
      <!--奖池图片-->
    </n-space>
    <!--我的积分-->
    <p style="color:white;">我的积分：{{ score }}</p>

    <!--抽奖按钮-->
    <div class="drawbtnbox">
    <div
      class="drawbtn"
      @click="draw"
      
    >
      抽奖
    </div>
    </div>
    <!--任务列表-->
    <p>
      <n-divider title-placement="center" style="--text-color:white;"
        >每日任务</n-divider
      >
    </p>

    <n-space vertical>
      <div v-for="(item, i) in data.tasks" :key="i" v-show="isLoad">
        <div class="box">{{ item.Task.text }}</div>
        <div class="taskcontainer">
          <div style="width:65%;">
            <n-progress
              type="line"
              indicator-placement="inside-label"
              style="width:50vw;--fill-color:rgb(44,241,211)"
              :percentage="item.percent"
            />
            <!-- :percentage="task.task.max!==-1? task.container/task.task.max:100"-->
          </div>
          <div style="color:white;width:35%;">
            {{ item.counter }}&nbsp;分/{{
              item.Task.max !== -1 ? item.Task.max + "分" : "无积分上限"
            }}
          </div>
        </div>

      </div>
    </n-space>

    <!--抽奖规则-->
    <n-modal v-model:show="active" style="width:80vw;">
      <n-card title="规则" :bordered="false">
        <p>
          1.完成任务获得相应积分，当积分到10分时，用户通过填写手机号获得抽奖资格；
        </p>
        <p>
          2.活动结束后，将从资格用户中随机抽出与奖品数等量的用户给予奖品，并通过手机短信联系用户领奖。
        </p>
      </n-card>
    </n-modal>
    <!--奖池-->
    <n-modal v-model:show="showLottery">
      <n-card
        class="containerbox"
        style="--border-radius: 8vw;"
        content-style="display:flex;align-items:center;
                    flex-direction:column;flex-wrap:nowrap;"
      >
        <div v-for="(item, i) in Lotterymsg" :key="i">
          <n-card class="lotterybox" :bordered="false">
            <span>{{item.class}}</span>
            <p>{{ item.name }}</p>
            <n-image width=110 :src="item.picture" />
            <br/>
            <span>概率：{{ item.possibility }}%</span>
          </n-card>
        </div>
      </n-card>
    </n-modal>
    <!--抽奖框-->
    <n-modal :mask-closable="false" v-model:show="showdraw" style="width:70vw;">
      <n-card :bordered="false" style="border-radius:8vw;heigh:35vh;">
        <n-sapce vertical>
          <p style="text-align:center;">请填写手机号以获得抽奖资格：</p>
          <n-popover
            trigger="manual"
            :show="showPopover"
            placement="bottom-center"
            style="transform:translateY(-2.5vw)"
          >
            <template #trigger>
              <div style="text-align:center;">
                <n-input type="text" v-model:value="phonenumber" />
              </div>
            </template>
            <span>{{ phonenumberMsg }}</span>
          </n-popover>
          <div style="height:4vh;">&nbsp;</div>
          </n-sapce>
            <div class="btnbox">
              <div @click="confirmbtn" class="confirmbtnbox">确认</div>
              <div @click="cancelbtn" class="cancelbtnbox">取消</div>
            </div>
      </n-card>
    </n-modal>
    <!--消息提示框-->
    <n-modal v-model:show="showModal">
      <n-card
        :title="msgtitle"
        :bordered="false"
        style="width:60vw;border-radius:10vw;text-align:center;"
      >
        {{ msg }}
      </n-card>
    </n-modal>
  </n-card>
</template>
<script>
import { onBeforeMount, defineComponent, reactive, ref } from "vue";
import axios from "../../axios.js";
import store from '../../store'
import BackBtn from "../../components/BackBtn.vue";
// 抽奖页面没有完成的:奖池图没有素材
export default defineComponent({
  components: { BackBtn },
  setup() {
    const showModal = ref(false); // 信息提示框
    const msgtitle = ref(null);
    const msg = ref("");

    // 获取用户积分
    const score = ref(10);
    axios
      .get("/healing/lotterybox/points")
      .then(res => {
        score.value = res.data.points;
      })
      .catch(err => {
        msgtitle.value = null;
        msg.value = err.msg;
        console.log(err);
      })

    // 奖池部分
    const showLottery = ref(false);
    let Lotterymsg = reactive([
      {
        picture: require("./assets/draw2.jpg"), //奖品图像
        class:'一等奖',
        name: "蓝牙耳机", //奖品名
        possibility: 2 //概率，百分号由前端补充
      },
      {
        picture: require("./assets/draw3.jpg"), //奖品图像
        class:'二等奖',
        name: "有线耳机", //奖品名
        possibility: 8 //概率，百分号由前端补充
      },
      {
        picture: require("./assets/draw1.jpg"), //奖品图像
        class:'三等奖',
        name: "八音盒", //奖品名
        possibility: 20 //概率，百分号由前端补充
      },
      
      /*{
        picture: require("../../assets/bg.png"), //奖品图像
        name: "台灯", //奖品名
        possibility: 80 //概率，百分号由前端补充
      },
      {
        picture: require("../../assets/bg.png"), //奖品图像
        name: "台灯", //奖品名
        possibility: 80 //概率，百分号由前端补充
      }*/
    ])

    const Lottery = () => {
      // 查看奖池的信息
      // axios
      //   .get("/healing/lotterybox/lotteries")
      //   .then(res => {
      //     showLottery.value = true;
      //     Lotterymsg = res.data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     showModal.value = true;
      //     msgtitle.value = "提示信息";
      //     msg.value = err;
      //   });
      showLottery.value = true;
    }

    // 查看规则部分
    const active = ref(false);
    const activate = () => {
      // 查看规则
      active.value = true;
    }

    // 抽奖部分
    /* const name = ref('') // 奖品名
    const pictureUrl = ref(null)
    const spinshow = ref(false) */
    let phonenumber = ref('')
    const showdraw = ref(false)
    const phonenumberMsg = ref('')
    const showPopover = ref(false)
    const draw = () => {
      // 点击抽奖按钮
      if (score.value < 10) {
        store.commit(
          'setToast',
          '积分不足'
        )
      } else {
        showdraw.value = true
      }
    }
    const cancelbtn = () => {
      // 点击取消
      showPopover.value = false
      phonenumber.value = ""
      phonenumberMsg.value = ""
      showdraw.value = false
    };
    const confirmbtn = () => {
      // 点击确认
      if (phonenumber.value === "") {
        // 提示
        showPopover.value = true
        phonenumberMsg.value = "请填写手机号"
        console.log(phonenumber.value)
      } else {
        // 判断手机号是否正确
        let myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[4-9]{1})|(18[0-9]{1})|(199))+\d{8})$/;
        if (!myreg.test(phonenumber.value)) {
          // showPopover.value= false
          showPopover.value = true
          phonenumberMsg.value = "请填写正确的手机号"
        } else {
          axios
            .post("/healing/lotterybox/draw", { tel: phonenumber.value })
            .then((res) => {
              phonenumber.value = ""
              phonenumberMsg.value = ""
              showdraw.value = false
              // showModal.value = true
              // msgtitle.value = "提示"
              // msg.value = res.data.msg;
              store.commit('setToast',res.data.msg)
            })
            .catch((err) => {
              phonenumber.value = ""
              phonenumberMsg.value = ""
              // showdraw.value = false
              // showModal.value = true
              // msgtitle.value = "提示"
              // msg.value = err.msg
              store.commit('setToast',err.msg)
            });
        }
      }
    };
    // 任务部分
    const isLoad = ref(false)
    const data = reactive(
      {
        tasks:[
      {
        Task: {
          id: null,
          text: null, // 任务描述
          max: null //上限积分
        },
        counter: null //已经获得的积分，交付前端表示进度
      },
      {
        Task: {
          id: null,
          text: null, // 任务描述
          max: null //上限积分
        },
        counter: null //已经获得的积分，交付前端表示进度
      },
      {
        Task: {
          id: null,
          text: null, // 任务描述
          max: null //上限积分
        },
        counter: null //已经获得的积分，交付前端表示进度
      }]
      }
    )
  // 获取任务列表
  axios
      .get('/healing/lotterybox/tasktable')
      .then((res) => {
        // console.log('ok')
        data.tasks = res.data
        console.log(data.tasks)
        for (let index = 0; index < data.tasks.length; index++) {
        let a = data.tasks[index]
        if (a.Task.max > -1) {
          a["percent"] = (a.counter / a.Task.max) * 100
        } else {
          a.counter!==0? a["percent"] = 100:a["percent"] = 0
        }
        console.log(data.tasks)
        isLoad.value = true
       }
      })
      .catch(err => {
        console.log(err);
        showModal.value = true
        msgtitle.value = "提示"
        msg.value = err.msg;
      })

    onBeforeMount(() => {
      console.log('onBeforeMount')
    })
    

    
    

    // 图片url
    // const imgurl = reactive({
    //    img1: require("../../assets/bg.png")
    // });
    return {
      draw,
      activate,
      Lottery,
      cancelbtn,
      confirmbtn,
      msg,
      showModal,
      msgtitle,
      name,
      active,
      showLottery,
      Lotterymsg,
      phonenumber,
      phonenumberMsg,
      showPopover,
      showdraw,
      data,
      isLoad,
      // tchecked,
      // imgurl,
      score
    }
  }
})
</script>
<style scoped>
.taskcontainer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.containerbox {
  width: 70vw;
  height: 50vh;
  /* display: flex;
  flex-direction: column; */
  overflow: scroll;
}
::-webkit-scrollbar {
  display: none;
}
.lotterybox {
  width: 70vw;
  text-align: center;
}
.btnbox {
  display: flex;
    justify-content: space-around;
    /* margin-bottom: 4vh; */
    border-top-style: solid;
    border-top-color: rgb(239,239,245);
    border-top-width: thin;
    height: 6vh;
    /* display: flex; */
    /* justify-content: center; */
    align-items: center;
}
.confirmbtnbox{
  border-right-color: rgb(239,239,245);
    border-right-style: solid;
    border-right-width: thin;
    width: 30vw;
    text-align: center;
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cancelbtnbox{
  width: 30vw;
    text-align: center;
  height: 6vh;
  display: flex;
    align-items: center;
    justify-content: center;
}
.score {
  float: right;
}
.box {
  height: 5vh;
  color: white;
  font-size: 4vw;
  text-align: left;
}
.container {
  margin: 0;
  text-align: center;
  background: none;
  /* overflow: scroll; */
  /* background-image: url('../../assets/bg.png'); */
}
.image {
  width: 60vw;
  height: 20vh;
}
::-webkit-scrollbar {
  display: none;
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
} */
.title-box .title {
  width: 80vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  font-size: 5vw;
}
.drawbtnbox{
  text-align:center;display: flex;align-items: center;
    justify-content: center;
}
.drawbtn{
  background-image: url('../../assets/6.png');
  background-size: cover;
    height: 10vh;
    width: 10vh;
    color: white;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}
::-webkit-scrollbar{
  display: none;
}
</style>
