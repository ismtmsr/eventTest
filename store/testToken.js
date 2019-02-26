import TestToken from '~/contracts/TestToken'
import PassportStub from '~/contracts/PassportStub'
import web3Abi from 'web3-eth-abi'

export const state = () => ({
  tokenAddress: '0x734729A56021fEFa794a57BDAc72bfF55CFbb5B7'
})

export const getters = {
  tokenAddress (state) {
    return state.tokenAddress
  }
}

export const mutations = {
  setTransferEvent (state, event) {
    state.transferEvent = event
  }
}

export const actions = {
  async getTokenBalance (ctx) {
    const web3 = await ctx.dispatch('web3/web3', {}, {root: true})
    console.log('web3:', web3)
    console.log('accountAddress:', ctx.rootState.web3.accountAddress)
    const testToken = web3.eth
      .contract(TestToken.abi).at(tokenAddress)

    return await testToken.balanceOf(
      ctx.rootState.web3.accountAddress
    )
  },
  async transfer (ctx, params) {
    const transferMethod = TestToken.abi.find(method => {
      return method.name === 'transfer'
    })

    const transferMethodTransactionData = web3Abi.encodeFunctionCall(
      transferMethod,
      [params.to, ctx.rootState.web3.toBN(params.value)]
    )

    const estimateGas = await ctx.rootState.web3.eth.estimateGas({
			from: ctx.rootState.accountAddress,
			to: tokenAddress,
			data: transferMethodTransactionData
		})
  },

  async watchTransferEvent (ctx) {
    console.debug('watchTransferEvent start')
    const web3 = await ctx.dispatch('web3/web3', {}, {root: true})

    const testToken = web3.eth
      .contract(TestToken.abi).at(this.tokenAddress)

    const transfer = testToken.Transfer()

    transfer.watch((err, result) => {
      if (err) {
        console.error('watching transfer event failed. err:', err)
      } else {
        ctx.dispatch(
          'event/pushLog',
          result,
          {root: true}
        )
        // ERC20トークンのTransferをトリガーにしてPassportStubのpay実行
        // payメソッドが実際の支払いの処理
        console.debug(
          'passport address:',
          ctx.rootState.passportStub.passportStubAddress
        )
        const requestFrom = result.args.from
        const requestTo = result.args.to
        console.debug('receipt to address:', requestTo)

        if (ctx.rootState.passportStub.passportStubAddress.toLowerCase() !=
          requestTo.toLowerCase()
        ) {
          // transfer対象がPassportStubコントラクトではなかった
          console.debug('transfer captured. but to addres is not PassportStub contract address')
          return
        }

        console.debug('transfer captured. from:', requestFrom)

        const passportStub = web3.eth
          .contract(PassportStub.abi)
          .at(ctx.rootState.passportStub.passportStubAddress)

        passportStub.pay(
          requestTo, /* とりあえずPassportStub宛 */
          0,
          {
            from: requestFrom,
            gas: 5000000
          },
          (err, receipt) => {
            if (err) {
              console.error(err)
            } else {
              console.debug('pay succeed. receipt:', receipt)
            }
          }
        )
      }
    })

  }
}