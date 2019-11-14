<template>
  <div>
    <q-banner dense class="text-vgrey bg-vdarkgrey q-pa-md">
      <div class="text-subtitle2 text-uppercase">Widget is under development. May not work properly</div>
    </q-banner>
    <q-banner dense inline-actions class="text-vgrey bg-vdark q-pa-md text-subtitle2 text-uppercase">
      Node API Endpoints
      <template v-slot:action>
        <q-badge color="vgold" class="text-vdark q-mx-sm">Total endpoints: {{ endpoints.length }}</q-badge>
      </template>
    </q-banner>
    <q-linear-progress dark indeterminate track-color="vgrey" color="vgreen" v-if="endpoints.length === 0" />
    <q-table dense square :data="endpoints" :columns="endpointsColumns" row-key="name" virtual-scroll :pagination.sync="endpointsPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="account" :props="props">
            <q-btn dense flat size="sm" class="code" @click="$utils.openExternal('https://bloks.io/account/' + props.row.account) " :label="props.row.account" :disabled="props.row.account == 'No account found'" />
          </q-td>
          <q-td key="rank" :props="props" class>{{ props.row.rank }}</q-td>
          <q-td key="url" :props="props" class="code">{{ props.row.url }}</q-td>
          <q-td key="alive" :props="props" class="code">
            <span class="text-weight-bolder text-uppercase" :class="props.row.alive ? 'text-vgreen' : 'text-red'">{{ props.row.alive ? 'ok' : 'fail' }}</span>
          </q-td>
          <q-td key="use" :props="props">
            <div v-if="props.row.url && props.row.alive">
              <q-btn outline dense size="xs" class="q-px-md" rounded color="vgrey" v-on:click="useEndpoint(props.row.url)">Use</q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'NodeApiWidget',
  data () {
    return {
      endpoints: [],
      endpointsColumns: [
        { name: 'account', align: 'left', label: 'Account', field: 'account', sortable: true },
        { name: 'rank', align: 'left', label: 'Rank', field: 'rank', sortable: true },
        { name: 'url', align: 'left', label: 'URL', field: 'url' },
        { name: 'alive', align: 'center', label: 'Alive', field: 'alive' },
        { name: 'use', align: 'center', label: 'Use', field: 'use' }
      ],
      endpointsPagination: {
        rowsPerPage: 0,
        sortBy: 'rank',
        descending: false
      }
    }
  },
  mounted () {
    this.getEndpoints()
    this.set0 = setTimeout(() => this.checkEndpoints(), 2000)
    this.set1 = setInterval(() => this.getEndpoints(), 300000)
    this.set2 = setInterval(() => this.checkEndpoints(), 10000)
  },
  computed: {},
  beforeDestroy () {
    clearInterval(this.set1)
    clearInterval(this.set2)
  },
  watch: {},
  methods: {
    async checkEndpoints () {
      this.endpoints.forEach(item => {
        this.$utils.checkNodeApi(item.url).then(response => {
          item.alive = response
        })
      })
    },
    async getEndpoints () {
      await this.getEndpointURLs()
      const ranks = await this.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
      for (var id in this.endpoints) {
        this.getEndpointsData(id, this.endpoints[id].key, ranks)
      }
    },
    async getEndpointURLs () {
      return new Promise(resolve => {
        this.$http
          .get(this.$configStore.get('node_api') + '/getConnectedIPs')
          .then(result => {
            for (var key in result.data) {
              if (result.data[key].includes('EOS')) {
                this.endpoints.push({
                  url: 'http://' + key.split(':')[0] + ':8000',
                  key: result.data[key].trim(),
                  account: '',
                  rank: '',
                  alive: false
                })
              }
            }
            this.endpoints = this.$utils.getUnique(this.endpoints, 'key')
            resolve()
          })
          .catch(error => {
            this.$userError(error, 'Get Node API endpoints action')
          })
      })
    },
    async getEndpointsData (id, key, ranks) {
      try {
        let accounts = await this.$rpc.getAccounts(key)
        let name = accounts.account_names[0] ? accounts.account_names[0] : ''
        if (name) {
          this.endpoints[id].account = name
          let voteStats = ranks.find(row => row.owner === name)
          if (voteStats) {
            let rk = []
            ranks.forEach(item => {
              let owner = item.owner
              let votes = item.total_votes
              rk.push({ owner, votes })
            })
            rk.sort((a, b) => b.votes - a.votes)
            this.endpoints[id].rank = rk.map(e => e.owner).indexOf(name) + 1
          } else {
            this.endpoints[id].rank = 'unknown'
          }
        } else {
          this.endpoints[id].account = 'No account found'
          this.endpoints[id].rank = 'unknown'
        }
      } catch (error) {
        this.$userError(error, 'Get Node endpoints data action')
      }
    },
    useEndpoint (endpoint) {
      this.$configManager.updateNodeAPI(endpoint)
      this.$emit('clicked', true)
    }
  } // end of methods
}
</script>

<style scoped>
</style>
