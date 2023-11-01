export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  server: {
    host: '0.0.0.0'  // Default: localhost
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'spotiumPWA',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: 'https://aframe.io/releases/1.3.0/aframe.min.js', body: false },
      { src: 'https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js', body: false },
      { src: 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js', body: false }
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/aframe.js'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // 'nuxt-helmet'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // baseURL: 'http://localhost:8000',
    baseURL: 'https://tree-server-api900.online'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    workbox: {
      importScripts: [
        '/workbox-sw.js'
      ]
    },
    manifest: {
      name: 'Spotium',
      lang: 'en'
    }
  },

  // helmet: {
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'", 'http:', 'https:'],
  //       blockAllMixedContent: [],
  //       fontSrc: ["'self'", 'https:', 'data:'],
  //       frameAncestors: ["'self'"],
  //       imgSrc: ["'self'", 'data:', 'blob:'],
  //       objectSrc: ['none'],
  //       scriptSrc: ["'self'", 'https://api.mapbox.com', 'https://cdn.jsdelivr.net', "'unsafe-inline'", "'unsafe-eval'"],
  //       scriptSrcElem: ['https:', 'http:', "'unsafe-inline'"],
  //       scriptSrcAttr: ["'self'", 'https://api.mapbox.com', 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
  //       styleSrc: ["'self'", 'https://api.mapbox.com', 'https://fonts.googleapis.com', "'unsafe-inline'"],
  //       workerSrc: ["'self'", 'blob:'],
  //     },

  //     reportOnly: false, // Set to true if you want to only report violations without enforcing the CSP.
  //   },
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
