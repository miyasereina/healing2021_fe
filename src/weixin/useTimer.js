import { reactive, ref } from 'vue'
export const useTimer = () => {
  const timerInterval = ref(0)
  const timer = reactive({
    minute: 0,
    second: 0
  })
  const timerStart = (endMoment) => {
    timerInterval.value = setInterval(() => {
      if (endMoment) {
        if (
          timer.minute === endMoment.minute &&
          timer.second === endMoment.second
        ) {
          timerStop()
          return
        }
      }
      if (timer.second === 59) {
        timer.second = 0
        timer.minute++
      } else {
        timer.second++
      }
    }, 1000)
  }
  const timerStop = () => {
    clearInterval(timerInterval.value)
  }
  const timerReset = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    timer.minute = 0
    timer.second = 0
  }
  return {
    timer,
    timerStart,
    timerStop,
    timerReset
  }
}
