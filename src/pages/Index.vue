<template>
  <q-layout>
    <div class="titlebar"></div>
    <q-page-container>
      <q-page class="bg-vblack q-pa-lg" :class="blur ? 'blur' : ''">
        <!-- Topbar -->
        <div class="row bg-vdark items-center q-mb-lg titilium">
          <div class="col q-py-sm q-px-md">
            <div class="text-h6 text-uppercase text-weight-bolder text-vgrey border-right titilium">
              <div class="row no-wrap">
                <img src="@/statics/icons/logo.png" class="q-mr-sm" style="height: 32px; max-width: 32px" />
                <div>
                  Volentix Node
                  <q-badge color="vgold" class="q-mx-sm" text-color="vblack" align="top" transparent>{{ version }}</q-badge>
                </div>
              </div>
            </div>
          </div>
          <div class="col q-py-sm q-px-sm">
            <div class="text-h6 text-vgreen text-weight-bolder text-uppercase titilium">
              Volentix Node
              <span class="text-vgrey text-weight-regular text-lowercase">Control Panel</span>
            </div>
            <div class="row items-center">
              <div class="text-italic text-vgrey titilium">Contribute to the Node Network and get VTX</div>
              <q-btn color="vgrey" size="7px" flat round icon="fas fa-question" class="q-mx-xs" @click="helpDialog = true">
                <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
              </q-btn>
            </div>
          </div>

          <div class="col q-py-sm q-px-sm">
            <div class="row justify-end">
              <q-btn outline rounded color="vgreen" class="q-mx-xs" label="Get vDex node" @click="$utils.openExternal($configStore.get('node_readme'))" />
              <q-btn flat round color="vgold" class="q-mx-xs" icon="fas fa-sliders-h" to="/settings" />
              <q-btn flat round color="vgold" class="q-mx-xs" icon="fas fa-sign-out-alt" @click="$configManager.logout()" />
            </div>
          </div>
        </div>

        <!-- Identity, List panel, vote panel -->
        <div class="row q-col-gutter-x-lg q-mb-lg titilium">
          <!-- Identity -->
          <div class="col-3">
            <q-banner dense class="text-vgrey bg-vdark q-pa-md">
              <div class="row">
                <div class="col">
                  <div class="text-subtitle2 text-uppercase">Welcome</div>
                </div>
                <div class="col text-right">
                  <div class="text-subtitle2 text-vgreen text-weight-bolder text-uppercase">{{ identity.accountName }}</div>
                </div>
              </div>
            </q-banner>
            <q-separator dark />
            <q-list dense separator class="bg-vdark text-vgrey">
              <q-item v-if="!status.accountAdded">
                <q-item-section>
                  <q-btn outline rounded dense color="vgreen" icon="fas fa-user-plus" class="q-my-xs" @click="addNode()" label="Add">
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Add the node</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" v-if="!status.accountAdded" />
              <q-item v-if="!status.accountRegistered">
                <q-item-section>
                  <q-btn outline rounded dense color="vgreen" icon="fas fa-address-card" class="q-my-xs" @click="registerNode()" label="Register">
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Register the node</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" v-if="!status.accountRegistered" />
              <q-item v-if="!status.accountRun">
                <q-item-section>
                  <q-btn outline rounded dense color="vgreen" icon="fas fa-running" class="q-my-xs" @click="retreiveReward()" label="Run">
                    <q-tooltip content-class="bg-vgreen text-vdark" content-style="font-size: 16px" :offset="[10, 10]">
                      You need to init your node by pushing the retreive reward
                      action first time.
                    </q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" v-if="!status.accountRun" />
              <q-item>
                <q-item-section class="text-left">
                  <q-item-label>
                    <q-btn size="sm" rounded outline dense class="q-my-xs q-px-sm" color="vgrey" @click="publicDialog = true" label="Get public key">
                      <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to get your public key</q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
                <q-item-section class="text-right">
                  <q-item-label class="text-weight-bolder" :class="parseFloat(identity.balance) > 0 ? 'text-vgrey' : 'text-vred' ">{{ identity.balance }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" />
              <q-item v-if="parseFloat(identity.balance) == 0">
                <q-item-section>
                  <q-btn label="Get VTX" outline rounded dense color="vred" @click="$utils.openExternal('https://www.stex.com/')" />
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" v-if="parseFloat(identity.balance) == 0" />
              <q-item>
                <q-item-section>
                  <q-item-label>
                    Rank:
                    <q-btn size="7px" class="q-mx-xs" dense flat round icon="fas fa-question" @click="rankDialog = true">
                      <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to know more</q-tooltip>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-vgrey">Total ranks: {{ identity.totalRanks }}</q-item-label>
                </q-item-section>
                <q-item-section avatar class="text-weight-bolder text-vgrey">
                  <q-item-label>#{{ identity.rank }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" />
              <q-item>
                <q-item-section disabled>
                  <q-item-label>Uptime:</q-item-label>
                </q-item-section>
                <q-item-section avatar disabled>
                  <q-item-label>{{ identity.uptime }} days</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" />
              <q-item>
                <q-item-section disabled>
                  <q-item-label>VTX earned:</q-item-label>
                </q-item-section>
                <q-item-section avatar disabled>
                  <q-item-label>{{ identity.earned }} VTX</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" />
              <q-item>
                <q-item-section align="left">
                  <q-item-label>
                    RAM
                    <sup>(used)</sup>
                  </q-item-label>
                  <q-item-label class="text-vgrey">{{ status.ram }}</q-item-label>
                </q-item-section>
                <q-item-section align="center">
                  <q-item-label>
                    NET
                    <sup>(used)</sup>
                  </q-item-label>
                  <q-item-label class="text-vgrey">{{ status.net }}</q-item-label>
                </q-item-section>
                <q-item-section align="right">
                  <q-item-label>
                    CPU
                    <sup>(avail)</sup>
                  </q-item-label>
                  <q-item-label :class="parseFloat(status.cpu) == 0 ? 'text-vred' : 'text-vgrey'">{{ status.cpu }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" />
              <q-item v-if="parseFloat(status.cpu) == 0" class="bg-vred text-white">
                <q-item-section>
                  <q-item-label>Not enough CPU time to complete transactions! You can wait for the network to be less loaded or stake more CPU.</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn label="Stake CPU" outline rounded dense size="sm" class="q-px-sm" color="white" @click="$utils.openExternal('https://docs.bloks.io/wallet/staking-cpu-+-net')" />
                </q-item-section>
              </q-item>
              <q-separator color="vseparator" v-if="parseFloat(status.cpu) == 0" />
              <q-item align="center">
                <q-item-section>
                  <q-btn label="Retreive reward" outline rounded color="vgreen" class="q-my-xs" @click="retreiveReward()" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <!-- List panel -->
          <div class="col-6">
            <q-banner dense inline-actions class="text-vgrey bg-vdark q-px-md q-pt-md">
              <div class="row">
                <div class="column">
                  <div class="col">
                    <div class="text-subtitle2 text-uppercase">
                      List of Nodes on the network
                      <q-btn size="7px" class="q-mx-xs" dense flat round icon="fas fa-question">
                        <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">
                          List of the nodes is automatically updated every 5
                          minutes
                        </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                  <div class="col">
                    <q-badge color="vgrey" class="text-vdark q-mr-xs">Running: {{ nodes.length }}</q-badge>
                    <q-badge color="vgrey" class="text-vdark q-mr-xs">
                      Registered: {{ registered_nodes.length }}
                      <q-tooltip content-class="bg-vgrey text-vdark">
                        <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in registered_nodes" :key="node">{{ node }}</q-badge>
                      </q-tooltip>
                    </q-badge>
                    <q-badge color="vgrey" class="text-vdark q-mr-xs" v-if="identity.voted_for.length > 0">
                      Voted for you: {{ this.identity.voted_for.length }}
                      <q-tooltip content-class="bg-vgrey text-vdark">
                        <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in identity.voted_for" :key="node">{{ node }}</q-badge>
                      </q-tooltip>
                    </q-badge>
                    <q-badge color="vgrey" class="text-vdark q-mr-xs q-mb-sm" v-if="identity.voted_i.length > 0">
                      I voted for: {{ this.identity.voted_i.length }}
                      <q-tooltip content-class="bg-vgrey text-vdark">
                        <q-badge color="vdark" class="text-vgrey q-pa-xs q-ma-xs" v-for="node in identity.voted_i" :key="node">{{ node }}</q-badge>
                      </q-tooltip>
                    </q-badge>
                  </div>
                </div>
              </div>
              <template v-slot:action>
                <q-btn outline rounded size="xs" dense :disabled="!voting_list.length && nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : true " color="vgold" class="q-px-sm q-mx-xs" @click="getVoteBackList('random')" label="Vote back (random)" />
                <q-btn outline rounded size="xs" dense :disabled="!voting_list.length && nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : true " color="vgold" class="q-px-sm q-mx-xs" @click="getVoteBackList('top')" label="Vote back (top)" />
                <q-btn outline flat round color="vgold" size="sm" icon="fas fa-sync-alt" class="q-mx-xs" :disabled="nodes.length && nodes.every(item => item.balance !== '' && item.account) ? false : true " v-on:click="refresh()" />
              </template>
            </q-banner>
            <q-separator dark />
            <q-linear-progress dark indeterminate track-color="vgrey" color="vgreen" v-if="nodes.length === 0" />
            <!-- Table example -->
            <div class="bg-vdark">
              <q-table dense :data="nodes" :columns="nodesColumns" row-key="name" virtual-scroll :pagination.sync="nodesPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="account" :props="props">
                      <q-btn dense flat size="sm" :color="props.row.balance > 0 ? 'vgreen' : 'vgold'" class="code" @click="$utils.openExternal('https://bloks.io/account/', props.row.account ) " :label="props.row.account" :disabled="props.row.account !== 'No account found' ? false : true " />
                    </q-td>
                    <q-td key="rank" :props="props" class="code">{{ props.row.rank }}</q-td>
                    <q-td key="balance" :props="props" class="code" :class="props.row.balance > 0 ? 'text-vgrey' : 'text-vgold'">{{ props.row.balance }} VTX</q-td>
                    <q-td key="voted_for" :props="props">
                      <q-icon name="fas fa-check" class="text-vgrey" v-show="props.row.voted_for" />
                      <q-icon name="fas fa-times" class="text-vblack" v-show="!props.row.voted_for" />
                    </q-td>
                    <q-td key="voted_i" :props="props">
                      <q-icon name="fas fa-check" class="text-vgrey" v-show="props.row.voted_i" />
                      <q-icon name="fas fa-times" class="text-vblack" v-show="!props.row.voted_i" />
                    </q-td>
                    <q-td key="vote" :props="props">
                      <div v-if="
                          props.row.vote &&
                            props.row.account != identity.accountName
                        ">
                        <q-btn outline dense size="xs" class="q-px-md" rounded color="vgold" v-on:click="addToVote(props.row)" v-if="!voting_list.includes(props.row)">Vote</q-btn>
                        <q-btn size="xs" dense rounded color="vgold" class="text-vdark q-px-md" v-on:click="addToVote(props.row)" v-if="voting_list.includes(props.row)">Vote</q-btn>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
          <!-- Vote panel -->
          <div class="col-3">
            <q-banner dense class="text-vgrey bg-vdark q-px-md q-pt-md">
              <div class="row items-center">
                <div class="col">
                  <div class="text-uppercase">
                    Voting
                    <q-btn size="7px" color="vgrey" dense flat round icon="fas fa-question" @click="rulesDialog = true">
                      <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to see the voting rules</q-tooltip>
                    </q-btn>
                  </div>
                </div>
                <div class="col">
                  <q-badge color="vgrey" class="text-vdark text-weight-bolder text-caption" v-if="voting_list.length > 0">{{ voting_list.length }}/21</q-badge>
                  <q-btn size="xs" class="q-mx-xs" color="vgrey" flat round icon="fas fa-backspace" v-if="voting_list.length > 0" @click="voting_list = []">
                    <q-tooltip content-class="bg-vgrey text-vdark" content-style="font-size: 16px" :offset="[10, 10]">Click to clear the voting list</q-tooltip>
                  </q-btn>
                </div>
                <div class="col q-pa-sm text-right">
                  <div class="text-caption" v-if="voting_list.length == 0">Choose nodes</div>
                  <q-btn color="vgold" rounded size="sm" dense class="text-vdark text-weight-bolder q-px-md" v-on:click="vote()" v-if="voting_list.length > 0">Vote now</q-btn>
                </div>
              </div>
            </q-banner>
            <q-separator dark />
            <div class="bg-vdark">
              <q-table v-if="voting_list.length > 0" dense flat :data="voting_list" :columns="voting_listColumns" row-key="name" virtual-scroll :pagination.sync="voting_listPagination" :rows-per-page-options="[0]" table-style="max-height: 190pt;" hide-bottom class="bg-vdark text-vgrey">
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="account" :props="props">
                      <q-btn dense flat size="sm" color="vgreen" class="code" @click="
                          $utils.openExternal('https://bloks.io/account/',  props.row.account )
                        " :label="props.row.account" />
                    </q-td>
                    <q-td key="rank" :props="props">{{ props.row.rank }}</q-td>
                    <q-td key="balance" :props="props">{{ props.row.balance }} VTX</q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </div>

        <!-- Map, chat -->
        <div class="row q-col-gutter-x-lg titilium">
          <!-- Map Widget -->
          <div class="col-7">
            <MapWidget v-bind:nodes="nodes" />
          </div>
          <!-- Chat -->
          <div class="col-5">
            <q-banner dense inline-actions class="text-vgrey bg-vdarkgrey">The chat widget is currently disabled, the data is artificial.</q-banner>
            <ChatWidget />
          </div>
        </div>

        <!-- Public key dialog -->
        <q-dialog v-model="publicDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Public key</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section>
              <q-list bordered round class="bg-vgrey text-vdark">
                <q-item clickable v-ripple @click="$utils.copyToClipboard(identity.publicKey)">
                  <q-item-section>{{ identity.publicKey }}</q-item-section>
                  <q-item-section avatar>
                    <q-icon color="vdark" name="fas fa-copy" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Help dialog -->
        <q-dialog v-model="helpDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Help</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">1. Private key.</div>
              <p>
                It used to define your public key, EOS account name and other
                required information.
              </p>

              <div class="text-subtitle1">2. Add the account</div>
              <p>It will add your account name into distribution contract.</p>

              <div class="text-subtitle1">3. Register the account</div>
              <p>It will register your account in the voting contract.</p>

              <div class="text-subtitle1">4. Run</div>
              <p>
                It will start monitor the uptime of your node in the voting
                contract.
              </p>

              <div class="text-subtitle1">5. Vote</div>
              <p>
                You can choose a number of nodes from the list you want to vote
                for.
              </p>

              <div class="text-subtitle1">6. Retreive reward</div>
              <p>
                To receive your reward for the running node click on the button
                retreive reward.
              </p>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Rank  dialog -->
        <q-dialog v-model="rankDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Rank</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">How the rank works</div>
              <ul>
                <li>
                  Rank is your position among all registered nodes based on the
                  vote points.
                </li>
                <li>
                  Those users who vote for your node give you their points based
                  on the power of their vote. The sum of points and its position
                  harm the other nodes forms the rank. Foe example #1 means you
                  have the most vote points.
                </li>
                <li>
                  The power of the vote depends on the VTX balance. The more VTX
                  you have, the stronger your vote.
                </li>
                <li>
                  Votes are divided by the number of nodes for which you vote.
                  For example, if the strength of your vote is 10 points and you
                  vote for 1 node, you give all 10 points to this node, but if
                  you vote for 5 nodes, each will receive 2 points only.
                </li>
              </ul>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn outline rounded color="vgold" label="Got it" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!-- Voting rules dialog -->
        <q-dialog v-model="rulesDialog">
          <q-card square style="min-width: 50vw; max-width: 70vw;" class="bg-vdark text-vgrey">
            <q-card-section>
              <div class="text-h6">Voting rules</div>
              <q-separator dark />
            </q-card-section>
            <q-card-section style="max-height: 60vh" class="scroll">
              <div class="text-subtitle1">1. Voting.</div>
              <ul>
                <li>You can't vote for the node without account name.</li>
                <li>You can't vote for the yourself (node with your account name).</li>
                <li>
                  You can't vote for the node which is not registered in the
                  contracts.
                </li>
              </ul>
              <div class="text-subtitle1">2. Reward.</div>
              <ul>
                <li>For being rewared your node should be running.</li>
                <li>
                  Your node assigned account name should be added and registered
                  in the contracts.
                </li>
                <li>The uptime of your node should be at least 24 hours.</li>
                <li>You have to vote for at least 2 other nodes to get the reward.</li>
              </ul>
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
import MapWidget from '../components/MapWidget.vue'
import ChatWidget from '../components/ChatWidget.vue'

/**
 * Main page. Loads other components
 * @vue-data {*} identity - Set of variables for storing user identification information
 *
 * @vue-event {} checkAccountAdded
 * @vue-event {} checkAccountRegistered
 * @vue-event {} checkAccountRun
 * @vue-event {} refresher
 * @vue-event {} identify
 * @vue-event {} getUptime
 * @vue-event {} getVoted
 * @vue-event {} getRank
 * @vue-event {} getBalance
 * @vue-event {} updatePrivate
 * @vue-event {} showPrivate
 * @vue-event {} refresh
 * @vue-event {} getInstaller
 * @vue-event {} forceFileDownload
 * @vue-event {} addNode
 * @vue-event {} registerNode
 * @vue-event {} getAccountName
 * @vue-event {} getNodes
 * @vue-event {} getListOfNodes
 * @vue-event {} addToVote
 * @vue-event {} vote
 * @vue-event {} retreiveReward
 */
export default {
  name: 'index',
  components: {
    MapWidget,
    ChatWidget
  },
  data () {
    return {
      version: '',
      publicDialog: false,
      helpDialog: false,
      rankDialog: false,
      rulesDialog: false,
      voting_list: [],
      voting_listColumns: [
        { name: 'account', align: 'left', label: 'Account', field: 'account' },
        { name: 'rank', align: 'center', label: 'Rank', field: 'rank' },
        { name: 'balance', align: 'right', label: 'Balance', field: 'balance' }
      ],
      voting_listPagination: {
        rowsPerPage: 0
      },
      nodes: [],
      nodesColumns: [
        { name: 'account', align: 'left', label: 'Account', field: 'account', sortable: true },
        { name: 'rank', align: 'center', label: 'Rank', field: 'rank', sortable: true },
        { name: 'balance', align: 'right', label: 'Balance', field: 'balance', sortable: true },
        { name: 'voted_for', align: 'center', label: 'Voted for you', field: 'voted_for' },
        { name: 'voted_i', align: 'center', label: 'I voted for', field: 'voted_i' },
        { name: 'vote', align: 'center', label: 'Vote', field: 'vote' }
      ],
      nodesPagination: {
        rowsPerPage: 0,
        sortBy: 'rank',
        descending: false
      }
    }
  },
  computed: {
    blur: function () {
      return this.helpDialog || this.rankDialog || this.rulesDialog || this.publicDialog
    },
    loggedIn: function () {
      return this.$store.getters.isLoggedIn
    },
    identity: function () {
      return this.$store.getters.getIdentity
    },
    status: function () {
      return this.$store.getters.getStatus
    },
    registered_nodes: function () {
      return this.$store.getters.getRegisteredNodes
    }
  },
  mounted () {
    this.version = this.$utils.getVersion()
    this.$configManager.accountAdded(this.identity.accountName)
    this.$configManager.accountRegistered(this.identity.accountName)
    this.$configManager.accountRun(this.identity.accountName)
    this.$configManager.getUserUptime(this.identity.accountName)
    // TODO: not implemented yet
    this.$store.commit('setEarned', '0.0000')
    this.$store.state.status.time = this.$utils.getTime()
    this.m1 = this.getInfoRare()
    this.m2 = this.getInfoOften()
    this.m3 = setInterval(() => this.getInfoOften(), 60000) // 60 sec
    // TODO: uncomment when API fix the issue with different number of nodes in response
    // this.m4 = setInterval(() => this.checkAccountRun(), 3600000)
    this.m5 = setInterval(() => this.refresh(), 300000) // 5 min
    this.m6 = setInterval(() => this.$configManager.getUserResources(this.identity.accountName), 5000)
  },
  beforeDestroy () {
    clearInterval(this.m3)
    // TODO: uncomment when feature will be enabled
    // clearInterval(this.m4)
    clearInterval(this.m5)
    clearInterval(this.m6)
  },
  methods: {
    checkAccountRun () {
      if (this.nodes.length > 0 && !this.nodes.some(item => item.account === this.identity.accountName)) {
        this.$userError(
          "Oops, I can't see your node in the list. Try to update the list or check your node.",
          'Check node running action'
        )
      }
    },
    addToVote (node) {
      if (this.voting_list.includes(node)) {
        var i = this.voting_list.indexOf(node)
        this.voting_list.splice(i, 1)
      } else {
        if (this.voting_list.length !== 21) {
          this.voting_list.push(node)
        } else {
          this.$userError('You can vote for no more than 21 nodes', 'Add to vote action')
        }
      }
    },
    refresh () {
      this.nodes = []
      this.voting_list = []
      this.getInfoRare()
      this.getInfoOften()
    },
    getInfoRare () {
      this.getListOfNodes()
      this.$configManager.getUserRank(this.identity.accountName)
      this.$configManager.getRegisteredNodes()
    },
    getInfoOften () {
      this.$configManager.getUserBalance(this.identity.accountName)
      this.$configManager.getUserVoted(this.identity.accountName)
    },
    getVoteBackList (option) {
      let self = this
      let bank = this.nodes.filter(function (item) {
        return self.identity.voted_for.includes(item.account)
      })

      if (bank.length <= 21) {
        bank.forEach(item => {
          this.addToVote(item)
        })
        bank = []
      } else {
        if (option === 'random') {
          for (let i = 0; i < 21; i++) {
            let rand = Math.random()
            let total = bank.length
            let randIndex = Math.floor(rand * total)
            this.addToVote(bank[randIndex])
            bank.splice(randIndex, 1)
          }
          bank = []
        } else if (option === 'top') {
          bank.sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
          let top = bank.slice(0, 21)
          top.forEach(item => {
            this.addToVote(item)
          })
        }
      }
    },
    sortByField (field) {
      this.nodes = this.$utils.sortByKey(this.nodes, field)
    },
    addNode () {
      this.$configManager
        .addNode(this.identity.accountName)
        .then(() => {})
        .catch(error => {
          throw new Error(error)
        })
    },
    registerNode () {
      this.$configManager
        .registerNode(this.identity.accountName)
        .then(() => {})
        .catch(error => {
          throw new Error(error)
        })
    },
    retreiveReward () {
      this.$configManager
        .retreiveReward(this.identity.accountName)
        .then(() => {
          setTimeout(() => this.getInfoOften(), 3000)
          setTimeout(() => this.$configManager.getUserUptime(this.identity.accountName), 3000)
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    vote () {
      this.$configManager
        .vote(this.voting_list, this.identity.accountName)
        .then(() => {
          this.voting_list = []
          setTimeout(() => {
            this.getInfoOften()
            this.$configManager.getUserRank(this.identity.accountName)
          }, 3000)
        })
        .catch(error => {
          throw new Error(error)
        })
    },
    async getListOfNodes () {
      await this.getNodes()
      const ranks = await this.$rpc.getTable('vdexdposvote', 'vdexdposvote', 'producers')
      for (var id in this.nodes) {
        this.getNodesData(id, this.nodes[id].key, ranks)
      }
    },
    async getNodes () {
      return new Promise(resolve => {
        this.$http
          .get(this.$configStore.get('node_api') + '/getConnectedNodes')
          .then(result => {
            // TODO: Handler if the object is empty of has result: null or result: try later
            for (var key in result.data) {
              if (result.data[key].includes('EOS')) {
                this.nodes.push({
                  id: key,
                  key: result.data[key].trim(),
                  account: '',
                  balance: '',
                  rank: '',
                  voted_for: false,
                  voted_i: false,
                  vote: true
                })
              }
            }
            this.nodes = this.$utils.getUnique(this.nodes, 'key')
            resolve()
          })
          .catch(error => {
            this.$userError(error, 'Get nodes action')
          })
      })
    },
    async getNodesData (id, key, ranks) {
      try {
        let accounts = await this.$rpc.getAccounts(key)
        let name = accounts.account_names[0] ? accounts.account_names[0] : ''
        if (name) {
          let balance = await this.$rpc.getBalance(name)
          this.nodes[id].account = name
          this.nodes[id].balance = Math.floor(balance.balance)
          this.nodes[id].vote = this.registered_nodes.includes(name)
          this.nodes[id].voted_for = this.identity.voted_for.includes(name)
          this.nodes[id].voted_i = this.identity.voted_i.includes(name)

          let voteStats = ranks.find(row => row.owner === name)
          if (voteStats) {
            let rk = []
            ranks.forEach(item => {
              let owner = item.owner
              let votes = item.total_votes
              rk.push({ owner, votes })
            })
            rk.sort((a, b) => b.votes - a.votes)
            this.nodes[id].rank = rk.map(e => e.owner).indexOf(name) + 1
          } else {
            this.nodes[id].rank = 'unknown'
          }
        } else {
          this.nodes[id].account = 'No account found'
          this.nodes[id].balance = 0
          this.nodes[id].vote = false
          this.nodes[id].rank = 'unknown'
        }
      } catch (error) {
        this.$userError(error, 'Get account name action')
      }
    }
  } // end of methods
}
</script>

<style>
</style>
