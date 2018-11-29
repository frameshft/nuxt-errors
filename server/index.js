
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const MobileDetect = require('mobile-detect')
const app = express()
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

app.set('port', port)

// Import and Set Nuxt.js options
const mobileConfig = require('../mobile/nuxt.config.js')
const desktopConfig = require('../desktop/nuxt.config.js')

let nuxtMobile = new Nuxt(mobileConfig)
let nuxtDesktop = new Nuxt(desktopConfig)

nuxtMobile.dev = !(process.env.NODE_ENV === 'production')
nuxtDesktop.dev = !(process.env.NODE_ENV === 'production')
console.log(nuxtDesktop.dev)
console.log(nuxtMobile.dev)

if (nuxtMobile.dev) {
  new Builder(nuxtMobile).build()
}

if (nuxtDesktop.dev) {
  new Builder(nuxtDesktop).build()
}

app.use((req, res, next) => {
  const md = new MobileDetect(req.headers['user-agent']);
  console.log(req.headers['user-agent'])
  if (md.mobile()) {
    nuxtMobile.render(req, res);
  } else {
    nuxtDesktop.render(req, res);
  }
})

// Listen the server
app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})
