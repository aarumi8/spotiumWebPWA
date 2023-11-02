<template>
<div>
  <div id="canvas-container"></div>
  <button id="animate-button" @click="animateModel">Animate GLB with FBX</button>
</div>
</template>

<script>
// Importing the required modules
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

export default {
  data() {
    return {
      scene: null,
      renderer: null,
      camera: null,
      model: null,
      mixer: null,
      clock: new THREE.Clock(),
      avatarUrl: './model.glb', // Path to your GLB model
      animUrl: './animation.fbx' // Path to your FBX animation file
    }
  },
  mounted() {
    this.initThree()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    initThree() {
      this.scene = new THREE.Scene()
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.$el.appendChild(this.renderer.domElement)

      // Lights
      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
      this.scene.add(ambientLight)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, 0).normalize()
      this.scene.add(directionalLight)

      // GLTF model
      const gltfLoader = new GLTFLoader()
      gltfLoader.load(this.avatarUrl, (gltf) => {
        this.model = gltf.scene
        this.scene.add(this.model)
        this.camera.position.z = 5
        this.animate()
      })
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },
    animate() {
      requestAnimationFrame(this.animate)
      if (this.mixer) this.mixer.update(this.clock.getDelta())
      this.renderer.render(this.scene, this.camera)
    },
    animateModel() {
      // FBX Loader for the animation
      const fbxLoader = new FBXLoader()
      fbxLoader.load(this.animUrl, (fbx) => {
        this.mixer = new THREE.AnimationMixer(this.model)
        const action = this.mixer.clipAction(fbx.animations[0])
        action.play()
      })
    }
  }
}
</script>

<style>
#canvas-container {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>
