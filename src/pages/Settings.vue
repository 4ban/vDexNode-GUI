<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vblack q-pa-lg" :class="blur ? 'blur' : ''">
        <!-- TopBar -->
        <div class="row bg-vdark items-center q-mb-lg titilium">
          <div class="col q-py-sm q-px-md">
            <div class="text-h6 text-uppercase text-vgrey titilium">
              <span class="text-weight-bolder">vdexnode</span> dashboard
              <q-badge color="vgold" class="q-mx-sm" text-color="vblack" align="top" transparent>{{ version }}</q-badge>
            </div>
          </div>
          <div class="col-5 q-py-sm q-px-sm">
            <div class="row justify-end">
              <q-btn outline rounded color="vgold" class="q-mx-xs" label="Home" to="/" />
              <q-btn v-if="loggedIn" flat round color="vgold" class="q-mx-xs" icon="fas fa-sign-out-alt" @click="$configManager.logout()" />
            </div>
          </div>
        </div>
        <!-- Settings -->
        <div class="row q-col-gutter-x-lg q-col-gutter-y-lg q-mb-lg titilium">
          <div class="col-5">
            <q-banner dense class="text-vdark bg-vred q-pa-md" v-if="!loggedIn">
              <div class="text-subtitle2 text-uppercase text-weight-bolder">The EOS Endpoints monitor can't operate with non-working default endpoint. You have to find and change it manually. Please use: https://eosnetworkmonitor.io/</div>
            </q-banner>
            <q-banner dense class="text-vgrey bg-vdark q-pa-md">
              <div class="text-subtitle2 text-uppercase">Configuration</div>
            </q-banner>
            <q-list dark dense separator class="bg-vdark text-vgrey q-px-md">
              <q-item>
                <q-item-section>
                  <q-item-label>EOS endpoint</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $configStore.get('eos_endpoint') }}</q-item-label>
                </q-item-section>
                <q-item-section side class="text-uppercase">
                  <q-item-label>Alive</q-item-label>
                  <q-item-label class="text-weight-bolder" :class="eosEndpointStatus ? 'text-vgreen' : 'text-red'">{{ eosEndpointStatus ? 'ok' : 'fail' }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn rounded outline size="sm" dense class="q-px-md" label="Edit" @click="editEosEndpointDialog = true" />
                </q-item-section>
              </q-item>
              <q-banner dense class="text-vgrey bg-vred q-pa-md" v-if="!eosEndpointStatus">
                <div>The app will not work if the EOS endpoint is not operable</div>
              </q-banner>
              <q-item>
                <q-item-section>
                  <q-item-label>Node API gateway</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $configStore.get('node_api') }}</q-item-label>
                </q-item-section>
                <q-item-section side class="text-uppercase">
                  <q-item-label>Alive</q-item-label>
                  <q-item-label class="text-weight-bolder" :class="nodeApiStatus ? 'text-vgreen' : 'text-red'">{{ nodeApiStatus ? 'ok' : 'fail' }}</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn rounded outline size="sm" dense class="q-px-md" label="Edit" @click="editNodeApiDialog = true" />
                </q-item-section>
              </q-item>
              <q-banner dense class="text-vgrey bg-vred q-pa-md" v-if="!nodeApiStatus">
                <div>The app will not work if the Node API is not operable</div>
              </q-banner>
            </q-list>
          </div>
          <div class="col-7">
            <q-banner dense class="text-vgrey bg-vdark q-pa-md">
              <div class="text-subtitle2 text-uppercase">Stats</div>
            </q-banner>
            <q-list dark dense separator class="bg-vdark text-vgrey q-px-md">
              <q-item>
                <q-item-section>
                  <q-item-label>
                    Node API in use
                    <q-btn size="xs" class="q-mx-xs" dense flat round icon="fas fa-question" @click="nodeApiHelpDialog = true">
                      <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                    </q-btn>
                  </q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $configStore.get('node_api') }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Config file path</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $configStore.path }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>RPC endpoint in use</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ inUseRPC }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>EOS authority provider in use</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ inUseEOS }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Vue version</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ vueVersion }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Quasar version</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $q.version }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label>Get vDexNode option</q-item-label>
                  <q-item-label caption class="code text-vgold">{{ $configStore.get('node_readme') }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-5" v-if="loggedIn">
            <NodeApiWidget @clicked="refresh()" />
          </div>
          <div class="col-12" v-if="loggedIn">
            <EndpointsWidget @clicked="refresh()" />
          </div>
        </div>
        <!-- Edit eos endpoint dialog -->
        <q-dialog v-model="editEosEndpointDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Edit EOS Endpoint</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section align="right">
              <q-form @submit="updateEosEndpoint()">
                <q-input dark dense clearable v-model="newEosEndpoint" counter color="vgrey" ref="input" @keyup.enter="updateEosEndpoint" label="New EOS Endpoint" />
                <q-btn color="vgrey" :disabled="newEosEndpoint ? false: true" unelevated rounded outline class="q-mt-md" label="Continue" type="submit" v-close-popup />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!-- Edit node api dialog -->
        <q-dialog v-model="editNodeApiDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Edit Node API</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section align="right">
              <q-form @submit="updateNodeAPI()">
                <q-input dark dense v-model="newNodeApi" counter color="vgrey" ref="input" @keyup.enter="updateNodeAPI" label="New Node API" />
                <q-btn color="vgrey" :disabled="newNodeApi ? false: true" unelevated rounded outline class="q-mt-md" label="Continue" type="submit" v-close-popup />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!-- Node Api Help dialog -->
        <q-dialog v-model="nodeApiHelpDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Node API</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">
                At the first launch of the application, a bootstrap node is used to gain access to the network of nodes.
                There is no way to get around this connection to the bootstrap node for the first time.
                However any node in the network is full and independent, so you can switch to any other working node at any time.
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import EndpointsWidget from '../components/EndpointsWidget.vue'
import NodeApiWidget from '../components/NodeApiWidget.vue'

export default {
  components: {
    EndpointsWidget,
    NodeApiWidget
  },
  data () {
    return {
      version: this.$utils.getVersion(),
      vueVersion: Vue.version,
      eosEndpointStatus: false,
      nodeApiStatus: false,
      editEosEndpointDialog: false,
      editNodeApiDialog: false,
      nodeApiHelpDialog: false,
      newNodeApi: '',
      newEosEndpoint: '',
      inUseRPC: '',
      inUseEOS: ''
    }
  },
  computed: {
    blur: function () {
      return this.editNodeApiDialog || this.editEosEndpointDialog || this.nodeApiHelpDialog
    },
    loggedIn: function () {
      return this.$store.getters.isLoggedIn
    }
  },
  mounted () {
    this.checkNodeApiStatus()
    this.checkEosEndpointStatus()
    this.s1 = setInterval(() => {
      this.checkEosEndpointStatus()
      this.checkNodeApiStatus()
    }, 60000)
    this.checkInUse()
  },
  beforeDestroy () {
    clearInterval(this.s1)
  },
  methods: {
    checkInUse () {
      this.inUseRPC = this.loggedIn ? this.$rpc.rpc.endpoint : 'undefined'
      this.inUseEOS = this.loggedIn ? this.$eos.api.authorityProvider.endpoint : 'undefined'
    },
    refresh (value) {
      this.checkNodeApiStatus()
      this.checkEosEndpointStatus()
      this.checkInUse()
    },
    checkEosEndpointStatus () {
      this.$utils.checkEosEndpoint(this.$configStore.get('eos_endpoint')).then(response => {
        this.eosEndpointStatus = response
      })
    },
    checkNodeApiStatus () {
      this.$utils.checkNodeApi(this.$configStore.get('node_api')).then(response => {
        this.nodeApiStatus = response
      })
    },
    updateNodeAPI () {
      this.$configManager.updateNodeAPI(this.newNodeApi)
      this.checkNodeApiStatus()
      this.newNodeApi = ''
      this.checkInUse()
    },
    updateEosEndpoint () {
      this.$configManager.updateEosEndpoint(this.newEosEndpoint, this.loggedIn)
      this.checkEosEndpointStatus()
      this.newEosEndpoint = ''
      this.checkInUse()
    }
  }
}
</script>
