<template>
  <div class="watch-event-table">
    <v-data-table
      :headers="headers"
      :items="logs"
      item-key="timeStamp"
      :pagination="pagination"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td class="text-xs-left">{{props.item.timeStamp}}</td>
          <td class="text-xs-left">{{props.item.event}}</td>

          <td class="text-xs-left">{{props.item.args.from}}</td>
          <td class="text-xs-left">{{props.item.args.to}}</td>
          <td class="text-xs-left">{{props.item.args.value}}</td>
        </tr>
      </template>
    </v-data-table>
  </div>

</template>

<script>
/**
 * イベントログコンポーネント
 * @module components/eventLog
 */

import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'eventLog',
  data: () => ({
    headers: [
      {text: "time stamp", value: 'timeStamp'},
      {text: "event", value: "event"},
      {text: "from", value: "from"},
      {text: "to", value: "to"},
      {text: "value", value: "value"},
    ],
    pagination: {
      sortBy: 'timeStamp',
      descending: true,
      rowsPerPage: -1
    }
  }),
  computed: {
    ...mapGetters({
      logs: 'event/logs',
      tokenAddress: 'testToken/tokenAddress'
    })
  },
  methods: {
    ...mapMutations({
      pushLog: 'event/pushLog',
      clearLog: 'event/clearLog',
    })
  }
}
</script>
