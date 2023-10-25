<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Threebox } from "threebox-plugin";

export default {
  name: "IndexPage",
  middleware: "auth",
  data() {
    return {
      map: null,
      watchId: null,
      tb: null,
    };
  },
  async mounted() {
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

      window.tb = new Threebox(map, map.getCanvas().getContext("webgl"), {
        defaultLights: true,
      });

      map.on("style.load", () => {
        map.addLayer({
          id: "custom-threebox-model",
          type: "custom",
          renderingMode: "3d",
          onAdd: () => {
            const scale = 50;
            const options = {
              obj: "https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb?quality=high",
              type: "glb",
              scale: { x: scale, y: scale, z: scale },
              units: "meters",
              rotation: { x: 90, y: -90, z: 0 },
            };

            window.tb.loadObj(options, (model) => {
              model.setCoords(center);
              model.setRotation({ x: 0, y: 0, z: 0 });
              window.tb.add(model);
            });
          },

          render: function (gl, matrix) {
            gl.clear(gl.DEPTH_BUFFER_BIT);
            window.tb.update();
          },
        });

        // map.moveLayer('custom-threebox-model');
      });

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
      if (this.map && this.map.getSource("user-location")) {
        const userLocationData = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
        };
        this.map.getSource("user-location").setData(userLocationData);
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

