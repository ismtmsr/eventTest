<template>
  <v-app>
    <v-toolbar dark color="#ffa500" dense fixed>
      <v-btn icon to='/'>
        <v-icon>home</v-icon>
      </v-btn>

      <v-toolbar-title
        :style="$vuetify.breakpoint.width > 1264 && 'width: 500px'"
        class="ml-0 pl-1 white--text text-xs-left body-1"
        :class="$vuetify.breakpoint.width <= 1264 && 'pr-3'"
      > DataWallet EventTest
      </v-toolbar-title>

      <v-spacer/>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-tooltip bottom>
          <v-btn
            slot="activator"
            icon
            to="/appconfig"
          >
            <v-icon>settings_applications</v-icon>
          </v-btn>
          <div>{{selectedNetwork}}</div>
          <div>{{accountAddress}}</div>
        </v-tooltip>
      </v-toolbar-items>
    </v-toolbar>

    <v-container grid-list-md text-md-center>
      <!-- <v-layout justify-center>
        <v-card flat color="transparent">
          <nuxt/>
        </v-card>
      </v-layout>

      <v-layout justify-center align-end>
        <v-card flat color="transparent">
          <watch-event/>
        </v-card>
      </v-layout> -->

      <v-layout row wrap>
        <v-flex xs6 offset-xs3>
          <v-card flat color="transparent">
            <nuxt/>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-card flat color="transparent">
            <event-log/>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
/**
 * 上部ツールバー表示レイアウト
 * @module layouts/withToolbar
 */
import eventLog from '~/components/eventLog'
import {mapActions, mapGetters, mapMutations} from 'vuex'

export default {
  name :'withToolbar',
  components: {
    eventLog
  },
  computed: {
    ...mapGetters({
      selectedNetwork: 'web3/selectedNetwork',
      accountAddress: 'web3/accountAddress'
    })
  },

}
</script>

<style>
.container {
  margin-top: 50px;
  /* min-height: 100vh; */
  /* display: flex; */
  /* justify-content: center; */
  /* align-items: center;
  text-align: center; */
}
</style>

