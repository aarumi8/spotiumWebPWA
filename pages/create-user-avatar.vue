<template>
  <div class="h-screen w-full font-sans p-0 bg-white">
    <LoadingScreen v-if="isLoading" />
    <iframe v-if="showIframe" id="frame" class="w-full h-screen mb-3 border-0" :src="iframeSrc" allow="camera *; microphone *; clipboard-write"></iframe>
  </div>
</template>

<script>
import LoadingScreen from '~/components/LoadingScreen.vue';
export default {
  layout: 'auth',
  middleware: 'auth',
    components: {
    LoadingScreen
  },
  data() {
    return {
      showIframe: false, // Setting the iframe to be shown by default
      iframeSrc: 'https://spotium-web.readyplayer.me/avatar?frameApi&token=',
      userId: this.$route.query.user,
      token: null,
                  isLoading: true,
            dataFetched: false,
            pageLoaded: false
    };
  },
  async created() {
    this.token = await this.getToken()

    if(this.token) {
      this.iframeSrc = this.iframeSrc + this.token
      this.showIframe = true
      console.log(this.iframeSrc)
    } else {
      this.iframeSrc = "https://spotium-web.readyplayer.me/avatar?frameApi"
      this.showIframe = true 
      alert('create avatar')
    }

    window.addEventListener('message', this.subscribe);

this.isLoading=false
  },
  mounted() {

    // window.addEventListener('message', this.subscribe);
  },
  beforeDestroy() {
    // Remove the event listener to prevent potential memory leaks
    window.removeEventListener('message', this.subscribe);
  },
  methods: {
    async getToken() {
      try {
        const response = await this.$axios.get('/get_data_id');
        console.log(response.status)
        console.log(response.data);

        if(response.status === 200) {
          return response.data.token
        } else {
          alert('Error on API side')
          return null
        }
      } catch(err) {
        console.log(err)
        return null
      }
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
    subscribe(event) {
      const json = this.parse(event);

      if (json?.source !== 'readyplayerme') {
        return;
      }

      if (json.eventName === 'v1.frame.ready') {
        document.getElementById('frame').contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }

      if (json.eventName === 'v1.avatar.exported') {
        this.showIframe = false;
        console.log('success:', json.data)
        this.$store.commit('setAvatarUrl', json.data.avatarId);
        this.$store.commit('setAvatarLink', json.data.url);
        this.$store.commit('setLoggedIn', true);
        this.completeProfileAvatar(json.data.url, json.data.avatarId)
        // document.getElementById('avatarUrl').innerText = `Avatar URL: ${json.data.url}`;
      }

      if (json.eventName === 'v1.user.set') {
        console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
      }
    },
    parse(event) {
      try {
        return JSON.parse(event.data);
      } catch (error) {
        return null;
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
