import PassportStub from '~/contracts/PassportStub'
import web3Abi from 'web3-eth-abi'

export const state = () => ({
  passportStubAddress: '0x8ed5Eb1195152281EC58F8342778BD7A99d4ed68'
})

export const getters = {
  passportStubAddress (state) {
    return state.passportStubAddress
  }
}

export const actions = {
  async watchPayEvent (ctx) {
    console.debug('watchPayEvent start')
    const web3 = await ctx.dispatch('web3/web3', {}, { root: true })

    const passportStub = web3.eth
      .contract(PassportStub.abi).at(this.passportStubAddress)

    const pay = passportStub.Pay()

    pay.watch((err, result) => {
      if (err) {
        console.error('watching pay event failed. err:', err)
      } else {
        ctx.dispatch(
          'event/pushLog',
          result,
          { root: true }
        )
      }
    })
  }
}
