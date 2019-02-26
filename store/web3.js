import Web3 from 'web3'

export const state = () => ({
  /** truffle-config.js */
  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    ganache: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    kovan: {
      host: 'demo.kaula.jp',
      port: 9545,
      network_id: '42'
    }
  },
  selectedNetwork: '',
  accounts: [
    '0x1e0bb44d12f92D4c6f529a697c5fa5eB07ad7a48',
    '0xbF84Fb76809860BC08ec9c3C56bD429cc0180ee7',
    '0xB40500dB1986F97d1eABF67B3f146e181733aAA3',
    '0xd4810496c7327F3c49C09e4a0e3c8c6C6E514C6B',
    '0x1C0e707C7A4D8eE99E60F11DCC086967F7a6031a'
  ],
  accountAddress: ''
})

export const getters = {
  networks (state) {
    return Object.keys(state.networks).map(key => {
      return `http://${state.networks[key]['host']}:${state.networks[key]['port']}`
    })
  },
  selectedNetwork (state) {
    return state.selectedNetwork
  },
  accounts (state) {
    return state.accounts
  },
  accountAddress (state) {
    return state.accountAddress
  }
}

export const mutations = {
  setProvider (state, {uri}) {
    state.web3 = new Web3.providers.HttpProvider(uri)
  },
  selectNetwork (state, network) {
    state.selectedNetwork = network
  },
  selectAccount (state, address) {
    state.accountAddress = address
  }
}

export const actions = {
  /**
   * 接続先変更
   * @param {*} param0
   * @param {*} uri プロバイダuri
   */
  selectNetwork (ctx, uri) {
    const web3 = new Web3(new Web3.providers.HttpProvider(
      this.uri
    ))
    if (web3){
      ctx.commit('selectNetwork', uri)
    }
  },
  web3 (ctx) {
    const web3 = new Web3(new Web3.providers.HttpProvider(
      ctx.getters.selectedNetwork
    ))
    return web3
  }

}
