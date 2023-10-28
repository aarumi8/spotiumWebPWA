<template>
  <div class="flex flex-col h-screen bg-custom-gray p-4">
    <!-- Welcome Heading -->
    <h1 class="text-white text-2xl font-bold mb-4">Business Creation</h1>

    <!-- Text Field: Business Name -->
    <label for="businessName" class="text-white mb-2 font-semibold">Business Name</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
    <input 
        id="businessName" 
        v-model="businessName" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white', 'placeholder-opacity-30']"
        @input="handleInput('businessName')" 
        type="text" 
        placeholder="Business name">
    </div>

    <!-- Text Field: Address -->
    <label for="address" class="text-white mb-2 font-semibold">Address</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
    <input 
        id="address" 
        v-model="address" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white', 'placeholder-opacity-30']"
        @input="handleInput('address')" 
        type="text" 
        placeholder="Your address">
    </div>

    <!-- Text Field: Email -->
    <label for="email" class="text-white mb-2 font-semibold">Email</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
    <input 
        id="email" 
        v-model="email" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white', 'placeholder-opacity-30']"
        @input="handleInput('email')" 
        type="email" 
        placeholder="Your contact email">
    </div>

    <!-- Dropdown Picker: Industry -->
    <label for="industry" class="text-white mb-2 font-semibold">Industry</label>
    <div class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden">
      <select 
        id="industry" 
        v-model="industry" 
        :class="['flex-grow', 'px-4', 'p-1', 'appearance-none', 'outline-none', 'bg-transparent', 'text-white']"
        @input="handleInput('industry')">
        <option disabled value="">Choose industry</option>
        <option value="Clothing">Clothing</option>
        <option value="Energy">Energy</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Finance">Finance</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Manufacturing">Manufacturing</option>
        <option value="Real Estate">Real Estate</option>
        <option value="Retail">Retail</option>
        <option value="Tech">Tech</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <!-- Button: Complete -->
    <button @click="completeProfile" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="mb-3 mt-auto w-full font-semibold text-white rounded-full p-3">Complete</button>

  </div>
</template>


<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
      businessName: '',
      address: '',
      email: '',
      industry: ''
    };
  },
  methods: {
    handleInput(field) {
      // Handle input for individual fields if needed
      console.log(`${field} changed to ${this[field]}`);
    },
    completeProfile() {
        if(this.businessName && this.address && this.email && this.industry) {
            this.$store.commit('setNewUser', false);
            this.$store.commit('setBusiness', true);

            // Redirect to home
            this.$router.push('/');
        } else {
            alert('Please, complete all fields')
        }
    }
  }
}
</script>

<style scoped>
.bg-custom-gray {
  background-color: rgb(30, 30, 30);
}
</style>
