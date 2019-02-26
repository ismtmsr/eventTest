export const state = () => ({
  receipts: {},
  logs: []
})

export const getters = {
  logs (state) {
    return state.logs
  }
}

export const mutations = {
  setReceipts (state, receipts) {
    state.receipts = receipts
    state.logs =
      Object.keys(state.receipts).map(key => state.receipts[key])
  },
  clearLog (state) {
    state.logs = {}
  }
}

export const actions = {
  pushLog (ctx, receipt) {
    const receipts = ctx.state.receipts

    //console.debug('receipt:', receipt)
    receipt['timeStamp'] = Date.now()
    //console.debug('logs:', logs)
    receipts[receipt.transactionHash] = receipt
    //console.debug('logs:', logs)
    ctx.commit('setReceipts', receipts)
  }
}