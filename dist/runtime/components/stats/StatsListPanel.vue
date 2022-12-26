<template>
  <v-card>
    <card-title
      icon="mdi-file-document-multiple-outline"
      :title="$t('Statistics.PrintHistory')"
    ></card-title>
    <v-card-text>
      <!-- Header menu  -->
      <v-row>
        <v-col cols="12" sm="6" md="4" :id="'stats-history'">
          <text-input-keyboard
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('Statistics.History.Search')"
            outlined
            clearable
            hide-details
            dense
          >
          </text-input-keyboard>
        </v-col>
        <v-col cols="12" sm="3" md="2" offset-md="4" offset-sm="3">
          <v-btn
            :title="$t('Statistics.History.TitleRefreshHistory')"
            color="primary"
            @click="refreshHistory"
            icon
            ><v-icon>mdi-refresh</v-icon></v-btn
          >
          <v-menu
            :offset-y="true"
            :close-on-content-click="false"
            title="Setup current list"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                :title="$t('Statistics.History.TitleSettings')"
                v-bind="attrs"
                v-on="on"
                ><v-icon>mdi-cog</v-icon></v-btn
              >
            </template>
            <v-list>
              <template v-if="allPrintStatusArray.length">
                <v-list-item
                  v-for="status of allPrintStatusArray"
                  v-bind:key="status.key"
                >
                  <v-checkbox
                    hide-details
                    :input-value="status.showInTable"
                    @change="changeStatusVisible(status)"
                    :label="
                      $t('Statistics.History.ShowStatusName', {
                        name: status.name,
                        count: status.value,
                      })
                    "
                  ></v-checkbox>
                </v-list-item>
                <v-divider></v-divider>
              </template>
              <v-list-item
                v-for="header of configHeaders"
                v-bind:key="header.key"
              >
                <v-checkbox
                  hide-details
                  v-model="header.visible"
                  @change="changeColumnVisible(header.value)"
                  :label="header.text"
                ></v-checkbox>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            v-if="!isPanel"
            :title="$t('Statistics.History.DownloadHistoryCsv')"
            color="primary"
            @click="downloadCSV"
            icon
            ><v-icon>mdi-download</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <!--Print history table-->
    <v-data-table
      :items="jobs"
      class="files-table"
      :headers="filteredHeaders"
      :options="options"
      :custom-sort="sortFiles"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :items-per-page.sync="countPerPage"
      :footer-props="{
        itemsPerPageText: $t('Statistics.History.Jobs'),
        itemsPerPageAllText: $t('Statistics.History.AllJobs'),
        itemsPerPageOptions: [10, 25, 50, 100, -1],
      }"
      item-key="name"
      :search="search"
      :custom-filter="advancedSearch"
      mobile-breakpoint="0"
    >
      <!-- table headers-->
      <template slot="items" slot-scope="props">
        <td v-for="header in filteredHeaders" v-bind:key="header.text">
          {{ props.item[header.value] }}
        </td>
      </template>
      <template #no-data>
        <div class="text-center">{{ $t("Statistics.History.Empty") }}</div>
      </template>

      <template #item="{ index, item }">
        <tr
          :key="`${index} ${item.filename}`"
          v-longpress:600="(e) => showContextMenu(e, item)"
          @contextmenu="showContextMenu($event, item)"
          @click="clickRow(item, $event)"
          :class="
            'file-list-cursor user-select-none ' +
            (item.exists ? '' : 'text--disabled')
          "
        >
          <td class="pr-0 text-center" style="width: 32px">
            <template v-if="!item.exists">
              <v-icon class="text--disabled">mdi-file-cancel</v-icon>
            </template>
            <template
              v-else-if="getSmallThumbnail(item) && getBigThumbnail(item)"
            >
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <vue-load-image>
                    <img
                      slot="image"
                      :src="getSmallThumbnail(item)"
                      width="32"
                      height="32"
                      v-bind="attrs"
                      v-on="on"
                    />
                    <v-progress-circular
                      slot="preloader"
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                    <v-icon slot="error">mdi-file</v-icon>
                  </vue-load-image>
                </template>
                <span><img :src="getBigThumbnail(item)" width="250" /></span>
              </v-tooltip>
            </template>
            <template v-else-if="getSmallThumbnail(item)">
              <vue-load-image>
                <img
                  slot="image"
                  :src="getSmallThumbnail(item)"
                  width="32"
                  height="32"
                />
                <v-progress-circular
                  slot="preloader"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
                <v-icon slot="error">mdi-file</v-icon>
              </vue-load-image>
            </template>
            <template v-else>
              <v-icon>mdi-file</v-icon>
            </template>
          </td>
          <!-- Status cell -->
          <td class="text-center">
            <template
              v-if="isSwitch(item)"
              @click.prevent="changeStatus(item, $event)"
            >
              <v-select
                hide-details
                dense
                :value="item.status"
                :items="switchStatus"
                @change="changeStatus(item, $event)"
                append-icon=""
                style="width: 36px"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-icon>
                    <v-icon :color="item.color" v-text="item.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon :color="item.color" v-text="item.icon"></v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t(item.value) }}</span>
                  </v-tooltip>
                </template>
              </v-select>
            </template>

            <template v-else>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <v-icon
                      :color="getStatusColor(item.status)"
                      :disabled="!item.exists"
                      >{{ getStatusIcon(item.status) }}</v-icon
                    >
                  </span>
                </template>
                <span>{{ $t(item.status) }}</span>
              </v-tooltip>
            </template>
          </td>

          <td class="">{{ item.name }}</td>
          <td class="text-center">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  <v-icon
                    :color="getPriorityColor(item.priority)"
                    :disabled="!item.exists"
                    >{{ getPriorityIcon(item.priority) }}</v-icon
                  >
                </span>
              </template>
              <span>{{ item.priority.replace(/_/g, " ") }}</span>
            </v-tooltip>
          </td>
          <td class="">{{ item.filename }}</td>
          <td
            v-for="col in tableFields"
            v-bind:key="col.value"
            :class="col.outputType !== 'date' ? 'text-no-wrap' : ''"
          >
            {{ outputValue(col, item) }}
          </td>
          <td
            class=""
            v-if="headers.find((header) => header.value === 'slicer').visible"
          >
            {{
              "slicer" in item.metadata && item.metadata.slicer
                ? item.metadata.slicer
                : "--"
            }}
            <small
              v-if="
                'slicer_version' in item.metadata &&
                item.metadata.slicer_version
              "
              ><br />{{ item.metadata.slicer_version }}</small
            >
          </td>
          <td
            class=""
            v-if="
              headers.find((header) => header.value === 'printing_mode').visible
            "
          >
            {{
              $t(
                "PrintingModeName." +
                  getPrintingModeName(item.metadata.settings)
              )
            }}
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-menu
      v-model="contextMenu.shown"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item @click="clickRow(contextMenu.item, $event)">
          <v-icon class="mr-1">mdi-text-box-search</v-icon>
          {{ $t("Statistics.History.Details") }}
        </v-list-item>
        <v-list-item
          @click="startPrint(contextMenu.item)"
          v-if="contextMenu.item.exists"
        >
          <v-icon class="mr-1">mdi-printer</v-icon>
          {{ $t("Statistics.History.Reprint") }}
        </v-list-item>
        <v-list-item @click="deleteJob(contextMenu.item)">
          <v-icon class="mr-1">mdi-delete</v-icon>
          {{ $t("Statistics.History.Delete") }}
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="detailsDialog.boolShow"
      :max-width="600"
      :max-height="500"
      scrollable
      :transition="false"
    >
      <v-card>
        <card-title
          icon="mdi-update"
          :title="$t('Statistics.History.JobDetails')"
          closeable
          @close="detailsDialog.boolShow = false"
        ></card-title>
        <v-card-text class="pt-5" style="height: 350px">
          <v-row>
            <v-col>{{ $t("Statistics.History.Filename") }}</v-col>
            <v-col class="text-right">{{ detailsDialog.item.filename }}</v-col>
          </v-row>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'size' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.Filesize") }}</v-col>
              <v-col class="text-right">{{
                $helpers.formatFilesize(detailsDialog.item.metadata.size)
              }}</v-col>
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'modified' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.LastModified") }}</v-col>
              <v-col class="text-right">
                {{ formatDate(detailsDialog.item.metadata.modified) }}
              </v-col>
            </v-row>
          </template>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col>{{ $t("Statistics.History.Status") }}</v-col>
            <v-col class="text-right">{{ detailsDialog.item.status }}</v-col>
          </v-row>
          <v-divider class="my-3"></v-divider>
          <v-row>
            <v-col>{{ $t("Statistics.History.StartTime") }}</v-col>
            <v-col class="text-right">
              {{ formatDate(detailsDialog.item.start_time) }}
            </v-col>
          </v-row>
          <template
            v-if="
              'end_time' in detailsDialog.item &&
              detailsDialog.item.end_time > 0
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.EndTime") }}</v-col>
              <v-col class="text-right">
                {{ formatDate(detailsDialog.item.end_time) }}
              </v-col>
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'estimated_time' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.EstimatedTime") }}</v-col>
              <v-col class="text-right">{{
                $helpers.formatPrintTime(
                  detailsDialog.item.metadata.estimated_time
                )
              }}</v-col>
            </v-row>
          </template>
          <template v-if="detailsDialog.item.print_duration > 0">
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.PrintDuration") }}</v-col>
              <v-col class="text-right">{{
                $helpers.formatPrintTime(detailsDialog.item.print_duration)
              }}</v-col>
            </v-row>
          </template>
          <template v-if="detailsDialog.item.total_duration > 0">
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.TotalDuration") }}</v-col>
              <v-col class="text-right">{{
                $helpers.formatPrintTime(detailsDialog.item.total_duration)
              }}</v-col>
            </v-row>
          </template>
          <!-- <template
            v-if="
              'metadata' in detailsDialog.item &&
              'filament_total' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{
                $t("Statistics.History.EstimatedFilamentWeight")
              }}</v-col>
              <v-col class="text-right"
                >{{
                  Math.round(
                    detailsDialog.item.metadata.filament_weight_total * 100
                  ) / 100
                }}
                g</v-col
              >
            </v-row>
          </template> -->
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'filament_total' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.EstimatedFilament") }}</v-col>
              <v-col class="text-right"
                >{{
                  Math.round(detailsDialog.item.metadata.filament_total)
                }}
                mm</v-col
              >
            </v-row>
          </template>
          <template v-if="detailsDialog.item.filament_used > 0">
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.FilamentUsed") }}</v-col>
              <v-col class="text-right"
                >{{ Math.round(detailsDialog.item.filament_used) }} mm</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'first_layer_extr_temp' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.FirstLayerExtTemp") }}</v-col>
              <v-col class="text-right"
                >{{
                  detailsDialog.item.metadata.first_layer_extr_temp
                }}
                °C</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'first_layer_bed_temp' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.FirstLayerBedTemp") }}</v-col>
              <v-col class="text-right"
                >{{
                  detailsDialog.item.metadata.first_layer_bed_temp
                }}
                °C</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'first_layer_height' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.FirstLayerHeight") }}</v-col>
              <v-col class="text-right"
                >{{ detailsDialog.item.metadata.first_layer_height }} mm</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'layer_height' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.LayerHeight") }}</v-col>
              <v-col class="text-right"
                >{{ detailsDialog.item.metadata.layer_height }} mm</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'object_height' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.ObjectHeight") }}</v-col>
              <v-col class="text-right"
                >{{ detailsDialog.item.metadata.object_height }} mm</v-col
              >
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'slicer' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.Slicer") }}</v-col>
              <v-col class="text-right">{{
                detailsDialog.item.metadata.slicer
              }}</v-col>
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'slicer_version' in detailsDialog.item.metadata
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.SlicerVersion") }}</v-col>
              <v-col class="text-right">{{
                detailsDialog.item.metadata.slicer_version
              }}</v-col>
            </v-row>
          </template>
          <template
            v-if="
              'metadata' in detailsDialog.item &&
              'settings' in detailsDialog.item.metadata &&
              'printing_mode' in
                detailsDialog.item.metadata.settings.global_quality.values
            "
          >
            <v-divider class="my-3"></v-divider>
            <v-row>
              <v-col>{{ $t("Statistics.History.PrintingMode") }}</v-col>
              <v-col class="text-right">{{
                $t(
                  "PrintingModeName." +
                    getPrintingModeName(detailsDialog.item.metadata.settings)
                )
              }}</v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import { Vue, Component, Prop, PropSync } from "nuxt-property-decorator";
let StatsListPanel = class extends Vue {
  constructor() {
    super(...arguments);
    this.search = "";
    this.options = {};
    this.sortBy = "start_time";
    this.sortDesc = true;
    this.contextMenu = {
      shown: false,
      touchTimer: void 0,
      x: 0,
      y: 0,
      item: {}
    };
    this.detailsDialog = {
      item: {},
      boolShow: false
    };
    this.textCSV = "";
  }
  refreshHistory() {
    this.$emit(
      "refreshHistory",
      { start: 0, limit: 50 },
      { action: "server/printjobs/getPrintjobs" }
    );
  }
  get configHeaders() {
    return this.headers.filter((header) => header.configable === true);
  }
  get headers() {
    const headers = [
      {
        text: "",
        value: "",
        align: "left",
        configable: false,
        visible: true,
        filterable: false
      },
      {
        text: "",
        value: "status",
        align: "left",
        configable: false,
        visible: true,
        filterable: false
      },
      {
        text: this.$t("Statistics.History.Name"),
        value: "name",
        align: "left",
        configable: false,
        visible: true
      },
      {
        text: "",
        value: "priority",
        align: "left",
        configable: false,
        visible: true
      },
      {
        text: this.$t("Statistics.History.Filename"),
        value: "filename",
        align: "left",
        configable: false,
        visible: true
      },
      {
        text: this.$t("Statistics.History.Filesize"),
        value: "size",
        align: "left",
        configable: true,
        visible: true,
        outputType: "filesize"
      },
      {
        text: this.$t("Statistics.History.LastModified"),
        value: "modified",
        align: "left",
        configable: true,
        visible: true,
        outputType: "date"
      },
      {
        text: this.$t("Statistics.History.StartTime"),
        value: "start_time",
        align: "left",
        configable: true,
        visible: true,
        outputType: "date"
      },
      {
        text: this.$t("Statistics.History.EndTime"),
        value: "end_time",
        align: "left",
        configable: true,
        visible: true,
        outputType: "date"
      },
      {
        text: this.$t("Statistics.History.EstimatedTime"),
        value: "estimated_time",
        align: "left",
        configable: true,
        visible: true,
        outputType: "time"
      },
      {
        text: this.$t("Statistics.History.PrintTime"),
        value: "print_duration",
        align: "left",
        configable: true,
        visible: true,
        outputType: "time"
      },
      {
        text: this.$t("Statistics.History.TotalTime"),
        value: "total_duration",
        align: "left",
        configable: true,
        visible: true,
        outputType: "time"
      },
      {
        text: this.$t("Statistics.History.FilamentCalc"),
        value: "filament_total",
        align: "left",
        configable: true,
        visible: true,
        outputType: "length"
      },
      {
        text: this.$t("Statistics.History.FilamentUsed"),
        value: "filament_used",
        align: "left",
        configable: true,
        visible: true,
        outputType: "length"
      },
      {
        text: this.$t("Statistics.History.FirstLayerExtTemp"),
        value: "first_layer_extr_temp",
        align: "left",
        configable: true,
        visible: true,
        outputType: "temp"
      },
      {
        text: this.$t("Statistics.History.FirstLayerBedTemp"),
        value: "first_layer_bed_temp",
        align: "left",
        configable: true,
        visible: true,
        outputType: "temp"
      },
      {
        text: this.$t("Statistics.History.FirstLayerHeight"),
        value: "first_layer_height",
        align: "left",
        configable: true,
        visible: true,
        outputType: "length"
      },
      {
        text: this.$t("Statistics.History.LayerHeight"),
        value: "layer_height",
        align: "left",
        configable: true,
        visible: true,
        outputType: "length"
      },
      {
        text: this.$t("Statistics.History.ObjectHeight"),
        value: "object_height",
        align: "left",
        configable: true,
        visible: true,
        outputType: "length"
      },
      {
        text: this.$t("Statistics.History.Slicer"),
        value: "slicer",
        align: "left",
        configable: true,
        visible: true
      },
      {
        text: this.$t("Statistics.History.PrintingMode"),
        value: "printing_mode",
        align: "left",
        configable: true,
        visible: true
      }
    ];
    headers.forEach((header) => {
      if (header.visible && this.hideColumsSync.includes(header.value)) {
        header.visible = false;
      } else if (!header.visible && !this.hideColumsSync.includes(header.value)) {
        header.visible = true;
      }
    });
    return headers;
  }
  get filteredHeaders() {
    return this.headers.filter((header) => header.visible === true);
  }
  sortFiles(items, sortBy, sortDesc) {
    const sortByClean = sortBy.length ? sortBy[0] : "filename";
    const sortDescClean = sortDesc[0];
    if (items !== void 0) {
      items.sort(function(a, b) {
        if (a[sortByClean] === b[sortByClean])
          return 0;
        if (a[sortByClean] === null || a[sortByClean] === void 0)
          return -1;
        if (b[sortByClean] === null || b[sortByClean] === void 0)
          return 1;
        if (a[sortByClean].constructor === String && b[sortByClean].constructor === String) {
          return a[sortByClean].localeCompare(b[sortByClean], void 0, {
            sensivity: "base"
          });
        }
        if (a[sortByClean] instanceof Array && b[sortByClean] instanceof Array) {
          const reducedA = a[sortByClean].length ? a.filament.reduce((a2, b2) => a2 + b2) : 0;
          const reducedB = b[sortByClean].length ? b.filament.reduce((a2, b2) => a2 + b2) : 0;
          return reducedA - reducedB;
        }
        return a[sortByClean] - b[sortByClean];
      });
      if (sortDescClean)
        items.reverse();
    }
    return items;
  }
  advancedSearch(value, search) {
    return value != null && search != null && value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1;
  }
  changeStatusVisible(status) {
    if (status.showInTable) {
      this.$emit("hideStatusInHistoryList", status.name);
    } else {
      this.$emit("showStatusInHistoryList", status.name);
    }
  }
  changeColumnVisible(name) {
    if (this.headers.filter((header) => header.value === name).length) {
      let value = this.headers.filter((header) => header.value === name)[0].visible;
      this.$emit("setHistoryColumns", { name, value });
    }
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
  clickRow(item, e) {
    this.detailsDialog.item = item;
    const classList = Array.from(e.target.classList);
    this.detailsDialog.boolShow = this.isSwitch(item) && (classList.includes("mdi") || classList.includes("v-list-item__title")) ? false : true;
  }
  getSmallThumbnail(item) {
    if ("metadata" in item && "thumbnails" in item.metadata && item.metadata.thumbnails.length) {
      const thumbnail = item.metadata.thumbnails.find(
        (thumb) => thumb.width >= 32 && thumb.width <= 64 && thumb.height >= 32 && thumb.height <= 64
      );
      let relative_url = "";
      if (item.filename.lastIndexOf("/") !== -1) {
        relative_url = item.filename.substr(
          0,
          item.filename.lastIndexOf("/") + 1
        );
      }
      if (thumbnail && "relative_path" in thumbnail)
        return this.apiUrl + "/server/files/gcodes/" + relative_url + thumbnail.relative_path + "?timestamp=" + item.metadata.modified;
    }
    return false;
  }
  getBigThumbnail(item) {
    if ("metadata" in item && "thumbnails" in item.metadata && item.metadata.thumbnails.length) {
      const thumbnail = item.metadata.thumbnails.find(
        (thumb) => thumb.width >= 300 && thumb.width <= 400
      );
      let relative_url = "";
      if (item.filename.lastIndexOf("/") !== -1) {
        relative_url = item.filename.substr(
          0,
          item.filename.lastIndexOf("/") + 1
        );
      }
      if (thumbnail && "relative_path" in thumbnail)
        return this.apiUrl + "/server/files/gcodes/" + relative_url + thumbnail.relative_path + "?timestamp=" + item.metadata.modified;
    }
    return false;
  }
  getThumbnailWidth(item) {
    if (this.getBigThumbnail(item)) {
      const thumbnail = item.metadata.thumbnails.find(
        (thumb) => thumb.width >= 300 && thumb.width <= 400
      );
      if (thumbnail)
        return thumbnail.width;
    }
    return 400;
  }
  startPrint(item) {
    this.$emit(
      "printjobsPostJob",
      {
        name: item.name,
        description: item.description,
        filename: item.filename,
        priority: item.priority
      },
      { action: "switchToDashboard" }
    );
  }
  deleteJob(item) {
    this.$emit(
      "printjobsDeleteJob",
      { id: item.id },
      { action: "server/printjobs/getDeletedJobs" }
    );
  }
  getStatusIcon(status) {
    return this.statusInfo.filter((itm) => itm.status === status)[0]["icon"];
  }
  getStatusColor(status) {
    return this.statusInfo.filter((itm) => itm.status === status)[0]["color"];
  }
  getPriorityIcon(priority) {
    return this.priorityInfo.filter((itm) => itm.priority === priority)[0]["icon"];
  }
  getPriorityColor(priority) {
    return this.priorityInfo.filter((itm) => itm.priority === priority)[0]["color"];
  }
  get tableFields() {
    return this.filteredHeaders.filter(
      (col) => !["name", "priority", "filename", "status", "slicer", "printing_mode"].includes(
        col.value
      ) && col.value !== ""
    );
  }
  outputValue(col, item) {
    let value = col.value in item ? item[col.value] : null;
    if (value === null)
      value = col.value in item.metadata ? item.metadata[col.value] : null;
    if (value > 0) {
      switch (col.outputType) {
        case "filesize":
          return this.$helpers.formatFilesize(value);
        case "date":
          return this.formatDate(value);
        case "time":
          return this.$helpers.formatPrintTime(value);
        case "temp":
          return value.toFixed() + " \xB0C";
        case "length":
          return this.$helpers.formatLength(value);
        default:
          return value;
      }
    } else
      return "--";
  }
  formatDate(date) {
    const tmp2 = new Date(date * 1e3);
    return tmp2.toLocaleString().replace(",", "");
  }
  get switchStatus() {
    return [
      {
        text: "Completed",
        icon: "mdi-checkbox-marked-circle-outline",
        value: "completed",
        color: "green"
      },
      {
        text: "Failed",
        icon: "mdi-close-circle-outline",
        value: "failed",
        color: "red"
      }
    ];
  }
  isSwitch(item) {
    const even = (el) => el.value === item.status;
    return this.switchStatus.some(even);
  }
  changeStatus(item, e) {
    this.$emit(
      "printjobsPostJob",
      {
        id: item.id,
        name: item.name,
        description: item.description,
        status: e,
        filename: item.filename
      },
      { action: "server/printjobs/getPrintjobs" }
    );
  }
  downloadCSV() {
    this.headerToCsv();
    this.tableToCSV();
    let href = "data:text/csv;charset=utf-8,\uFEFF" + this.textCSV;
    var link = document.createElement("a");
    link.setAttribute("href", href);
    var date = new Date();
    var filename = "print_history_" + date.getTime();
    link.setAttribute("download", filename + ".csv");
    link.click();
  }
  headerToCsv() {
    this.textCSV = this.filteredHeaders.filter((item) => item.text !== "").map((item) => item.text).join(";") + "\n";
  }
  tableToCSV() {
    let notEmptyHeaders = this.filteredHeaders.filter((item) => item.text !== "");
    this.jobs.forEach((item) => {
      let str = "";
      notEmptyHeaders.forEach((header) => {
        if (!header.outputType) {
          str += (item[header.value] || item.metadata[header.value] || this.$t("PrintingModeName." + this.getPrintingModeName(item.metadata.settings))) + ";";
        } else {
          str += this.outputValue(header, item) + "; ";
        }
      });
      this.textCSV += str + "\n";
    });
  }
  getPrintingModeName(settings) {
    return settings?.global_quality?.values?.printing_mode ?? "--";
  }
};
__decorateClass([
  Prop({ type: String, default: "" })
], StatsListPanel.prototype, "apiUrl", 2);
__decorateClass([
  Prop({ type: Boolean, default: false })
], StatsListPanel.prototype, "isPanel", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsListPanel.prototype, "allPrintStatusArray", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsListPanel.prototype, "jobs", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsListPanel.prototype, "statusInfo", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsListPanel.prototype, "priorityInfo", 2);
__decorateClass([
  PropSync("hideColums", { type: Array, default: () => [""] })
], StatsListPanel.prototype, "hideColumsSync", 2);
__decorateClass([
  PropSync("countPerPage", { type: Number, default: 10 })
], StatsListPanel.prototype, "countPerPageSync", 2);
StatsListPanel = __decorateClass([
  Component({
    name: "StatsListPanel"
  })
], StatsListPanel);
export {
  StatsListPanel as default
};
</script>

<style>
</style>
