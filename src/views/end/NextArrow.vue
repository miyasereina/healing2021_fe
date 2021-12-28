<template>
   <div class="next-arrow">
     <img src="../../assets/end/next.png" alt="">
   </div>
</template>

<style scope>
.next-arrow {
  margin: 5px auto;
  width: 40px;
}
.next-arrow img {
  width: 100%;
  animation: bounce 1.6s linear infinite;
}

@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(8px);
  }
}
</style>
