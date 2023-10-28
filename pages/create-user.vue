<template>
  <div class="flex flex-col h-screen bg-custom-gray p-4">
    
    <!-- Welcome Heading -->
    <h1 class="text-white text-2xl font-bold mb-4">Avatar Creation</h1>
    
    <!-- Image Container -->
    <div class="flex-grow flex items-center justify-center mb-4">
      <img src="avatar-preview.png" alt="Avatar" class="object-contain h-3/4 w-3/4">
    </div>

    <!-- Buttons in Column -->
    <div class="flex flex-col gap-4 mb-3 mt-auto">
      <button @click="createAvatar" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="w-full font-semibold text-white rounded-full p-3">Create Avatar</button>
      <button @click="createProfile" class="w-full border border-white font-semibold text-white rounded-full p-3">Create Later</button>
    </div>

    <!-- Buttons -->
    <!-- <div class="flex gap-4 mb-4">
      <button class="w-1/2 py-2 bg-blue-500 text-white rounded-full">Button 1</button>
      <button class="w-1/2 py-2 bg-red-500 text-white rounded-full">Button 2</button>
    </div> -->
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
  methods: {
    createAvatar() {
        this.$router.push('/create-user-avatar' + "?user=" + this.userId);
    },
    async completeProfileAvatar(url, id) {
      try {
        const payload = { userId: this.userId, isBusiness: false, avatarUrl: url, avatarId: id, };
        const response = await this.$axios.post('/post_create_profile', payload);
        console.log(response.status)
        console.log(response.data);

        if(response.status === 200) {
          this.$router.push('/create-user-profile' + '?user=' + response.data.id);
        } else {
          alert('Error on API side')
          return
        }
      } catch(err) {
        console.log(err)
      }
    },
    async createProfile() {
      await this.completeProfileAvatar('https://models.readyplayer.me/64e3055495439dfcf3f0b665.glb', 'avatar-pic-test.png')
      this.$router.push('/create-user-profile' + "?user=" + this.userId);
    }
  }
}
</script>