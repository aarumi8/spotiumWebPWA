<template>
  <div class="relative">
    <button id='permBtn' v-if="!isHeadingPermission" @click="requestHeadingPermission">
      Click here to allow heading permission
    </button>
    <div class="map-container" ref="mapContainer"></div>

    <!-- Button container -->
    <div class="absolute bottom-0 left-0 right-0 flex justify-between p-4 mb-4">
      <!-- Left button with image -->
      <button @click='goToQuest' id='businessBtn' class="flex-shrink-0">
        <img src="add-quest-pic.png" alt="Left Button" class="w-12 h-12 object-cover">
      </button>

      <!-- Center button with image -->
      <button>
        <img src="ar-btn-pic.png" alt="Center Button" class="w-16 h-16 object-cover mx-auto">
      </button>

      <!-- Right button with image -->
      <button class="flex-shrink-0">
        <img src="profile-pic.png" alt="Right Button" class="w-12 h-12 object-cover">
      </button>
    </div>
  </div>
</template>


<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { Threebox } from "threebox-plugin";

export default {
  name: "IndexPage",
  middleware: "auth",
  data() {
    return {
      map: null,
      watchId: null,
      tb: null,
      currentHeading: 0,
      isHeadingPermission: false,
      isBusiness: this.$store.state.isBusiness,
      quests: this.$store.state.quests
    };
  },
  async mounted() {
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
      }

      this.requestHeadingPermission()

      mapboxgl.accessToken =
        "pk.eyJ1IjoiZG9wbGVyMTY4IiwiYSI6ImNrMWsyZmxzNDAyaGgzb28zdTVyZzh3ejIifQ.rSb8A8Lm1MxVk7IMK9n40Q";
      const map = new mapboxgl.Map({
        container: this.$refs.mapContainer,
        center: center,
        zoom: 16,
        pitch: 45,
        bearing: -30,
        antialias: true,
        style: "mapbox://styles/dopler168/clo4vezz400k201qxci7ab8jy",
      });

      window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
        defaultLights: true,
      });

      map.on("style.load", () => {
        console.log(map.getStyle().layers)
        map.addLayer({
          id: "custom-threebox-model",
          type: "custom",
          renderingMode: "3d",
          onAdd: () => {
            const scale = 50;
            const options = {
              obj: this.$store.state.avatarLink,
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

      //         var q = {
      //   name: "d",
      //   link: "https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb",
      //   location: {lon: 27.561063, lat: 53.917392 } 
      // }
      // this.$store.commit("addQuest", q);

      //   if(this.quests) {
      //     console.log('we have quests')
      //     for(let i = 0; i < this.quests.length; i++) {
      //       console.log(this.quests[i])
      //       map.addLayer({
      //         id: "quest-" + i,
      //         type: "custom",
      //         renderingMode: "3d",
      //         onAdd: () => {
      //           const scale = 30;
      //           const options = {
      //             obj: this.quests[i].link,
      //             type: "glb",
      //             scale: { x: scale, y: scale, z: scale },
      //             units: "meters",
      //             rotation: { x: 90, y: -90, z: 0 },
      //             adjustment: { x: 0, y: 0, z: 0 },
      //             anchor: 'center'
      //           };
      //           var lon = this.quests[i].location.lon
      //           var lat = this.quests[i].location.lat

      //           window.tb.loadObj(options, (model) => {
      //             model.setCoords(lon, lat);
      //             model.setRotation({ x: 0, y: 0, z: 0 });
      //             window.tb.add(model);
      //           });
      //         },

      //         render: function (gl, matrix) {
      //           gl.clear(gl.DEPTH_BUFFER_BIT);
      //           window.tb.update();
      //         },
      //       });
      //     }
      //   }

        // map.moveLayer('custom-threebox-model');
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
    goToQuest() {
      this.$router.push('/create-quest');
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
              this.$store.commit("isHeadingPermission", true);
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
        this.$store.commit("setIsHeadingPermission", true);
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

