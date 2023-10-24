<template>
  <div class="h-screen w-full font-sans p-0 bg-white">
    <iframe v-if="showIframe" id="frame" class="w-full h-screen border-0" :src="iframeSrc" allow="camera *; microphone *; clipboard-write"></iframe>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: 'auth',
  data() {
    return {
      showIframe: true, // Setting the iframe to be shown by default
      iframeSrc: 'https://spotium-web.readyplayer.me/avatar?frameApi',
    };
  },
  mounted() {
    window.addEventListener('message', this.subscribe);
  },
  beforeDestroy() {
    // Remove the event listener to prevent potential memory leaks
    window.removeEventListener('message', this.subscribe);
  },
  methods: {
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
        this.$router.push('/create-user-profile');
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
