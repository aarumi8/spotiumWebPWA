<template>
  <div class="flex items-center justify-center h-screen bg-cloud bg-cover px-10">

    <div v-if="isInstalled" class="bg-white bg-opacity-30 rounded-3xl p-5 w-full max-w-lg">
      <h1 class="text-left mt-0 mb-20 text-xl font-semibold text-white login-text">Log In</h1>
      <button class="bg-transparent w-full mb-4 p-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-full">
        <span class="font-semibold">Log In with Google</span>
      </button>
      <button style="border-color: rgba(150, 200, 150, 0.5);" class="mb-20 relative bg-white w-full p-3 border rounded-full transition-colors duration-300 overflow-hidden">
        <span class="z-10 relative text-gradient font-semibold">Log In with crypto wallet</span>
      </button>
    </div>

    <div v-if="!isInstalled" class="bg-white bg-opacity-30 rounded-3xl p-5 w-full max-w-lg">
      <h1 class="text-left mt-0 mb-20 text-xl font-semibold text-white login-text">Installation</h1>
      <button @click="installApp" style="border-color: rgba(150, 200, 150, 0.5);" class="mb-20 relative bg-white w-full p-3 border rounded-full transition-colors duration-300 overflow-hidden">
        <span class="z-10 relative text-gradient font-semibold">Install App</span>
      </button>
    </div>

  </div>
</template>



<style scoped>
.login-text {
  text-decoration: underline;
  text-underline-offset: 7px;
}
.bg-cloud {
  background-image: url('/login-bkg.png');
}

/* Gradient text for the crypto wallet button */
.text-gradient {
  background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));
  -webkit-background-clip: text;
  color: transparent;
}
</style>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
      isInstalled: false,
      deferredPrompt: null
    }
  },
  mounted() {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('the app is installed') 
    } else {
      console.log('the app is not installed')
    }
    // window.addEventListener('beforeinstallprompt', this.beforeInstallPrompt);
    // window.addEventListener('appinstalled', this.onAppInstalled);
  },
  beforeDestroy() {
    window.removeEventListener('beforeinstallprompt', this.beforeInstallPrompt);
    window.removeEventListener('appinstalled', this.onAppInstalled);
  },
  methods: {
    beforeInstallPrompt(event) {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showPrompt = true;
    },
    async installApp() {
      if (!this.deferredPrompt) return;
      this.showPrompt = false;

      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      this.deferredPrompt = null;
    },
    dismiss() {
      this.showPrompt = false;
    },
    onAppInstalled() {
      console.log('App installed');
      this.showPrompt = false;
    },
    login() {
      // When button is clicked, set loggedIn to true in the store
      this.$store.commit('setLoggedIn', true);

      // Redirect to home or profile creation based on your requirements
      this.$router.push('/create-profile');
    },
  }
}
</script>
