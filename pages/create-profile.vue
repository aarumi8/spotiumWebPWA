<template>
  <div class="flex flex-col h-screen bg-custom-gray">
    <!-- Welcome Heading -->
    <div class="p-4">
      <h1 class="text-white text-2xl font-bold">Welcome to Spotium! 🚀📱</h1>
    </div>

    <!-- Centered content -->
    <div class="flex flex-col items-center justify-center flex-grow">
      <!-- Label above buttons -->
      <div class="mb-4 text-white font-semibold">
        Please, choose your type
      </div>

      <!-- I am User button -->
      <button @click="goToUser"
        class="bg-transparent w-full max-w-xs mb-4 p-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-full">
        <span class="font-semibold">I am User</span>
      </button>

      <!-- I am Business button -->
      <button @click="goToBusiness"
        class="bg-transparent w-full max-w-xs mb-4 p-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-full">
        <span class="font-semibold">I am Business</span>
      </button>
    </div>
  </div>
</template>


<style scoped>
.bg-custom-gray {
  background-color: rgb(30, 30, 30);
}
</style>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
      userId: this.$route.query.user
    }
  },
  created() {
    console.log(this.userId)
  },
  methods: {
    goToUser() {
      this.$router.push('/create-user' + "?user=" + this.userId);
    },
    goToBusiness() {
      this.$router.push('/create-business' + "?user=" + this.userId);
    },
  }
}
</script>
