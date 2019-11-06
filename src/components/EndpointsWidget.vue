<template>
  <div>
    <q-banner dense class="text-vgrey bg-vdark q-pa-md">
      <div class="text-subtitle2 text-uppercase">EOS Endpoints</div>
      <div>Number of endpoints: {{ this.endpoints.length }}</div>
    </q-banner>
    <q-linear-progress dark indeterminate track-color="vgrey" color="vgreen" v-if="endpoints.length === 0" />
    <q-table dense square :data="endpoints" :columns="endpointsColumns" row-key="name" virtual-scroll :pagination.sync="endpointsPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="owner" :props="props">
            <q-btn dense flat size="sm" class="code" @click="$utils.openExternal(props.row.url + '/bp.json' ) " :label="props.row.owner" :disabled="!props.row.url" />
          </q-td>
          <q-td key="location" :props="props" class>{{ props.row.location }}</q-td>
          <q-td key="total_votes" :props="props" class>{{ Math.floor(props.row.total_votes).toLocaleString() }}</q-td>
          <q-td key="last_claim_time" :props="props">{{ props.row.last_claim_time }}</q-td>
          <q-td key="http_address" :props="props">{{ props.row.http_address }}</q-td>
          <q-td key="https_address" :props="props">{{ props.row.https_address }}</q-td>
          <q-td key="alive" :props="props" class="code">
            <span class="text-weight-bolder text-uppercase" :class="props.row.alive ? 'text-vgreen' : 'text-red'">{{ props.row.alive ? 'ok' : 'fail' }}</span>
          </q-td>
          <q-td key="use" :props="props">
            <div v-if="(props.row.http_address || props.row.https_address) && props.row.alive">
              <q-btn outline dense size="xs" class="q-px-md" rounded color="vgrey" v-on:click="useEndpoint(props.row)">Use</q-btn>
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
  name: 'EndpointsWidget',
  data () {
    return {
      endpoints: [],
      endpointsColumns: [
        { name: 'owner', align: 'left', label: 'Name', field: 'owner', sortable: true },
        { name: 'location', align: 'left', label: 'Location', field: 'location' },
        {
          name: 'total_votes',
          align: 'right',
          label: 'Votes',
          field: 'total_votes',
          sortable: true,
          sort: (a, b) => parseInt(b) - parseInt(a)
        },
        { name: 'last_claim_time', align: 'right', label: 'Last claim time', field: 'last_claim_time' },
        { name: 'http_address', align: 'left', label: 'HTTP Address', field: 'http_address' },
        { name: 'https_address', align: 'left', label: 'SSL Address', field: 'https_address' },
        { name: 'alive', align: 'center', label: 'Alive', field: 'alive' },
        { name: 'use', align: 'center', label: 'Use', field: 'use' }
      ],
      endpointsPagination: {
        rowsPerPage: 0,
        sortBy: 'total_votes',
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
        this.$utils.checkEosEndpoint(item.https_address ? item.https_address : item.http_address).then(result => {
          item.alive = result
        })
      })
    },
    async updateEndpoints (producers) {
      const promises = Promise.all(
        producers.map(async producer => {
          const url = this.$utils.correctUrl(producer.url)
          if (!url.startsWith('http')) {
            return undefined
          }

          const bpData = await this.$utils.getBPjson(url)
          if (!bpData || !bpData.org) {
            return undefined
          }

          const nodes = bpData.nodes
            .map(node => {
              if (node.node_type === 'full') {
                if (!node.api_endpoint && !node.ssl_endpoint) {
                  return undefined
                }
                const apiEndpoint = node.api_endpoint
                const sslEndpoint = node.ssl_endpoint
                let location = node.location.country ? node.location.country + ', ' : 'Unknown, '
                location += node.location.name ? node.location.name : 'Unknown'
                return {
                  location: location,
                  http_server_address: apiEndpoint,
                  https_server_address: sslEndpoint
                }
              } else {
                return undefined
              }
            })
            .filter(e => e)

          if (nodes.length) {
            this.endpoints.push({
              owner: producer.owner,
              url: url,
              total_votes: producer.total_votes,
              last_claim_time: date.formatDate(producer.last_claim_time, 'HH:mm:ss DD-MMM-YYYY'),
              location: nodes[0].location,
              http_address: nodes[0].http_server_address,
              https_address: nodes[0].https_server_address,
              alive: undefined
            })
          }
        })
      )

      const result = await promises
      return result
    },
    async getEndpoints () {
      try {
        const rawData = await this.$rpc.getProducers()
        this.endpoints = []
        await this.updateEndpoints(rawData.rows)
      } catch (error) {
        this.$userError(error, 'Get endpoints')
      }
    },
    useEndpoint (endpoint) {
      console.log(endpoint.https_address || endpoint.http_address)
    }
  } // end of methods
}
</script>

<style scoped>
</style>
