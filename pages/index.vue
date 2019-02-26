<template>
  <div id="index">
    <v-btn
      to='transfer'
    >
      <span>Transfer Token</span>
    </v-btn>

    <v-btn
      to='appconfig'
    >
      <span>App Config</span>
    </v-btn>
  </div>

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  layout: 'withToolbar',
  computed: {
    ...mapGetters({
      accounts: 'web3/accounts',
      networks: 'web3/networks'

    })
  },
  mounted () {
    if(this.networks.length){
      // ganache
      this.selectNetwork(this.networks[1])
    }
    if (this.accounts.length){
      this.selectAccount(this.accounts[0])
    }

  },
  methods: {
    ...mapActions({
      selectNetwork: 'web3/selectNetwork',
    }),
    ...mapMutations({
      selectAccount: 'web3/selectAccount'
    }),
    printNetworks() {
      console.log('networks:', this.networks)
    }
  }
}
</script>

<style>

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

