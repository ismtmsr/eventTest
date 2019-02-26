# nuxt-example

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## 作業覚書

### vuetify

```bash
npm install @nuxtjs/vuetify
npm install web3@0.20.7
npm install web3-eth-abi
npm install vue-notifications
```

```nuxt.config.js
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    theme: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c'
    }
  },
  plugins: ['~/plugins/vue-notification'],
```

