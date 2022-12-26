<template>
  <v-dialog
    v-model="createDialogSync.bool"
    persistent
    max-width="600"
    :transition="false"
  >
    <v-card>
      <card-title
        :icon="createDialogSync.edit ? 'mdi-pencil' : 'mdi-plus'"
        :title="
          'CreatePrintjobDialog ' + createDialogSync.edit
            ? $t('Dashboard.Printqueue.Edit')
            : $t('Dashboard.Printqueue.Create')
        "
        closeable
        @close="closeCreateDialog"
      />
      <v-form v-model="createDialogSync.valid">
        <v-container>
          <v-row no-gutters>
            <v-col cols="12">
              <text-input-keyboard
                :label="$t('Dashboard.Printqueue.Name')"
                outlined
                :rules="rules"
                v-model="createDialogSync.item.name"
              ></text-input-keyboard>
            </v-col>
            <v-col cols="12">
              <textarea-keyboard
                :label="$t('Dashboard.Printqueue.Description')"
                outlined
                auto-grow
                rows="6"
                v-model="createDialogSync.item.description"
              ></textarea-keyboard>
            </v-col>
            <v-col cols="12" v-if="createDialogSync.item.filename">
              <v-text-field
                :label="$t('Dashboard.Printqueue.Filename')"
                outlined
                readonly
                clearable
                :rules="rules"
                @click:clear="clearFileSelection"
                v-model="createDialogSync.item.filename"
              ></v-text-field>
            </v-col>
            <v-col cols="12" v-else>
              <v-dialog
                v-model="fileSelectorDialog.bool"
                persistent
                max-width="800"
                :transition="false"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    depressed
                    color="primary"
                    v-on="on"
                    v-bind="attrs"
                    block
                  >
                    {{ $t("Dashboard.Printqueue.SelectFile")
                    }}<v-icon right>mdi-plus</v-icon>
                  </v-btn></template
                >
                <file-manager
                  :loadings="loadings"
                  :disk-usage="diskUsage"
                  :valid-gcode-extensions="validGcodeExtensions"
                  :params="params"
                  :printer-info="printerInfo"
                  :current-path="`gcodes`"
                  v-model="filetree"
                  :options.sync="optionsSync"
                  :files-for-copy-dialog.sync="filesForCopyDialogSync"
                  :closeable="true"
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
                  @closeFileManagerDialog="closeFileManagerDialog"
                />
              </v-dialog>
            </v-col>
            <v-col cols="12">
              <v-alert
                class="my-0"
                dense
                outlined
                type="warning"
                v-if="
                  (printerInfo.axisMode === 'three' &&
                    printMode !== ('classic' && '')) ||
                  (printerInfo.axisMode === 'five' && printMode === 'classic')
                "
                >{{ $t("Dashboard.Printqueue.AnotherModule") }}</v-alert
              >
            </v-col>
            <v-col cols="12" class="my-2">
              <v-card outlined>
                <v-card-title class="body-1">
                  {{ $t("Dashboard.Printqueue.Priority") }}
                </v-card-title>
                <v-card-text>
                  <v-slider
                    v-model="selectedPriority"
                    :tick-labels="ticksLabels"
                    :max="3"
                    :min="0"
                    step="1"
                    ticks="always"
                    tick-size="4"
                    thumb-label="always"
                  >
                    <template v-slot:thumb-label="{ value }">
                      <v-icon :color="priorityIcons[value].color"
                        >{{ priorityIcons[value].icon }}
                      </v-icon>
                    </template>
                  </v-slider>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" v-if="createDialogSync.item.priority === 'DELAY'">
              <v-menu
                ref="menu"
                v-model="timePickerMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="delayTime"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    v-model="delayTime"
                    :label="$t('Dashboard.Printqueue.DelayTime')"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="timePickerMenu"
                  v-model="delayTime"
                  full-width
                  format="24hr"
                  @click:minute="$refs.menu.save(delayTime)"
                ></v-time-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" v-if="!createDialogSync.edit">
              <v-card outlined>
                <v-card-title class="body-1">
                  {{ $t("Dashboard.Printqueue.Copies") }}
                </v-card-title>
                <v-card-text>
                  <v-slider
                    v-model="copies"
                    thumb-label="always"
                    min="1"
                    max="20"
                  ></v-slider>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn text color="primary" @click="closeCreateDialog">
          {{ $t("Dashboard.Printqueue.Cancel") }}
        </v-btn>
        <v-btn
          outlined
          color="primary"
          @click="createPrintjob"
          :disabled="!createDialogSync.item.filename"
        >
          {{
            createDialogSync.edit
              ? $t("Dashboard.Printqueue.Edit")
              : $t("Dashboard.Printqueue.Create")
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
import { Vue, Component, Model, Prop, PropSync } from "nuxt-property-decorator";
import fileManager from "../FileManager.vue";
let DashboardCreatePrintjobDialog = class extends Vue {
  constructor() {
    super(...arguments);
    this.printMode = "";
    this.fileSelectorDialog = { bool: false };
    this.timePickerMenu = false;
    this.copies = 1;
    this.rules = [
      (value) => value !== "" || "required"
    ];
  }
  closeCreateDialog() {
    this.createDialogSync.bool = false;
    this.createDialogSync.edit = false;
    this.fileSelectorDialog.bool = false;
    this.createDialogSync.item = {
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
    };
  }
  clearFileSelection() {
    this.printMode = "";
    if (this.createDialogSync.item.name === `Print ${this.createDialogSync.item.filename}`) {
      this.createDialogSync.item.name = "";
    }
    this.createDialogSync.item.filename = "";
  }
  get ticksLabels() {
    return [
      this.$t("Dashboard.Printqueue.Delay"),
      this.$t("Dashboard.Printqueue.Low"),
      this.$t("Dashboard.Printqueue.Mid"),
      this.$t("Dashboard.Printqueue.High")
    ];
  }
  get selectedPriority() {
    const priority = this.createDialogSync.item.priority;
    if (priority === "HIGH")
      return 3;
    else if (priority === "NORMAL")
      return 2;
    else if (priority === "LOW")
      return 1;
    else
      return 0;
  }
  set selectedPriority(newVal) {
    if (newVal === 3)
      this.createDialogSync.item.priority = "HIGH";
    else if (newVal === 2)
      this.createDialogSync.item.priority = "NORMAL";
    else if (newVal === 1)
      this.createDialogSync.item.priority = "LOW";
    else if (newVal === 0)
      this.createDialogSync.item.priority = "DELAY";
  }
  get priorityIcons() {
    return [
      {
        icon: "mdi-clock",
        color: "accent lighten-4"
      },
      {
        icon: "mdi-chevron-double-down",
        color: "secondary"
      },
      {
        icon: "mdi-circle-double",
        color: "success lighten-4"
      },
      {
        icon: "mdi-chevron-double-up",
        color: "error lighten-4"
      }
    ];
  }
  get delayTime() {
    const time = this.createDialogSync.item.delay_time;
    let date = new Date();
    date.setHours(Math.floor(time / 60), time % 60);
    return `${date.getHours()}:${date.getMinutes()}`;
  }
  set delayTime(newVal) {
    const times = newVal.split(":").map((t) => parseInt(t));
    this.createDialogSync.item.delay_time = times[0] * 60 + times[1];
  }
  createPrintjob() {
    const item = { ...this.createDialogSync.item, copies: this.copies > 0 ? this.copies - 1 : 0 };
    if (this.createDialogSync.item.filename)
      this.$emit("serverPrintjobsPostJob", item, { action: "server/printjobs/getPrintjobs" });
    this.closeCreateDialog();
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
    this.createDialogSync.item.description = options.description;
    this.createDialogSync.item.filename = options.filename;
    this.createDialogSync.item.name = options.name;
  }
  closeFileManagerDialog() {
    this.fileSelectorDialog.bool = false;
  }
};
__decorateClass([
  Model("change")
], DashboardCreatePrintjobDialog.prototype, "createDialog", 2);
__decorateClass([
  PropSync("createDialog", {
    type: Object,
    default: () => {
      return { bool: false, edit: false, item: {}, valid: false };
    }
  })
], DashboardCreatePrintjobDialog.prototype, "createDialogSync", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], DashboardCreatePrintjobDialog.prototype, "loadings", 2);
__decorateClass([
  Prop({ type: Object, default: () => {
    return { free: 0, total: 0, used: 0 };
  } })
], DashboardCreatePrintjobDialog.prototype, "diskUsage", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], DashboardCreatePrintjobDialog.prototype, "validGcodeExtensions", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        timezoneOffset: 0,
        apiUrl: "",
        isPanel: true
      };
    }
  })
], DashboardCreatePrintjobDialog.prototype, "params", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        axisMode: "",
        printerIsPrinting: false
      };
    }
  })
], DashboardCreatePrintjobDialog.prototype, "printerInfo", 2);
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
], DashboardCreatePrintjobDialog.prototype, "optionsSync", 2);
__decorateClass([
  PropSync("filesForCopyDialog", { type: Array, default: () => [] })
], DashboardCreatePrintjobDialog.prototype, "filesForCopyDialogSync", 2);
__decorateClass([
  Model("", { type: Array, default: () => [] })
], DashboardCreatePrintjobDialog.prototype, "filetree", 2);
DashboardCreatePrintjobDialog = __decorateClass([
  Component({
    name: "CreatePrintjobDialog",
    components: {
      fileManager
    }
  })
], DashboardCreatePrintjobDialog);
export {
  DashboardCreatePrintjobDialog as default
};
</script>

<style>
</style>