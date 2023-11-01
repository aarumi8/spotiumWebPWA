<template>
  <div class="loading-screen flex items-center justify-center h-screen w-full bg-gray-100 fixed top-0 left-0 z-50">
    <dotlottie-player
      src="/loading.lottie"
      speed="1.5"
      style="width: 320px; height: 320px"
      direction="1"
      mode="normal"
      loop
      autoplay
    ></dotlottie-player>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',

}
</script>

<style scoped>
/* You can add any additional styles if needed */
</style>
