<template>
  <div class="flex flex-col h-screen bg-custom-gray p-4">
    <!-- Welcome Heading -->
    <h1 class="text-white text-2xl font-bold mb-4">Quest Creation</h1>

    <!-- Text Field: Business Name -->
    <label for="questName" class="text-white mb-2 font-semibold"
      >Enter a quest name</label
    >
    <div
      class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden"
    >
      <input
        id="questName"
        v-model="questName"
        :class="[
          'flex-grow',
          'px-4',
          'p-1',
          'appearance-none',
          'outline-none',
          'bg-transparent',
          'text-white',
          'placeholder-opacity-30',
        ]"
        @input="handleInput('questName')"
        type="text"
        placeholder="Quest name"
      />
    </div>

    <label for="linkName" class="text-white mb-2 font-semibold"
      >Enter a link to 3D Model</label
    >
    <div
      class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden"
    >
      <input
        id="linkName"
        v-model="linkName"
        :class="[
          'flex-grow',
          'px-4',
          'p-1',
          'appearance-none',
          'outline-none',
          'bg-transparent',
          'text-white',
          'placeholder-opacity-30',
        ]"
        @input="handleInput('linkName')"
        type="text"
        placeholder="Enter a link in https:// format"
      />
    </div>

    <!-- Text Field: Address -->
    <label for="location" class="text-white mb-2 font-semibold">Location</label>
    <div
      class="flex p-2 items-center border border-opacity-30 border-white rounded-full w-full mb-4 overflow-hidden"
    >
      <input
        id="location"
        v-model="location"
        @click="openMap"
        :class="[
          'flex-grow',
          'px-4',
          'p-1',
          'appearance-none',
          'outline-none',
          'bg-transparent',
          'text-white',
          'placeholder-opacity-30',
        ]"
        @input="handleInput('location')"
        type="text"
        placeholder="Pick a location"
      />
    </div>

    <!-- Map Modal -->
    <div
      style="visibility: hidden"
      id="mapModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="bg-white rounded-lg p-4 relative"
        style="width: 100%; height: 80%"
      >
        <div class="map-container" ref="mapContainer">
          <div class="map-center-marker"></div>
        </div>
        <button
          @click="confirmLocation"
          class="absolute bottom-0 right-0 mb-4 mr-4"
        >
          Add
        </button>
        <button
          @click="cancelLocation"
          class="absolute bottom-0 left-0 mb-4 ml-4"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Button: Complete -->
    <button
      @click="completeQuest"
      style="background: linear-gradient(to right, rgb(240, 237, 139), rgb(92, 191, 230));"
      class="mb-3 mt-auto w-full font-semibold text-white rounded-full p-3"
    >
      Complete
    </button>
  </div>
</template>


<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

export default {
  layout: "auth",
  middleware: "auth",
  data() {
    return {
      questName: "",
      location: "",
      email: "",
      industry: "",
      linkName: "",
      showMap: false,
      selectedLocation: null,
      map: null,
      numLocation: ""
    };
  },
  async mounted() {
    this.$nextTick(async () => {
    if (process.client) {
      let center = [148.9819, -35.39847]; // default to New York

      try {
        const userLocation = await this.getUserLocation();
        center = [userLocation.lng, userLocation.lat];
      } catch (error) {
        console.error("Error getting user's location:", error);
      }

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

      map.on("style.load", () => {
        map.on("click", (event) => {
          this.selectedLocation = [event.lngLat.lng, event.lngLat.lat];
        });

        this.map.on("moveend", () => {
          const center = this.map.getCenter();
          this.selectedLocation = [center.lng, center.lat];
          this.location = `Lon: ${center.lng.toFixed(
            4
          )}, Lat: ${center.lat.toFixed(4)}`;
        });
      });

      this.map = map;
    }
    })
  },
beforeDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  },
  methods: {
    openMap() {
      this.showMap = true;
      document.getElementById('mapModal').style.visibility = 'visible'
      this.$nextTick(() => {
        if (this.map) {
          this.map.resize(); // This forces the map to adjust to its container size.
        }
      });
    },
    confirmLocation() {
      if (this.selectedLocation) {
        this.location = `lon: ${this.selectedLocation[0].toFixed(4)}, lat: ${this.selectedLocation[1].toFixed(4)}`;
        this.numLocation = {
            lon: this.selectedLocation[0],
            lat: this.selectedLocation[1]
        }
        console.log(this.location);
        this.showMap = false;
        document.getElementById('mapModal').style.visibility = 'hidden'
      } else {
        alert('Please, select a location')
      }
    },
    cancelLocation() {
      this.showMap = false;
      document.getElementById('mapModal').style.visibility = 'hidden'
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
    handleInput(field) {
      // Handle input for individual fields if needed
      console.log(`${field} changed to ${this[field]}`);
    },
    completeQuest() {
      if (this.questName && this.location && this.linkName) {
        var quest = {
            "name": this.questName,
            "link": this.linkName,
            "location": this.numLocation
        }
        this.$store.commit("addQuest", quest);
        console.log(this.$store.state.quests)

        // Redirect to home
        this.$router.push("/");
      } else {
        alert("Please, complete all fields");
      }
    },
  },
};
</script>

<style>
.map-center-marker {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.map-center-marker::before,
.map-center-marker::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 100%;
  background-color: red;
  transform-origin: center;
}

.map-center-marker::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.map-center-marker::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.bg-custom-gray {
  background-color: rgb(30, 30, 30);
}
.map-container {
  width: 100%;
  height: 90%;
}
.mapboxgl-ctrl-bottom-left {
  display: none;
}
.mapboxgl-ctrl-bottom-right {
  display: none;
  visibility: hidden;
}
.mapboxgl-ctrl-logo {
  display: none;
}
</style>
