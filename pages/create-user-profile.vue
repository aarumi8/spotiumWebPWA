<template>
  <div class="flex flex-col h-screen bg-custom-gray p-4">
    
    <!-- Welcome Heading -->
    <h1 class="text-white text-2xl font-bold mb-4">Profile Creation</h1>

        <!-- Circle with Image -->
<div class="mx-auto mb-4 w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden relative">
    <div v-if="imageLoading" class="loader absolute inset-0 m-auto"></div>
    <img 
        :src="avatarSrc" 
        alt="Profile Image" 
        style="transform: scale(2) translateY(20%);" 
        class="w-full h-full object-cover"
        :class="{'opacity-0': imageLoading}" 
        @load="imageLoaded">
</div>
    
    <label for="userName" class="text-white mb-2 font-semibold">Create a username</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
    <input 
        id="userName" 
        v-model="userName" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white', 'placeholder-opacity-30']"
        @input="handleInput('userName')" 
        type="text" 
        placeholder="Username">
    </div>

    <label for="age" class="text-white mb-2 font-semibold">What's your age?</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
    <input 
        id="age" 
        v-model="age" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white', 'placeholder-opacity-30']"
        @input="handleInput('age')" 
        type="text" 
        placeholder="Your age">
    </div>

    <label for="age" class="text-white mb-2 font-semibold">What are you interested in?</label>

    <div class="flex mb-4">
    <div class="flex flex-col w-1/2 gap-2 pr-2">
        <div v-for="(interest, index) in interests.slice(0,4)" :key="index" 
            @click="interest.selected = !interest.selected" 
            :class="['p-3 border-opacity-30 rounded-full border border-white flex items-center justify-center font-semibold', interest.selected ? 'bg-light-blue text-white' : 'bg-transparent text-white']">
        {{ interest.label }}
        </div>
    </div>
    
    <div class="flex flex-col w-1/2 gap-2 pl-2">
        <div v-for="(interest, index) in interests.slice(4,8)" :key="index" 
            @click="interest.selected = !interest.selected" 
            :class="['p-3 border-opacity-30 rounded-full border border-white flex items-center justify-center font-semibold', interest.selected ? 'bg-light-blue text-white' : 'bg-transparent text-white']">
        {{ interest.label }}
        </div>
    </div>
    </div>

    <!-- Buttons in Column -->
    <div class="flex flex-col gap-4 mt-auto">
      <button @click="complete" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="w-full font-semibold text-white rounded-full p-3">Create</button>
    </div>

  </div>
</template>

<style scoped>
.bg-custom-gray {
  background-color: rgb(30, 30, 30);
}
.bg-light-blue {
    background-color: #78BEE1; /* Light blue color */
}
.loader {
    border: 2px solid rgb(0, 255, 213);
    border-radius: 50%;
    border-top: 4px solid #fff;
    width: 36px; 
    height: 36px; 
    animation: spin 1s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>

<script> 
import { mapState } from 'vuex';

export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
        avatarSrc: 'avatar-pic-test.png',
        userName: '',
        age: '',
        imageLoading: true,
        interests: [
            { label: 'Technology', selected: false },
            { label: 'Crypto', selected: false },
            { label: 'Music', selected: false },
            { label: 'Fashion', selected: false },
            { label: 'Sport', selected: false },
            { label: 'Games', selected: false },
            { label: 'Art', selected: false },
            { label: 'Movies', selected: false }
        ]
    }
  },
  computed: {
    ...mapState({
      avatarUrl: state => state.avatarUrl
    })
  },
  mounted() {
    // this.avatarUrl = '6537f1ba03fbd3bd39ebcd39'
    if (this.avatarUrl) {
      this.avatarSrc = `https://models.readyplayer.me/${this.avatarUrl}.jpg?camera=portrait?quality=30?size=1024`;
    }
  },
  methods: {
    imageLoaded() {
        this.imageLoading = false;
    },
    handleInput(field) {
      // Handle input for individual fields if needed
      console.log(`${field} changed to ${this[field]}`);
    },
    complete() {
        if(this.userName && this.age && this.interests.some(interest => interest.selected)) {
            this.$router.push('/');
        } else {
            alert('Please, complete all fields and select at least 1 interest')
        }
    }
  }
}
</script>