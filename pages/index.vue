<template>
  <div class="relative">
    <!-- <LoadingScreen v-if="isLoading" /> -->
    <div class="map-container" ref="mapContainer"></div>

    <button id='permBtn' style="background:rgb(30, 30, 30, 0.5)" class="absolute top-3 left-3 right-3 grow border border-white font-semibold text-white rounded-full p-3" v-show="!isHeadingPermission" @click="requestHeadingPermission">
      <span>Tap to turn compass on</span>
    </button>

    <!-- Button container -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-between p-4 mb-4">
      <!-- Left button with image -->
      <button @click='goToQuest' id='businessBtn' class="flex-shrink-0">
        <img src="/add-quest-pic.png" alt="Left Button" class="w-12 h-12 object-cover">
      </button>

      <!-- Center button with image -->
      <button @click='camera'>
        <img src="/ar-btn-pic.png" alt="Center Button" class="w-16 h-16 object-cover mx-auto">
      </button>

      <!-- Right button with image -->
      <button class="flex-shrink-0">
        <img src="/profile-pic.png" alt="Right Button" class="w-12 h-12 object-cover">
      </button>
    </div>
  </div>
</template>


<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";
import LoadingScreen from '~/components/LoadingScreen.vue';

export default {
  name: "IndexPage",
  middleware: "auth",
    components: {
    LoadingScreen
  },
  data() {
    return {
      map: null,
      watchId: null,
      tb: null,
      currentHeading: 0,
      isHeadingPermission: false,
      isBusiness: false,
      quests: false,
      userId: this.$route.query.user,
      avatarLink: null,
      quests: [],
      uLat: 0,
      uLon: 0,
      isLoading: true,
      dataFetched: false,
      pageLoaded: false
    };
  },
  async mounted() {

    try {

    await this.getUserData()
    await this.getQuestsData()

    if(!this.isBusiness) {
      document.getElementById('businessBtn').style.visibility = 'hidden'
    }

    if (process.client) {
      let center = [148.9819, -35.39847]; // default to New York

      try {
        const userLocation = await this.getUserLocation();
        center = [userLocation.lng, userLocation.lat];
      } catch (error) {
        console.error("Error getting user's location:", error);
        alert('error in getting gps permission')
      }

      // this.requestHeadingPermission()

      mapboxgl.accessToken =
        "pk.eyJ1IjoiZG9wbGVyMTY4IiwiYSI6ImNrMWsyZmxzNDAyaGgzb28zdTVyZzh3ejIifQ.rSb8A8Lm1MxVk7IMK9n40Q";
      const map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        center: center,
        zoom: 15.3,
        pitch: 45,
        bearing: -30,
        antialias: true,
        style: "mapbox://styles/dopler168/cloaqn5pb011b01qval792j4t",
        // style: "mapbox://styles/dopler168/clo97511u010001qs8g78b9tj",
      });

      window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
        defaultLights: true,
      });


      map.on("style.load", () => {
      //map.setConfigProperty('basemap', 'lightPreset', 'dawn');

        let i = 0;
        let models = this.quests
        if(models) {
          models.forEach((modelInfo) => {
            i++
            console.log(i)
            map.addLayer({
                id: "quest" + i,
                type: "custom",
                renderingMode: "3d",
                onAdd: () => {
                      console.log('modelInfo:')
                      console.log(modelInfo.location)
                        const options = {
                            obj: modelInfo.url,
                            type: "glb",
                            scale: { x: 0.5, y: 0.5, z: 0.5 },
                            units: "meters",
                            rotation: { x: 0, y: 0, z: 0 },
                             anchor: 'top'
                            // ... copy other properties from modelInfo as needed
                        };
                        
                        window.tb.loadObj(options, (model) => {
                            model.setCoords([modelInfo.location.lon, modelInfo.location.lat]);
                            model.setRotation({ x: 90, y: 0, z: 0 });
                            window.tb.add(model);
                            
                        let rotation = 0;
                        function updateRotation() {
                            rotation += (360 / 6) * (1 / 30); // Adjust the rotation speed as needed
                            rotation %= 360
                            model.setRotation({ x: 0, y: rotation, z: 0 });
                            window.tb.update();

                            // Request the next animation frame
                            requestAnimationFrame(updateRotation);
                        }

                        updateRotation();
                        });
                    
                },

                render: function (gl, matrix) {
                    gl.clear(gl.DEPTH_BUFFER_BIT);
                    window.tb.update();
                },
            });
          })
        }

        map.addLayer({
          id: "custom-threebox-model",
          type: "custom",
          renderingMode: "3d",
          onAdd: () => {
            const scale = 30;
            const options = {
              obj: this.avatarLink,
              type: "glb",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
              adjustment: { x: 0, y: 0, z: 0 },
              anchor: 'center'
            };

            window.tb.loadObj(options, (model) => {
              this.modelReference = model;
              model.setCoords(center);
              model.setRotation({ x: 0, y: 0, z: 0 });
              console.log(this.modelReference)
              window.tb.add(model);
            });
          },

          render: function (gl, matrix) {
            gl.clear(gl.DEPTH_BUFFER_BIT);
            window.tb.update();
          },
        });
      });

      // Start watching user's location
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const coords = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          this.updateUserLocationOnMap(coords);
          if (this.modelReference) {
            this.modelReference.setCoords([coords.lng, coords.lat]); // Move the 3D model to the new location
          }
        },
        (error) => {
          console.error("Error watching user's location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 1000,
        }
      );

      this.map = map;
      this.map.resize()
      
    }

this.isLoading=false
    } catch(err) {
      console.log('mounted err,: ', err)
      alert(err)
    }
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  },
  methods: {
    async getUserData() {
      const payload = { userId: this.userId };
      const response = await this.$axios.post('/get_user', payload);

      this.isBusiness = response.data.data.isBusiness
      this.avatarLink = response.data.data.avatarUrl

      console.log(response.data)
    },
    async getQuestsData() {
      const response = await this.$axios.get('/get_quests');
      if(response.data) {
        this.quests = response.data
        console.log(this.quests)
      }
    },
    goToQuest() {
      // this.$router.push('/create-quest' + "?user=" + this.userId);
      window.location.href = '/create-quest?user=' + this.userId;
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
    updateUserLocationOnMap(coords) {
      if (this.map) {
        this.uLat = coords.lat 
        this.uLon = coords.lng
        this.map.flyTo({
          center: [coords.lng, coords.lat],
          essential: true,
          duration: 1000,
        });
      }
    },
    requestHeadingPermission() {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        window.DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response == "granted") {
              window.addEventListener(
                "deviceorientation",
                this.handleDeviceOrientation,
                true
              );
              // this.$store.commit("isHeadingPermission", true);
              this.isHeadingPermission = true;
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener(
          "deviceorientationabsolute",
          this.handleDeviceOrientation,
          true
        );
        // this.$store.commit("setIsHeadingPermission", true);
        this.isHeadingPermission = true;
      }
    },
    handleDeviceOrientation(event) {
      let compassdir;

      if (event.webkitCompassHeading) {
        // For Apple devices
        compassdir = event.webkitCompassHeading;
      } else if (typeof event.alpha === "number") {
        // For non-Apple devices
        compassdir = event.alpha;
      }

      compassdir -= 80;
      compassdir = compassdir % 360;

      if (this.modelReference && typeof compassdir === "number") {
        this.modelReference.setRotation({ x: 0, y: 0, z: -compassdir }); // Adjust the rotation based on the heading
      }
    },
    camera() {
      console.log(this.quests)
        const uLat = this.uLat; // user lattitude
        const uLon = this.uLon; // user longtitude

        if (this.quests && this.quests.length > 0) {
            let nearestQuest = this.quests[0]; // Assume first quest is the nearest
            let minDistance = this.haversineDistance(uLat, uLon, nearestQuest.location.lat, nearestQuest.location.lon);

            // Loop through the quests to find the nearest one
            for (let i = 1; i < this.quests.length; i++) {
                const currentQuest = this.quests[i];
                const distance = this.haversineDistance(uLat, uLon, currentQuest.location.lat, currentQuest.location.lon);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestQuest = currentQuest;
                }
            }

            // You now have the nearest quest in 'nearestQuest' variable
            console.log(nearestQuest);
            this.$router.push('/camera?user=' + this.userId + "&quest=" + nearestQuest.id)
            // window.location.href = '/camera?user=' + this.userId + "&quest=" + nearestQuest.id;

            // If you want to redirect to a specific URL with the user and quest details
            // window.location.href = '/?user=' + this.userId + "&quest=" + nearestQuest.id;

        } else {
            alert('No quests at this time');
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
  },
};
</script>

<style>
.map-container {
  width: 100vw;
  height: 100vh;
}

#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
.mapboxgl-ctrl-bottom-left {
  display: none;
}
.mapboxgl-ctrl-bottom-right {
  display: none;
}
</style>

