<template>
  <div id="transfer">
    <notifications group="tx" />
    <v-form ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-select
        v-model="coinBase"
        :items="accounts"
        :rules="[v => !!v || 'coinbase address is required']"
        label="coinbase address"
        required
        disabled
      />
      <v-text-field
        v-model="balance"
        label="token balance (TT)"
        reverse
        disabled
      />
      <v-select
        v-model="toAddress"
        :items="accounts"
        :rules="[v => !!v || 'to address is required']"
        label="to address"
        required
      />

      <v-text-field
        v-model="value"
        reverse
        label="value"
        type="number"
        :rules="[v => !!v || 'value is required']"
        required
      />

      <v-text-field
        v-model="password"
        label="password"
      />

      <v-btn
        :disabled="!valid"
        color="success"
        @click="send"
      >
        Send
      </v-btn>

      <v-btn
        color="gray"
        @click="clear"
      >
        Clear
      </v-btn>
    </v-form>
  </div>
</template>

<script>
/**
 * トークン送付画面
 * @module pages/transfer
 */

import {mapActions, mapGetters, mapMutations} from 'vuex'
import TestToken from '~/contracts/TestToken'
import web3Abi from 'web3-eth-abi'

export default {
  layout: 'withToolbar',
  name: 'transfer',
  data: () => ({
    valid: true,
    coinBase: null,
    toAddress: null,
    balance: null,
    password: null,
    value: null
  }),
  computed: {
    ...mapGetters({
      accounts: 'web3/accounts',
      accountAddress: 'web3/accountAddress',
      tokenAddress: 'testToken/tokenAddress'
    })
  },
  mounted () {
    this.coinBase = this.accountAddress
    this.getTokenBalance()
  },
  methods: {
    ...mapActions({
      web3: 'web3/web3'
    }),
    ...mapMutations({
      pushLog: 'event/pushLog'
    }),
    async getTokenBalance () {
      this.balance = null

      const web3 = await this.web3()

      try {
        const testToken = web3.eth
          .contract(TestToken.abi).at(this.tokenAddress)

        testToken.balanceOf(
          this.coinBase,
          (err, balance) => {
            if (err) {
              // console.error(err)
              this.$notify({
                group: 'getBalance',
                type: 'error',
                title: 'get balance failed.',
                text: err
              })
            }
            if (!err) this.balance = web3.fromWei(balance)
        })
      } catch (err) {
        this.$notify({
          group: 'getBalance',
          type: 'error',
          title: 'get balance failed. unexpected error has occured.',
          text: err
        })
      }
    },
    async send () {
      if(this.$refs.form.validate()){
        const web3 = await this.web3()

        const testToken = web3.eth
          .contract(TestToken.abi).at(this.tokenAddress)

        testToken.transfer(
          this.toAddress,
          web3.toWei(this.value),
          {
            from: this.coinBase,
            gas: 5000000
          },
          (err, receipt) => {
            if (err) {
              this.$notify({
                group: 'tx',
                type: 'error',
                title: 'token transfer failed.'
              })
            }else{
              this.getTokenBalance()
              // this.pushLog(receipt)

              this.$notify({
                group: 'tx',
                title: 'token transfered',
              })
            }
          }
        )
      }
    },
    clear() {
      this.valid = true
      this.toAddress = null
      this.value = null
      this.password = null
    }
  }
}
</script>

