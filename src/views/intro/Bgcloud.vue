<template>
  <div class="banner">
    <div class="clouds">
      <img src="./cloud/cloud1.png" style="--i:6" />
      <img src="./cloud/cloud2.png" style="--i:4" />
      <img src="./cloud/cloud3.png" style="--i:1" />
      <img src="./cloud/cloud4.png" style="--i:4" />
      <img src="./cloud/cloud5.png" style="--i:2" />
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.banner {
  position: relative;
  width: 100%;
  height: 20vh;
  z-index: -1;
  /* background: url('../../assets/bg.png'); 
background-size: cover;
background-position: bottom; */
}

.banner .clouds {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20vh;
  overflow: hidden;
}

.banner .clouds img {
  position: absolute;
  bottom: 0;
  max-width: 100%;
  animation: animate calc(12s * var(--i)) linear infinite;
}

@keyframes animate {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
