<template>
  <v-card>
    <card-title
      icon="mdi-format-list-bulleted-type"
      :title="$t('Dashboard.Printqueue.Printqueue')"
    >
      <v-spacer />
      <v-btn
        fab
        small
        color="primary"
        depressed
        @click="createDialog.bool = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </card-title>
    <v-card-text>
      <template
        v-if="
          ['completed', 'cancelled'].includes(
            fileManagerPropsEvents.printerInfo.printerState
          )
        "
      >
        <v-data-table
          :items="fileManagerPropsEvents.lastPrinted"
          :headers="lastFileheaders"
          hide-default-footer
          mobile-breakpoint="0"
          class="mb-8"
          v-if="!isStartPrintPress"
        >
          <template #item="{ index, item }">
            <tr
              :key="`${index} ${item.id}`"
              @contextmenu="showContextMenu($event, item)"
            >
              <td>
                {{ item.name }}
              </td>
              <td>
                <v-btn icon small @click="startPrint(item)">
                  <v-icon class="mr-1" color="success">mdi-restart</v-icon>
                  <template v-if="isTablet || isDesktop">{{
                    $t("Dashboard.Printqueue.Restart")
                  }}</template>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </template>

      <v-spacer />

      <v-data-table
        :items="printjobsSync"
        :items-per-page="-1"
        :headers="headers"
        mobile-breakpoint="0"
        :sort-by="['priority', 'creation_time']"
        :sort-desc="[false, false]"
      >
        <template #item="{ index, item }">
          <tr
            :key="`${index} ${item.id}`"
            v-longpress:600="(e) => showContextMenu(e, item)"
            @contextmenu="showContextMenu($event, item)"
          >
            <td>
              <v-icon :color="item.priorityColor">
                {{ item.priorityIcon }}
              </v-icon>
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{
                $helpers.formatDate(
                  item.creation_time * 1000,
                  fileManagerPropsEvents.params.timezoneOffset
                )
              }}
            </td>
            <td>{{ item.filename }}</td>
            <td>
              <v-btn icon @click="showContextMenu($event, item)">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-menu
      v-model="contextMenu.shown"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <template v-if="contextMenu.item">
          <v-list-item
            v-if="
              contextMenu.item.priority !== 'HIGH' &&
              contextMenu.item.priority !== 'DELAY'
            "
            @click="setPriority(contextMenu.item, 'HIGH')"
          >
            <v-icon class="mr-1" color="error">mdi-chevron-double-up</v-icon>
            {{ $t("Dashboard.Printqueue.SetHigh") }}
          </v-list-item>
          <v-list-item
            v-if="
              contextMenu.item.priority !== 'NORMAL' &&
              contextMenu.item.priority !== 'DELAY'
            "
            @click="setPriority(contextMenu.item, 'NORMAL')"
          >
            <v-icon class="mr-1" color="primary">mdi-circle-double</v-icon>
            {{ $t("Dashboard.Printqueue.SetNormal") }}
          </v-list-item>
          <v-list-item
            v-if="
              contextMenu.item.priority !== 'LOW' &&
              contextMenu.item.priority !== 'DELAY'
            "
            @click="setPriority(contextMenu.item, 'LOW')"
          >
            <v-icon class="mr-1">mdi-chevron-double-down</v-icon>
            {{ $t("Dashboard.Printqueue.SetLow") }}
          </v-list-item>
        </template>
        <v-list-item @click="editJob(contextMenu.item)">
          <v-icon class="mr-1">mdi-pencil</v-icon>
          {{ $t("Dashboard.Printqueue.Edit") }}
        </v-list-item>
        <v-list-item @click="deleteJob(contextMenu.item)">
          <v-icon class="mr-1">mdi-delete</v-icon>
          {{ $t("Dashboard.Printqueue.Delete") }}
        </v-list-item>
      </v-list>
    </v-menu>
    <dashboard-create-printjob-dialog
      :create-dialog.sync="createDialog"
      :file-manager-props-events="fileManagerPropsEvents"
      :options.sync="optionsSync"
      :files-for-copy-dialog.sync="filesForCopyDialogSync"
      v-model="filetree"
      @serverPrintjobsPostJob="serverPrintjobsPostJob"
    />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, PropSync, Model } from 'nuxt-property-decorator'
import { DataTableHeader } from 'vuetify'
import { ServerPrintjobsStatePrintjob } from '../../../types/printjobs'
import { IParams, IPrinterInfo } from '../../../types/common'
import DashboardCreatePrintjobDialog from './CreatePrintjobDialog.vue'
import  CardTitle from '~common/components/CardTitle.vue'

interface createDialog {
  bool: boolean
  edit: boolean
  item: ServerPrintjobsStatePrintjob
  valid: boolean
}

@Component({
  name: 'PrintQueue',
  components: {
    DashboardCreatePrintjobDialog,
    CardTitle
  }
})
export default class DashboardPrintQueue extends Vue {
  @PropSync('printjobs', { type: Array, default: () => [] }) printjobsSync!: []

  //---------------for FileManager component---------------{

  @Prop({
    type: Object, default: () => {
      return {
        closeable: false,
        noPrint: false,
        loadings: [],
        diskUsage: { free: 0, total: 0, used: 0 },
        validGcodeExtensions: [],
        params: {
          timezoneOffset: 0,
          apiUrl: '',
          isPanel: true
        },
        currentPathProp: '',
        printerInfo: {
          axisMode: '',
          printerIsPrinting: false,
        },
        lastPrinted: [],
        socketAddLoading: (obj: any) => { },
        socketRemoveLoading: (obj: any) => { },
        postDirectory: (options: any, settings: any) => { },
        getDirectory: (options: any, settings: any) => { },
        serverFilesMove: (options: any, settings: any) => { },
        serverFilesCopy: (options: any, settings: any) => { },
        serverFilesMetadata: (options: any, settings: any) => { },
        printerGcodeScript: (options: any, settings: any) => { },
        serverFilesDeleteFile: (options: any, settings: any) => { },
        serverFilesDeleteDirectory: (options: any, settings: any) => { },
        // serverPrintjobsPostJob: (options: any, settings: any) => { },
        setGcodefilesMetadata: (obj: any) => { },
      }
    }
  }) fileManagerPropsEvents!: {
    closeable: boolean,
    noPrint: boolean,
    loadings: string[],
    diskUsage: {},
    validGcodeExtensions: string[],
    params: IParams,
    printerInfo: IPrinterInfo,
    currentPathProp: string,
    lastPrinted: [],
    socketAddLoading: (obj: any) => void,
    socketRemoveLoading: (obj: any) => void,
    postDirectory: (options: any, settings: any) => void,
    getDirectory: (options: any, settings: any) => void,
    serverFilesMove: (options: any, settings: any) => void,
    serverFilesCopy: (options: any, settings: any) => void,
    serverFilesMetadata: (options: any, settings: any) => void,
    printerGcodeScript: (options: any, settings: any) => void,
    serverFilesDeleteFile: (options: any, settings: any) => void,
    serverFilesDeleteDirectory: (options: any, settings: any) => void,
    // serverPrintjobsPostJob: (options: any, settings: any) => void,
    setGcodefilesMetadata: (obj: any) => void
  }

  @PropSync('options', {
    type: Object, default: () => {
      return {
        sortBy: ['modified'],
        sortDesc: [true],
        showHiddenFiles: false,
        itemsPerPage: 10,
        hideMetadataColums: [
          "object_height",
          "layer_height",
          "filament_total",
          "filament_weight_total",
          "estimated_time",
          "slicer"
        ]
      }
    }
  }) optionsSync!: { sortBy: string[], sortDesc: boolean[], showHiddenFiles: boolean, itemsPerPage: number, hideMetadataColums: String[] }
  @PropSync('filesForCopyDialog', { type: Array, default: () => [] }) filesForCopyDialogSync!: []
  @Model('', { type: Array, default: () => [] }) filetree!: []

  //---------------for FileManager component---------------}

  isStartPrintPress = false;

  get headers () {
    const headers: DataTableHeader[] = [
      {
        text: '',
        value: 'priority',
        align: 'start',
        sort: (a: any, b: any) => {
          return this.getPriorityNumber(b) - this.getPriorityNumber(a)
        }
      },
      {
        text: this.$t("Dashboard.Printqueue.Name").toString(),
        value: 'name',
        align: 'start',
        sortable: false,
      },
      {
        text: this.$t("Dashboard.Printqueue.CreationTime").toString(),
        value: 'creation_time',
        align: 'start',
      },
      {
        text: this.$t("Dashboard.Printqueue.File").toString(),
        value: 'filename',
        align: 'start',
        sortable: false,
      },
      {
        text: this.$t("Dashboard.Printqueue.Actions").toString(),
        value: '',
        align: 'start',
        sortable: false,
      },
    ]
    return headers
  }
  get lastFileheaders () {
    const headers: DataTableHeader[] = [
      {
        text: this.$t("Dashboard.Printqueue.NameOfLast").toString(),
        value: 'name',
        align: 'start',
        sortable: false,
      },
      {
        text: this.$t("Dashboard.Printqueue.Actions").toString(),
        value: '',
        align: 'start',
        sortable: false,
      },
    ]
    return headers
  }

  createDialog: createDialog = {
    bool: false,
    edit: false,
    item: {
      id: '',
      name: '',
      description: '',
      creation_time: 0,
      start_time: 0,
      end_time: 0,
      print_duration: 0,
      filename: '',
      metadata: null,
      status: '',
      priority: 'NORMAL',
      delay_time: 0,
      exists: false,
      filament_used: 0,
      total_duration: 0
    },
    valid: false
  }

  showContextMenu (e: any, item: ServerPrintjobsStatePrintjob) {
    if (!this.contextMenu.shown) {
      e?.preventDefault();
      this.contextMenu.shown = true
      this.contextMenu.x = e?.clientX || e?.pageX || window.screenX / 2;
      this.contextMenu.y = e?.clientY || e?.pageY || window.screenY / 2;
      this.contextMenu.item = item
      this.$nextTick(() => {
        this.contextMenu.shown = true
      })
    }
  }

  private contextMenu = {
    shown: false,
    touchTimer: undefined,
    x: 0,
    y: 0,
    item: {}
  }

  deleteJob (item: ServerPrintjobsStatePrintjob) {
    this.$emit('deleteJob', { id: item.id }, { action: 'server/printjobs/getDeletedJobs' })
  }

  editJob (item: ServerPrintjobsStatePrintjob) {
    this.createDialog.edit = true
    Object.assign(this.createDialog.item, item)
    this.createDialog.bool = true
  }

  startPrint (item: ServerPrintjobsStatePrintjob) {
    this.$emit("serverPrintjobsPostJob",
      {
        name: item.name,
        description: item.description,
        filename: item.filename,
        priority: item.priority
      },
      { action: "switchToDashboard" }
    );
    this.isStartPrintPress = true;
  }
  serverPrintjobsPostJob (options: any, settings: any) {
    this.$emit('serverPrintjobsPostJob', options, settings)
  }

  @Watch('fileManagerPropsEvents.printerInfo.printerState')
  printStateChanged (newVal: string) {
    if (['cancelled', 'completed'].includes(this.fileManagerPropsEvents.printerInfo.printerState)) {
      this.isStartPrintPress = false;
    }
  }

  get isTablet () {
    return (
      this.$vuetify.breakpoint.smAndUp && !this.isDesktop && !this.isWidescreen
    );
  }

  get isDesktop () {
    return this.$vuetify.breakpoint.lgAndUp && !this.isWidescreen;
  }

  get isWidescreen () {
    return this.$vuetify.breakpoint.xl;
  }

  setPriority (item: ServerPrintjobsStatePrintjob, priority: 'NORMAL' | 'HIGH' | 'LOW' | 'DELAY' = 'NORMAL') {
    item.priority = priority
    this.$emit('serverPrintjobsPostJob', item, { action: "server/printjobs/getPrintjobs" })
  }

  @Watch('printjobsSync') changePrintjobsSync (newVal: any) {
    this.createDialog.bool = false
  }

  getPriorityNumber (priority: string) {
    if (priority === "HIGH") return 3;
    else if (priority === "NORMAL") return 2;
    else if (priority === "LOW") return 1;
    else return 0;
  }

}

</script>

<style>
</style>
