<template>
  <div id="app-config">
    <v-form ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-select
        v-model="uri"
        :items="networks"
        :rules="[v => !!v || 'network is required']"
        label="ethereum network"
        required
      ></v-select>
      <v-select
        v-model="selectedAccountAddress"
        :items="accounts"
        :rules="[v => !!v || 'account address is required']"
        label="account address"
        required
      >
      </v-select>

      <v-card flat color="transparent">
        <p class="text-xs-right">
          {{balance}} eth.
        </p>
      </v-card>
      <v-card flat color="transparent">
        <p class="text-xs-right">
          {{tokenName}}残高: {{tokenBalance}} {{tokenSymbol}}.
        </p>
      </v-card>
      <v-btn
        :disabled="!valid"
        color="success"
        @click="ok"
      >
        OK
      </v-btn>
      <v-btn
        color="gray"
        @click="cancel"
      >
        Cancel
      </v-btn>
    </v-form>

  </div>
</template>

<script>
/**
 * データウォレット設定画面
 * @module pages/appConfig
 */

import {mapActions, mapGetters, mapMutations} from 'vuex'
import TestToken from '~/contracts/TestToken'
import web3Abi from 'web3-eth-abi'
import Web3 from 'web3'

export default {
  layout: 'withToolbar',
  data: () => ({
    valid: true,
    uri: '',
    selectedAccountAddress: '',
    balance: null,
    tokenName: '',
    tokenSymbol: '',
    tokenBalance: null
  }),
  created () {
    this.uri = this.selectedNetwork
    this.selectedAccountAddress = this.accountAddress
  },
  computed: {
    ...mapGetters({
      accounts: 'web3/accounts',
      accountAddress: 'web3/accountAddress',
      networks: 'web3/networks',
      selectedNetwork: 'web3/selectedNetwork',
      tokenAddress: 'testToken/tokenAddress'
    })
  },
  watch: {
    selectedAccountAddress () {
      this.balance = null
      this.tokenBalance = null
      if (!this.selectedAccountAddress.length ||
        !this.uri.length) return

      const web3 = new Web3(new Web3.providers.HttpProvider(
        this.uri
      ))

      web3.eth.getBalance(
        this.selectedAccountAddress,
        (err, balance) => {
          if (err) {
            console.debug(err)
          } else {
            this.balance = web3.fromWei(balance)
          }
      })

      const testToken = web3.eth
        .contract(TestToken.abi).at(this.tokenAddress)

      console.debug('name start')

      testToken.name((err, name) => {
        if (err) {
          console.error(err)
        } else {
          this.tokenName = name
        }
      })

      console.debug('symbol start')

      testToken.symbol((err, symbol) => {
        if (err) {
          console.error(err)
        } else {
          this.tokenSymbol = symbol
        }
      })

      console.debug('balanceOf start')
      try{
        testToken.balanceOf(
          this.selectedAccountAddress,
          (err, balance) => {
            if (err) {
              console.error(err)
            } else {
              try{
                this.tokenBalance = web3.fromWei(balance)
              } catch (err) {
                this.$notify({
                  group: 'tokenBalance',
                  type: 'error',
                  title: 'get token balance failed. unexpected error has occured.',
                  text: err
                })
              }
            }
        })
      } catch (err){
        this.$notify({
          group: 'tokenBalance',
          type: 'error',
          title: 'get token balance failed. unexpected error has occured.',
          text: err
        })
      }

    }
  },
  methods: {
    ...mapActions({
      selectNetwork: 'web3/selectNetwork',
      watchTransferEvent: 'testToken/watchTransferEvent',
      watchPayEvent: 'passportStub/watchPayEvent'
    }),
    ...mapMutations({
      selectAccount: 'web3/selectAccount'
    }),

    ok () {
      if (this.$refs.form.validate()) {
        this.selectNetwork(this.uri)
        this.selectAccount(this.selectedAccountAddress)
        this.watchTransferEvent()
        this.watchPayEvent()

        this.$router.go(-1)
      }
    },

    cancel () {
      this.$router.go(-1)
    }
  }
}
</script>
