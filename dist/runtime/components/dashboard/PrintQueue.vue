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
        v-if="['complete', 'cancelled'].includes(this.printerInfo.printerState)"
      >
        <v-data-table
          :items="lastPrintedSync"
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
                  params.timezoneOffset
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
      @updatePrintjob="updatePrintjob"
      :loadings="loadings"
      :disk-usage="diskUsage"
      :valid-gcode-extensions="validGcodeExtensions"
      :params="params"
      :printer-info="printerInfo"
      v-model="filetree"
      :options.sync="optionsSync"
      :files-for-copy-dialog.sync="filesForCopyDialogSync"
      @socketAddLoading="socketAddLoading"
      @socketRemoveLoading="socketRemoveLoading"
      @postDirectory="postDirectory"
      @getDirectory="getDirectory"
      @serverFilesMetadata="serverFilesMetadata"
      @serverFilesMove="serverFilesMove"
      @serverFilesCopy="serverFilesCopy"
      @printerGcodeScript="printerGcodeScript"
      @serverFilesDeleteFile="serverFilesDeleteFile"
      @serverFilesDeleteDirectory="serverFilesDeleteDirectory"
      @serverPrintjobsPostJob="serverPrintjobsPostJob"
      @setGcodefilesMetadata="setGcodefilesMetadata"
    />
  </v-card>
</template>

<script>
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import { Vue, Component, Watch, Prop, PropSync, Model } from "nuxt-property-decorator";
import DashboardCreatePrintjobDialog from "../dashboard/CreatePrintjobDialog.vue";
let DashboardPrintQueue = class extends Vue {
  constructor() {
    super(...arguments);
    this.isStartPrintPress = false;
    this.createDialog = {
      bool: false,
      edit: false,
      item: {
        id: "",
        name: "",
        description: "",
        creation_time: 0,
        start_time: 0,
        end_time: 0,
        print_duration: 0,
        filename: "",
        metadata: null,
        status: "",
        priority: "NORMAL",
        delay_time: 0,
        exists: false,
        filament_used: 0,
        total_duration: 0
      },
      valid: false
    };
    this.contextMenu = {
      shown: false,
      touchTimer: void 0,
      x: 0,
      y: 0,
      item: {}
    };
  }
  get headers() {
    const headers = [
      {
        text: "",
        value: "priority",
        align: "start",
        sort: (a, b) => {
          return this.getPriorityNumber(b) - this.getPriorityNumber(a);
        }
      },
      {
        text: this.$t("Dashboard.Printqueue.Name").toString(),
        value: "name",
        align: "start",
        sortable: false
      },
      {
        text: this.$t("Dashboard.Printqueue.CreationTime").toString(),
        value: "creation_time",
        align: "start"
      },
      {
        text: this.$t("Dashboard.Printqueue.File").toString(),
        value: "filename",
        align: "start",
        sortable: false
      },
      {
        text: this.$t("Dashboard.Printqueue.Actions").toString(),
        value: "",
        align: "start",
        sortable: false
      }
    ];
    return headers;
  }
  get lastFileheaders() {
    const headers = [
      {
        text: this.$t("Dashboard.Printqueue.NameOfLast").toString(),
        value: "name",
        align: "start",
        sortable: false
      },
      {
        text: this.$t("Dashboard.Printqueue.Actions").toString(),
        value: "",
        align: "start",
        sortable: false
      }
    ];
    return headers;
  }
  showContextMenu(e, item) {
    if (!this.contextMenu.shown) {
      e?.preventDefault();
      this.contextMenu.shown = true;
      this.contextMenu.x = e?.clientX || e?.pageX || window.screenX / 2;
      this.contextMenu.y = e?.clientY || e?.pageY || window.screenY / 2;
      this.contextMenu.item = item;
      this.$nextTick(() => {
        this.contextMenu.shown = true;
      });
    }
  }
  deleteJob(item) {
    this.$emit("deleteJob", { id: item.id }, { action: "server/printjobs/getDeletedJobs" });
  }
  editJob(item) {
    this.createDialog.edit = true;
    Object.assign(this.createDialog.item, item);
    this.createDialog.bool = true;
  }
  startPrint(item) {
    this.$emit(
      "serverPrintjobsPostJob",
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
  printStateChanged(newVal) {
    if (["cancelled", "completed"].includes(this.printerInfo.printerState)) {
      this.isStartPrintPress = false;
    }
  }
  get isTablet() {
    return this.$vuetify.breakpoint.smAndUp && !this.isDesktop && !this.isWidescreen;
  }
  get isDesktop() {
    return this.$vuetify.breakpoint.lgAndUp && !this.isWidescreen;
  }
  get isWidescreen() {
    return this.$vuetify.breakpoint.xl;
  }
  setPriority(item, priority = "NORMAL") {
    item.priority = priority;
    this.updatePrintjob(item);
  }
  updatePrintjob(item) {
    this.$emit("updatePrintjob", item);
  }
  changePrintjobsSync(newVal) {
    this.createDialog.bool = false;
  }
  getPriorityNumber(priority) {
    if (priority === "HIGH")
      return 3;
    else if (priority === "NORMAL")
      return 2;
    else if (priority === "LOW")
      return 1;
    else
      return 0;
  }
  postDirectory(options, settings) {
    this.$emit("postDirectory", options, settings);
  }
  getDirectory(options, settings) {
    this.$emit("getDirectory", options, settings);
  }
  socketAddLoading(obj) {
    this.$emit("socketAddLoading", obj);
  }
  socketRemoveLoading(obj) {
    this.$emit("socketRemoveLoading", obj);
  }
  setGcodefilesMetadata(obj) {
    this.$emit("setGcodefilesMetadata", obj);
  }
  serverFilesMove(options, settings) {
    this.$emit("serverFilesMove", options, settings);
  }
  serverFilesCopy(options, settings) {
    this.$emit("serverFilesCopy", options, settings);
  }
  serverFilesMetadata(options, settings) {
    this.$emit("serverFilesMetadata", options, settings);
  }
  printerGcodeScript(options, settings) {
    this.$emit("printerGcodeScript", options, settings);
  }
  serverFilesDeleteFile(options, settings) {
    this.$emit("serverFilesDeleteFile", options, settings);
  }
  serverFilesDeleteDirectory(options, settings) {
    this.$emit("serverFilesDeleteDirectory", options, settings);
  }
  serverPrintjobsPostJob(options, settings) {
    this.$emit("serverPrintjobsPostJob", options, settings);
  }
};
__decorateClass([
  PropSync("printjobs", { type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "printjobsSync", 2);
__decorateClass([
  PropSync("last-printed", { type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "lastPrintedSync", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "loadings", 2);
__decorateClass([
  Prop({ type: Object, default: { free: 0, total: 0, used: 0 } })
], DashboardPrintQueue.prototype, "diskUsage", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "validGcodeExtensions", 2);
__decorateClass([
  Prop({ type: Object, default: () => {
    return { timezoneOffset: 0, apiUrl: "", isPanel: true };
  } })
], DashboardPrintQueue.prototype, "params", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        axisMode: "",
        printerIsPrinting: false,
        printerState: ""
      };
    }
  })
], DashboardPrintQueue.prototype, "printerInfo", 2);
__decorateClass([
  PropSync("options", {
    type: Object,
    default: () => {
      return {
        sortBy: ["modified"],
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
      };
    }
  })
], DashboardPrintQueue.prototype, "optionsSync", 2);
__decorateClass([
  PropSync("filesForCopyDialog", { type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "filesForCopyDialogSync", 2);
__decorateClass([
  Model("", { type: Array, default: () => [] })
], DashboardPrintQueue.prototype, "filetree", 2);
__decorateClass([
  Watch("printerInfo.printerState")
], DashboardPrintQueue.prototype, "printStateChanged", 1);
__decorateClass([
  Watch("printjobsSync")
], DashboardPrintQueue.prototype, "changePrintjobsSync", 1);
DashboardPrintQueue = __decorateClass([
  Component({
    name: "PrintQueue",
    components: {
      DashboardCreatePrintjobDialog
    }
  })
], DashboardPrintQueue);
export {
  DashboardPrintQueue as default
};
</script>

<style>
</style>
