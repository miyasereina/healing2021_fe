import { ref, reactive } from 'vue'
import wx from 'weixin-js-sdk'
import { useTimer } from './useTimer'
export var RecordState
;(function(RecordState) {
  RecordState['Ready'] = 'READY'
  RecordState['Recording'] = 'RECORDING'
  RecordState['RecordEnd'] = 'RECORD_END'
  RecordState['Replaying'] = 'REPLAYING'
  RecordState['ReplayPause'] = 'REPLAY_PAUSE'
  RecordState['Uploading'] = 'UPLOADING'
  RecordState['Translating'] = 'TRANSLATING'
  RecordState['End'] = 'END'
})(RecordState || (RecordState = {}))
export const useWXRecord = () => {
  const recordState = ref(RecordState.Ready)
  const { timer, timerStart, timerStop, timerReset } = useTimer()
  const audioDuration = reactive({
    minute: 0,
    second: 0
  })
  const audioSplitIndex = ref(0)
  const errorMessage = ref('')
  const localIDList = ref([])
  const serverIDList = ref([])
  const translateText = ref('')
  wx.onVoiceRecordEnd({
    success: (res) => {
      localIDList.value.push(res.localId)
      console.log(localIDList.value)
      wx.startRecord()
    }
  })
  wx.onVoicePlayEnd({
    success: () => {
      if (++audioSplitIndex.value !== localIDList.value.length) {
        wx.playVoice({
          localId: localIDList.value[audioSplitIndex.value]
        })
      } else {
        audioSplitIndex.value = 0
        recordState.value = RecordState.RecordEnd
      }
    }
  })
  const recordStart = () => {
    if (recordState.value !== RecordState.Ready) {
      return
    }
    recordState.value = RecordState.Recording
    recordReset()
    timerStart()
    wx.startRecord()
  }
  const recordStop = () => {
    if (recordState.value !== RecordState.Recording) {
      return
    }
    recordState.value = RecordState.RecordEnd
    wx.stopRecord({
      success: (res) => {
        if (res.localId) {
          timerStop()
          audioDuration.minute = timer.minute
          audioDuration.second = timer.second
          localIDList.value.push(res.localId)
        }
      }
    })
  }
  const recordReplay = () => {
    if (recordState.value !== RecordState.RecordEnd) {
      return
    }
    recordState.value = RecordState.Replaying
    if (audioDuration.minute === 0 && audioDuration.second === 0) {
      return
    }
    audioSplitIndex.value = 0
    timerReset()
    timerStart(audioDuration)
    wx.stopVoice({
      localId: localIDList.value[audioSplitIndex.value],
      complete: () => {
        audioSplitIndex.value = 0
        wx.playVoice({
          localId: localIDList.value[audioSplitIndex.value]
        })
      }
    })
  }
  const recordReplayPause = () => {
    if (recordState.value !== RecordState.Replaying) {
      return
    }
    recordState.value = RecordState.ReplayPause
    timerStop()
    wx.pauseVoice({
      localId: localIDList.value[audioSplitIndex.value]
    })
  }
  const recordReplayResume = () => {
    if (recordState.value !== RecordState.ReplayPause) {
      return
    }
    recordState.value = RecordState.Replaying
    if (audioDuration.minute === 0 && audioDuration.second === 0) {
      return
    }
    timerStart(audioDuration)
    wx.playVoice({
      localId: localIDList.value[audioSplitIndex.value]
    })
  }
  const recordReplayStop = () => {
    if (
      recordState.value !== RecordState.Replaying &&
      recordState.value !== RecordState.ReplayPause
    ) {
      return
    }
    recordState.value = RecordState.RecordEnd
    timerReset()
    audioSplitIndex.value = 0
    wx.stopVoice({
      localId: localIDList.value[audioSplitIndex.value]
    })
  }
  const recordReset = () => {
    if (
      recordState.value !== RecordState.RecordEnd &&
      recordState.value !== RecordState.ReplayPause
    ) {
      return
    }
    recordState.value = RecordState.Ready
    localIDList.value = []
    serverIDList.value = []
    audioDuration.minute = 0
    audioDuration.second = 0
    timerReset()
    translateText.value = ''
    wx.stopRecord()
    wx.stopVoice({
      localId: localIDList.value[audioSplitIndex.value]
    })
    audioSplitIndex.value = 0
  }
  const recordUpload = () => {
    if (
      recordState.value !== RecordState.RecordEnd &&
      recordState.value !== RecordState.ReplayPause
    ) {
      return
    }
    recordState.value = RecordState.Uploading
    errorMessage.value = ''
    serverIDList.value = []
    const uploadSplit = (splitIndex = 0) => {
      wx.uploadVoice({
        localId: localIDList.value[splitIndex],
        success: (res) => {
          console.log(res)
          serverIDList.value.push(res.serverId)
          if (++splitIndex < localIDList.value.length) {
            uploadSplit(splitIndex)
          } else {
            recordState.value = RecordState.End
          }
        },
        fail: (res) => {
          errorMessage.value = res.errMsg
          recordState.value = RecordState.RecordEnd
        }
      })
    }
    uploadSplit()
  }
  const recordTranslate = () => {
    if (recordState.value !== RecordState.RecordEnd) {
      return
    }
    recordState.value = RecordState.Translating
    errorMessage.value = ''
    wx.translateVoice({
      localId: localIDList.value[0],
      success: (res) => {
        console.log(res)
        translateText.value = res.translateResult
      },
      fail: (res) => {
        console.log(res)
        errorMessage.value = res.errMsg
        translateText.value = 'ERROR -> translate error'
      },
      complete: () => {
        recordState.value = RecordState.RecordEnd
      }
    })
  }
  return {
    recordState,
    timer,
    audioDuration,
    audioSplitIndex,
    errorMessage,
    localIDList,
    serverIDList,
    translateText,
    recordStart,
    recordStop,
    recordReplay,
    recordReplayPause,
    recordReplayResume,
    recordReplayStop,
    recordReset,
    recordUpload,
    recordTranslate
  }
}
