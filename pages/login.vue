<template>
  <div class="flex items-center justify-center h-screen bg-cloud bg-cover px-10">

    <div v-if="isInstalled" class="bg-white bg-opacity-30 rounded-3xl p-5 w-full max-w-lg">
      <h1 class="text-left mt-0 mb-20 text-xl font-semibold text-white login-text">Log In</h1>
      <button @click='loginGoogle' class="bg-transparent w-full mb-4 p-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 rounded-full">
        <span class="font-semibold">Log In with Google</span>
      </button>
      <button @click='loginWallet' style="border-color: rgba(150, 200, 150, 0.5);" class="mb-20 relative bg-white w-full p-3 border rounded-full transition-colors duration-300 overflow-hidden">
        <span class=" relative text-gradient font-semibold">Log In with crypto wallet</span>
      </button>
    </div>

    <!-- Google Login Modal -->
    <transition name="modal">
    <div v-show="showGoogleLogin" class="fixed p-5 top-0 left-0 w-full h-full flex items-center justify-center fade-in-scale" 
     @click="closeModal">
      <div class="bg-white rounded-lg p-5 w-full max-w-md">
        <label for="walletAddress" class="block mb-4 text-xl font-semibold">Login with Google</label>
        
        <div class="flex items-center border rounded w-full mb-4 overflow-hidden">
          <input 
            id="walletAddress" 
            v-model="walletAddress" 
            :class="[{'text-center': isPlaceholderCentered, 'text-right': !isPlaceholderCentered }, 'flex-grow', 'p-2', 'appearance-none', 'outline-none']"
            @input="handleInput" 

            type="text" 
            placeholder="Enter your Google email">
          <span class="bg-gray-100 p-2 text-gray-600">.@gmail.com</span>
        </div>
        
        <button @click="loginWithGoogle" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="w-full font-semibold text-white rounded-full p-3">Log In</button>
      </div>
    </div>
    </transition>

    <!-- Crypto Login Modal -->
    <transition name="modal">
    <div v-show="showCryptoLogin" class="fixed p-5 top-0 left-0 w-full h-full flex items-center justify-center fade-in-scale" @click="closeModal">
      <div class="bg-white rounded-lg p-5 w-full max-w-md">
        <label for="walletAddress" class="block mb-4 text-xl font-semibold">Login with Crypto Wallet</label>
        
        <div class="flex items-center border rounded w-full mb-4 overflow-hidden">
          <input 
            id="walletAddress" 
            v-model="walletAddress" 
            :class="[{'text-center': isPlaceholderCentered, 'text-right': !isPlaceholderCentered }, 'flex-grow', 'p-2', 'appearance-none', 'outline-none']"
            @input="handleInput" 
            class="flex-grow p-2 appearance-none outline-none" 
            type="text" 
            placeholder="Enter your NEAR address">
          <span class="bg-gray-100 p-2 text-gray-600">.near</span>
        </div>
        
        <button @click="loginWithCrypto" style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));" class="w-full font-semibold text-white rounded-full p-3">Log In</button>
      </div>
    </div>
    </transition>

    <div v-if="!isInstalled" class="bg-white bg-opacity-30 rounded-3xl p-5 w-full max-w-lg">
      <h1 class="text-left mt-0 mb-20 text-xl font-semibold text-white login-text">Installation</h1>
      <button @click="installApp" style="border-color: rgba(150, 200, 150, 0.5);" class="mb-20 relative bg-white w-full p-3 border rounded-full transition-colors duration-300 overflow-hidden">
        <span class="z-10 relative text-gradient font-semibold">Install App</span>
      </button>
    </div>

    <transition name="modal">
    <div v-show="showModal" class="modal-overlay fade-in-scale" @click="closeModal">
      <div class="modal-content">
        <div v-if="isIos" class="image-scroll">
          <img src="/ios-guide-1.png" alt="Description 1">
          <img src="/ios-guide-2.png" alt="Description 2">
          <img src="/ios-guide-3.png" alt="Description 3">
        </div>

        <div v-if="!isIos" class="image-scroll">
          <img src="/a-guide-1.png" alt="Description 1">
          <img src="/a-guide-2.png" alt="Description 2">
          <img src="/a-guide-3.png" alt="Description 3">
        </div>
      </div>
    </div>
    </transition>

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
}

.modal-content {
  background: #fff;
  padding: 20px;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  overflow: auto;
}

.image-scroll {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
}

.image-scroll img {
  margin-right: 10px;
  max-width: 90%;
  height: auto;
}
.text-center::placeholder {
  text-align: center;
}

.text-right::placeholder {
  text-align: right;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.modal-enter, .modal-leave-to /* .modal-leave-to in <2.1.8 */ {
  opacity: 0;
  transform: scale(0.8);
}
</style>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
      isInstalled: false,
      deferredPrompt: null,
      showModal: false,
      isIos: true,
      showCryptoLogin: false,
      showGoogleLogin: false,
      walletAddress: null,
      googleMail: null,
      isPlaceholderCentered: true
    }
  },
  mounted() {
    self.addEventListener('fetch', event => {
      event.respondWith(
          fetch(event.request, { cache: "no-store" })
          .catch(error => {
              // Handle any errors, maybe respond with a fallback.
              console.error('Fetching failed:', error);
              throw error;
          })
      );
    });

    if (this.isAppInstalled()) {
      console.log('the app is installed') 
      this.isInstalled = true
    } else {
      console.log('the app is not installed')
      this.isInstalled = true // !important: the default is FALSE
    }

    if(this.getDeviceOS() !== 'IOS') {
      this.isIos = false
    }
  },
  methods: {
    handleInput() {
      if (this.walletAddress.length > 0) {
        this.isPlaceholderCentered = false;
      } else {
        this.isPlaceholderCentered = true;
      }
    },
    getDeviceOS() {
      const userAgent = window.navigator.userAgent;

      if (/android/i.test(userAgent)) {
        return 'Android';
      }

      if (/iPad|iPhone|iPod/i.test(userAgent)) {
        return 'IOS';
      }

      return 'Unknown'
    },
    isAppInstalled() {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        return true
      } else {
        return false
      }
    },
    async installApp() {
      this.showModal = true
    },
    loginGoogle() {
      this.showGoogleLogin = true
    },
    loginWithGoogle() {
      if(this.walletAddress) {
        this.login()
      } else {
        alert('Please, enter your email')
      }
    },
    loginWallet() {
      this.showCryptoLogin = true
    },
    closeModal(event) {
      if (event.target === event.currentTarget) {
        this.showCryptoLogin = false;
        this.showGoogleLogin = false;
        this.showModal = false
        this.isPlaceholderCentered = true
        this.walletAddress = null;
      }
    },
    loginWithCrypto() {
      if(this.walletAddress) {
        this.login()
      } else {
        alert('Please, enter your wallet address')
      }
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
