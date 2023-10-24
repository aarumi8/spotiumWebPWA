<template>
  <div class="flex flex-col h-screen bg-custom-gray p-4">
    
    <!-- Welcome Heading -->
    <h1 class="text-white text-2xl font-bold mb-4">Profile Creation</h1>
    

    <!-- Buttons in Column -->
    <div class="flex flex-col gap-4 mt-auto">
      <button @click="complete" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="w-full font-semibold text-white rounded-full p-3">Create Avatar</button>
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
  methods: {
    complete() {

    }
  }
}
</script>