<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl mb-4">Welcome to our App</h1>
    <button @click="login" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
      Log In
    </button>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  methods: {
    login() {
      // When button is clicked, set loggedIn to true in the store
      this.$store.commit('setLoggedIn', true);

      // Redirect to home or profile creation based on your requirements
      this.$router.push('/create-profile');
    }
  }
}
</script>
