<template>
<div>
  <!-- <LoadingScreen v-if="isLoading" /> -->
    <a-scene
      vr-mode-ui="enabled: false"
      arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false; sourceWidth:1280; sourceHeight:960; displayWidth: 1280; displayHeight: 960;"
    >
      <a-camera gps-camera='gpsMinDistance: 15' rotation-reader></a-camera>
    </a-scene>
              <div class="absolute bottom-0 left-0 right-0 flex justify-between p-4 mb-4">
            <!-- Left button with image -->
            <button style="visibility: hidden" id='businessBtn' class="flex-shrink-0">
                <img src="/add-quest-pic.png" alt="Left Button" class="w-12 h-12 object-cover">
            </button>

            <!-- Center button with image -->
            <button @click='claim'>
                <img src="/ar-btn-pic.png" alt="Center Button" class="w-16 h-16 object-cover mx-auto">
            </button>

            <!-- Right button with image -->
            <button style="visibility: hidden" class="flex-shrink-0">
                <img src="/profile-pic.png" alt="Right Button" class="w-12 h-12 object-cover">
            </button>
            </div>
</div>
</template>

<script> 
import LoadingScreen from '~/components/LoadingScreen.vue';
export default {
    components: {
    LoadingScreen
  },
    data() {
        return {
            userId: this.$route.query.user,
            questId: this.$route.query.quest,
            quest: null,
            watchId: null,
            isModelFound: false,
            isLoading: true,
            dataFetched: false,
            pageLoaded: false
        }
    },
    computed: {
        questLocation() {
            if (this.quest && this.quest.location) {
                return `latitude: ${this.quest.data.location.lat}; longitude: ${this.quest.data.location.lon};`;
            }
            return '';
        }
    },
    async mounted() {
        // var q = {
        //     data: {
        //         url: "https://firebasestorage.googleapis.com/v0/b/tree-project-966d4.appspot.com/o/Duck.glb?alt=media&token=cf724100-400b-4f92-829b-d3f9a8f34197&_gl=1*4giteh*_ga*MTY1MzU5OTgwNS4xNjg5NTQ5Mjgx*_ga_CW55HF8NVT*MTY5ODUzOTAyMS43My4xLjE2OTg1MzkxMTUuNTAuMC4w",
        //         location: {
        //             lat: "53.917569",
        //             lon: "27.561809"
        //         }
        //     }
        // }
        // this.quest = q
      
        const payload = { questId: this.questId };
        const response = await this.$axios.post('/get_quest', payload);
        if(response.data) {
            this.quest = response.data
            console.log(this.quest.data.location.lat, this.quest.data.location.lon, this.quest.data.url)
        }
       

        let scene = document.querySelector('a-scene');
        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${this.quest.data.location.lat}; longitude: ${this.quest.data.location.lon};`);
        model.setAttribute('gltf-model', this.quest.data.url);
        model.setAttribute('scale', '0.1 0.1 0.1');
        model.setAttribute('look-at', '[gps-camera]')
        model.setAttribute('animation', "property: rotation; dur: 5000; to: 0 360 0; loop: true; easing: linear");
        model.addEventListener('loaded', () => {
            window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
        });
        model.setAttribute('visible', 'false');
        scene.appendChild(model);

      // Start watching user's location
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
            const distance = this.haversineDistance(coords.lat, coords.lng, this.quest.data.location.lat, this.quest.data.location.lon);
            console.log(distance)
            if(distance <= 15) {
                model.setAttribute('visible', 'true');
                this.isModelFound = true
            } else {
                model.setAttribute('visible', 'false');
                this.isModelFound = false
            }
        },
        (error) => {
          console.error("Error watching user's location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 3000,
        }
      );
this.isLoading=false
        return
        console.log(this.userId)
        console.log(this.questId)

    },
    beforeDestroy() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    },
    methods: {
    claim() {
        if(this.isModelFound) {
            alert('You have claimed the Key!')
            window.location.href = '/?user=' + this.userId;
            // this.$router.push('/?user=' + this.userId)
        } else {
            alert('You have to find the key first')
        }
    },
    haversineDistance(lat1, lon1, lat2, lon2) {
        function toRad(value) {
            return value * Math.PI / 180;
        }
        
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        return d * 1000; // returns the distance in meters
    },
    getUserLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              lng: position.coords.longitude,
              lat: position.coords.latitude,
            }),
          (error) => reject(error)
        );
      });
    },
    }
}
</script>