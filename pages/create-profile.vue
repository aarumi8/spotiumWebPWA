<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <h1 class="text-3xl mb-4">Create Your Profile</h1>
    <!-- Add form fields as needed here -->
    <button @click="completeProfile" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
      Finish
    </button>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  methods: {
    completeProfile() {
      // Set newUser to true in the store
      this.$store.commit('setNewUser', false);

      // Redirect to home
      this.$router.push('/');
    }
  }
}
</script>
