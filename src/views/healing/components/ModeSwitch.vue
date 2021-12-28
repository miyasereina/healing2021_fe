<template>
  <div ref="switch" class="switch-wrapper">
    <input
      type="checkbox"
      :id="switchID"
      v-model="isChecked"
      :disabled="isDisabled"
      @change="$emit('mode-change', isChecked)"
    >
    <label :id="id" :for="switchID" class="switch">
      <span ref="leftMode" class="left-mode">
        <slot name="left"></slot>
      </span>
      <span ref="rightMode" class="right-mode">
        <slot name="right"></slot>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ModeSwitch',
  props: {
    switchID: {
      type: String,
      required: true
    },
    mode: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isChecked: this.mode
    }
  },
  mounted () {
    this.$refs.switch.style.setProperty('--left-mode-width', this.$refs.leftMode.offsetWidth + 'px')
    this.$refs.switch.style.setProperty('--right-mode-width', this.$refs.rightMode.offsetWidth + 'px')
  },
  watch: {
    mode: function (val) {
      this.isChecked = val
    }
  }
}
</script>

<style scoped>
.switch-wrapper {
  --left-mode-width: 0;
  --right-mode-width: 0;
}
input[type=checkbox] {
  display: none;
}
.switch {
  height: 28px;
  margin: 0 5px;
  background-color: #fffbfb;
  border: 1px solid #595858;
  border-radius: 14px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.switch::before {
  content: "";
  width: var(--left-mode-width);
  height: 100%;
  border: 1px solid #595858;
  border-radius: 14px;
  position: absolute;
  left: 0;
  background-color: #30487d;
  transition: all 0.3s ease-in-out;
}
.switch > span {
  display: inline-block;
  padding: 0 10px;
  z-index: 0;
  font-size: 0.85rem;
  transition: all 0.4s ease-in-out;
}
.left-mode {
  color: #ffffff;
}
.right-mode {
  color: #000000;
}
input[type=checkbox]:checked + .switch::before {
  width: var(--right-mode-width);
  transform: translateX(var(--left-mode-width));
}
input[type=checkbox]:checked + .switch > .left-mode {
  color: #000000;
}
input[type=checkbox]:checked + .switch > .right-mode {
   color: #ffffff;
 }
</style>
