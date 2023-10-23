<template>
  <div class="map-container" ref="mapContainer"></div>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

export default {
  name: "IndexPage",
  middleware: "auth",
  data() {
    return {
      map: null,
    };
  },
  mounted() {
    if (process.client) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoiZG9wbGVyMTY4IiwiYSI6ImNrMWsyZmxzNDAyaGgzb28zdTVyZzh3ejIifQ.rSb8A8Lm1MxVk7IMK9n40Q";
      const map = new mapboxgl.Map({
        container: this.$refs.mapContainer, // container ID
        center: [-73.935242, 40.730610], // starting position [lng, lat]
        zoom: 15, // starting zoom
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      map.on("style.load", () => {
        map.setConfigProperty("basemap", "day", "dusk");
      });

      this.map = map;
    }
  },
  unmounted() {
    this.map.remove();
    this.map = null;
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
</style>

