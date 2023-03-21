<template>
  <div>
    <v-card
      :disabled="disabled"
      @dragover="dragOverUpload"
      @dragleave="dragLeaveUpload"
      @drop.prevent.stop="dragDropUpload"
    >
      <card-title
        icon="mdi-file-document-multiple-outline"
        :title="title"
        :closeable="closeable"
        @close="$emit('close', $event)"
      ></card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <text-input-keyboard
              v-model="search"
              append-icon="mdi-magnify"
              :label="searchTitle"
              outlined
              clearable
              hide-details
              dense
            ></text-input-keyboard>
          </v-col>
          <v-col cols="12" sm="5" md="4" offset-md="4" offset-sm="1">
            <input
              type="file"
              ref="fileUpload"
              style="display: none"
              multiple
              :accept="accept"
              @change="uploadFile"
            />
            <v-btn
              v-if="enableUpload"
              fab
              small
              depressed
              @click="clickUploadButton"
              :title="uploadTitle"
              color="primary"
              :loading="uploading"
              ><v-icon>mdi-upload</v-icon></v-btn
            >
            <v-btn
              icon
              @click="createDirectory"
              :title="createDirectoryTitle"
              color="primary"
              large
              class="ml-2"
              ><v-icon>mdi-folder-plus</v-icon></v-btn
            >
            <v-btn
              icon
              @click="refreshFileList"
              :title="refreshTitle"
              color="primary"
              large
              class="ml-2"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
            <v-menu offset-y :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  icon
                  large
                  class="ml-2"
                  v-bind="attrs"
                  v-on="on"
                  ><v-icon>mdi-dots-vertical</v-icon></v-btn
                >
              </template>
              <v-list>
                <v-list-item
                  v-for="header of configHeaders"
                  v-bind:key="header.value"
                >
                  <v-checkbox
                    class="mt-0"
                    hide-details
                    v-model="header.visible"
                    @change="changeHeaderVisible(header.value)"
                    :label="header.text"
                  ></v-checkbox>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text>
        <v-row>
          <v-col class="col-12 py-2 d-flex align-center">
            <span
              ><b>{{ pathTitle }}:</b> {{ visiblePath }}</span
            >
            <v-spacer></v-spacer>
            <slot name="usage" v-bind:usage="diskUsage">
              <template v-if="diskUsage !== null">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">
                      <b>{{ diskUsage.title }}:</b>
                      {{ $helpers.formatFilesize(diskUsage.free.value) }}
                    </span>
                  </template>
                  <span>
                    {{ diskUsage.used.title }}:
                    {{ $helpers.formatFilesize(diskUsage.used.value) }}<br />
                    {{ diskUsage.free.title }}:
                    {{ $helpers.formatFilesize(diskUsage.free.value) }}<br />
                    {{ diskUsage.total.title }}:
                    {{ $helpers.formatFilesize(diskUsage.total.value) }}
                  </span>
                </v-tooltip>
              </template>
            </slot>
          </v-col>
        </v-row>
      </v-card-text>
      <v-data-table
        :items="files"
        :headers="visibleHeaders"
        :custom-sort="$helpers.sortFiles"
        item-key="name"
        :search="search"
        :custom-filter="advancedSearch"
        mobile-breakpoint="0"
        @pagination="refreshMetadata"
        v-bind="$attrs"
        v-on="$listeners"
        ref="table"
      >
        <template slot="items">
          <td v-for="header in visibleHeaders" v-bind:key="header.value">
            {{ header.text }}
          </td>
        </template>

        <slot name="body.prepend">
          <template slot="body.prepend" v-if="pathSync !== rootSync">
            <tr
              class="file-list-cursor"
              @click="clickRowGoBack"
              @dragover="
                dragOverFilelist($event, { isDirectory: true, filename: '..' })
              "
              @dragleave="dragLeaveFilelist"
              @drop.prevent.stop="
                dragDropFilelist($event, { isDirectory: true, filename: '..' })
              "
            >
              <td class="pr-0 text-center" style="width: 32px">
                <v-icon>mdi-folder-upload</v-icon>
              </td>
              <td class="" :colspan="visibleHeaders.length">..</td>
            </tr>
          </template>
        </slot>
        <template #item="{ index, item }">
          <tr
            :key="`${index} ${item.filename}`"
            v-longpress:600="(e) => showContextMenu(e, item)"
            @contextmenu="showContextMenu($event, item)"
            @click="clickRow(item)"
            class="file-list-cursor user-select-none"
            :draggable="!isUsb(item)"
            @drag="dragFile($event, item)"
            @dragend="dragendFile($event)"
            @dragover="dragOverFilelist($event, item)"
            @dragleave="dragLeaveFilelist"
            @drop.prevent.stop="dragDropFilelist($event, item)"
            :data-name="item.filename"
          >
            <td class="pr-0 text-center" style="width: 32px">
              <template v-if="isUsb(item)">
                <v-icon :color="item.childrens.length > 0 ? 'primary' : ''"
                  >mdi-usb-flash-drive</v-icon
                >
              </template>
              <template v-else-if="item.isDirectory">
                <v-icon>mdi-folder</v-icon>
              </template>
              <template v-else>
                <template
                  v-if="getSmallThumbnail(item) && getBigThumbnail(item)"
                >
                  <v-tooltip
                    v-if="
                      !item.isDirectory &&
                      getSmallThumbnail(item) &&
                      getBigThumbnail(item)
                    "
                    top
                    content-class="tooltip__content-opacity1"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-img
                        :src="getSmallThumbnail(item)"
                        width="32"
                        height="32"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <template v-slot:placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-progress-circular
                              indeterminate
                              color="primary"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </template>
                    <span
                      ><v-img :src="getBigThumbnail(item)" width="250"
                    /></span>
                  </v-tooltip>
                </template>
                <template v-else-if="getSmallThumbnail(item)">
                  <v-img :src="getSmallThumbnail(item)" width="32" height="32">
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </template>
                <template v-else>
                  <v-icon>mdi-file</v-icon>
                </template>
              </template>
            </td>
            <td>{{ item.filename }}</td>
            <td
              class="text-no-wrap text-right"
              v-if="visibleHeaders.find((header) => header.value === 'size')"
            >
              {{ item.isDirectory ? "--" : $helpers.formatFilesize(item.size) }}
            </td>
            <td
              class="text-right"
              v-if="
                visibleHeaders.find((header) => header.value === 'modified')
              "
            >
              {{
                isUsb(item)
                  ? "--"
                  : $helpers.formatDate(item.modified, timeOffsetSecs / 3600)
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                visibleHeaders.find(
                  (header) => header.value === 'object_height'
                )
              "
            >
              {{
                item.object_height
                  ? item.object_height.toFixed(2) + " mm"
                  : "--"
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                visibleHeaders.find((header) => header.value === 'layer_height')
              "
            >
              {{
                item.layer_height ? item.layer_height.toFixed(2) + " mm" : "--"
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                visibleHeaders.find(
                  (header) => header.value === 'filament_total'
                )
              "
            >
              {{
                item.filament_total
                  ? item.filament_total.toFixed() + " mm"
                  : "--"
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                visibleHeaders.find(
                  (header) => header.value === 'estimated_time'
                )
              "
            >
              {{ $helpers.formatPrintTime(item.estimated_time) }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="visibleHeaders.find((header) => header.value === 'slicer')"
            >
              {{ item.slicer ? item.slicer : "--" }}<br /><small
                v-if="item.slicer_version"
                >{{ item.slicer_version }}</small
              >
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                visibleHeaders.find(
                  (header) => header.value === 'printing_mode'
                )
              "
            >
              {{
                "settings" in item &&
                "global_quality" in item.settings &&
                "printing_mode" in item.settings.global_quality.values &&
                item.settings
                  ? item.settings.global_quality.values.printing_mode
                  : "--"
              }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-overlay
        absolute
        z-index="9999999999"
        :opacity="dropzone.opacity"
        :style="`visibility:${dropzone.visibility ? 'visible' : 'hidden'}`"
      >
        <div>{{ dropzoneTitle }}</div>
      </v-overlay>
    </v-card>
    <v-snackbar
      :timeout="-1"
      :value="true"
      fixed
      right
      bottom
      color="primary"
      v-model="uploadSnackbar.status"
    >
      <span v-if="uploadSnackbar.max > 1" class="mr-1"
        >({{ uploadSnackbar.number }}/{{ uploadSnackbar.max }})</span
      ><strong>{{ snackbarTitle + " " + uploadSnackbar.filename }}</strong
      ><br />
      {{ Math.round(uploadSnackbar.percent) }} % @
      {{ $helpers.formatFilesize(Math.round(uploadSnackbar.speed)) }}/s<br />
      <v-progress-linear
        class="mt-2"
        color="secondary"
        :value="uploadSnackbar.percent"
      ></v-progress-linear>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="error"
          icon
          v-bind="attrs"
          @click="cancelUpload"
          style="min-width: auto"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-menu
      v-model="contextMenu.shown"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item
          @click="clickRow(contextMenu.item, true)"
          v-if="!contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-plus</v-icon> {{ createJobTitle }}
        </v-list-item>
        <v-list-item
          @click="downloadFile"
          v-if="!contextMenu.item.isDirectory && enableDownload"
        >
          <v-icon class="mr-1">mdi-download</v-icon>
          {{ downloadTitle }}
        </v-list-item>
        <v-list-item
          :disabled="isUsb(contextMenu.item)"
          @click="renameDirectory(contextMenu.item)"
          v-if="contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-rename-box</v-icon> {{ renameTitle }}
        </v-list-item>
        <v-list-item @click="renameFile(contextMenu.item)" v-else>
          <v-icon class="mr-1">mdi-rename-box</v-icon> {{ renameTitle }}
        </v-list-item>
        <v-list-item @click="removeFile" v-if="!contextMenu.item.isDirectory">
          <v-icon class="mr-1">mdi-delete</v-icon> {{ deleteTitle }}
        </v-list-item>
        <v-list-item
          :disabled="isUsb(contextMenu.item)"
          @click="deleteDirectory(contextMenu.item)"
          v-if="contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-delete</v-icon> {{ deleteTitle }}
        </v-list-item>

        <v-list-item @click="copyFile(contextMenu.item, 'copy')">
          <v-icon class="mr-1">mdi-content-copy</v-icon>
          {{ copyTitle }}
        </v-list-item>

        <v-list-item @click="copyFile(contextMenu.item, 'move')">
          <v-icon class="mr-1">mdi-file-move-outline</v-icon>
          {{ moveTitle }}
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="dialogCreateDirectory.show"
      max-width="400"
      :transition="false"
    >
      <v-card>
        <v-card-title class="headline">{{
          dialogCreateDirectory.title
        }}</v-card-title>
        <v-card-text>
          {{ dialogCreateDirectory.description }}
          <text-input-keyboard
            label="Name"
            :rules="dialogCreateDirectory.rules"
            @keypress.enter="createDirectoryAction"
            required
            outlined
            v-model="dialogCreateDirectory.name"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogCreateDirectory.show = false">{{
            cancelTitle
          }}</v-btn>
          <v-btn color="primary" text @click="createDirectoryAction">{{
            createDirectoryTitle
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogRenameFile.show"
      max-width="400"
      :transition="false"
    >
      <v-card>
        <v-card-title class="headline">{{ renameTitle }}</v-card-title>
        <v-card-text>
          <text-input-keyboard
            label="Name"
            required
            outlined
            v-model="dialogRenameFile.newName"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogRenameFile.show = false">{{
            cancelTitle
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="renameFileAction"
            @keypress.enter="renameFileAction"
            >{{ renameTitle }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogRenameDirectory.show"
      max-width="400"
      :transition="false"
    >
      <v-card>
        <v-card-title class="headline">{{ renameTitle }}</v-card-title>
        <v-card-text>
          <text-input-keyboard
            label="Name"
            required
            outlined
            v-model="dialogRenameDirectory.newName"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogRenameDirectory.show = false">{{
            cancelTitle
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="renameDirectoryAction"
            @keypress.enter="renameDirectoryAction"
            >{{ renameTitle }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDeleteDirectory.show"
      max-width="400"
      :transition="false"
    >
      <v-card>
        <v-card-title class="headline"
          >{{ deleteTitle }} :
          {{ dialogDeleteDirectory.item.filename }}</v-card-title
        >
        <v-card-text>
          <p class="mb-0">
            {{ confirmationTitle }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogDeleteDirectory.show = false">{{
            cancelTitle
          }}</v-btn>
          <v-btn
            color="error"
            text
            @click="deleteDirectoryAction"
            @keypress.enter="deleteDirectoryAction"
            >{{ deleteTitle }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="380" v-model="dialogPrintFile.show" :transition="false">
      <v-card>
        <v-card-title class="headline"
          >{{ createJobTitle }} :
          {{ dialogPrintFile.item.filename }}</v-card-title
        >
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-img
                  width="150"
                  class="mx-auto"
                  contain
                  v-if="getBigThumbnail(dialogPrintFile.item)"
                  :src="getBigThumbnail(dialogPrintFile.item)"
                ></v-img>
              </v-col>
              <v-col>
                <slot name="alert" v-bind:item="dialogPrintFile.item"></slot>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialogPrintFile.show = false"
            >{{ cancelTitle }}</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="startPrint(dialogPrintFile.item.filename)"
            >{{ createJobTitle }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="copyDialog.show" max-width="500" :transition="false">
      <v-card>
        <v-card-title class="headline"
          >{{ copyDialog.action === "copy" ? copyTitle : moveTitle }}
          {{ copyDialog.filename }}</v-card-title
        >
        <v-card-text>
          <template>
            <span>
              <b>{{ selectedPathTitle }} : {{ copyDialog.newPath }} </b>
            </span>
          </template>

          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-if="copyDialog.newPath !== rootSync" @click="upClick">
                  <td class="px-1"><v-icon>mdi-folder-upload</v-icon></td>
                  <td class="px-1">..</td>
                </tr>
                <tr
                  v-for="item in copyDialog.fileList"
                  :key="item.filename"
                  @click="clickCopyItem(item)"
                >
                  <template v-if="copyDialog.filename !== item.filename">
                    <td class="px-1">
                      <template v-if="isUsbInDialog(item)">
                        <v-icon>mdi-usb-flash-drive</v-icon>
                      </template>
                      <template v-else-if="item.isDirectory">
                        <v-icon>mdi-folder</v-icon>
                      </template>
                      <template v-else>
                        <v-icon>mdi-file</v-icon>
                      </template>
                    </td>
                    <td class="px-1">
                      {{ item.filename }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="" text @click="copyDialog.show = false">{{
            cancelTitle
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="copyFileAction"
            :disabled="!copyDialog.newPath"
            >{{ copyDialog.action === "copy" ? copyTitle : moveTitle }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, PropSync, Model } from 'nuxt-property-decorator'
import { Helpers } from '../plugins'
import { IParams, IPrinterInfo } from '../../types/common'
import { FileStateFile } from '../../types/helpers'
import CardTitle from '../components/CardTitle.vue'
import TextInputKeyboard from '../components/TextInputKeyboard.vue'
import longpress from "../plugins/longpress";
import { join } from 'path'

interface draggingFile {
  status: boolean
  item: FileStateFile
}
interface uploadSnackbar {
  status: boolean
  filename: string
  percent: number
  speed: number
  total: number
  number: number
  max: number
  cancelTokenSource: any
  lastProgress: {
    time: number
    loaded: number
  }
}
interface contextMenu {
  shown: boolean
  isDirectory: boolean
  touchTimer?: number
  x: number
  y: number
  item: FileStateFile
}
interface dialogPrintFile {
  show: boolean
  item: FileStateFile
}
interface dialogRenameObject {
  show: boolean
  newName: string
  item: FileStateFile
}
export interface dialogCopyObject {
  action: 'copy' | 'move'
  show: boolean
  filename: string
  currentPath: string
  newPath: string
  item: FileStateFile
  fileList: FileStateFile[]
}

export interface FileManagerHeader {
  text: string;
  value: string;
  align: string;
  configable: boolean;
  visible: boolean;
}

export interface DiskUsageInfo {
  title: string,
  free: {
    title: string,
    value: number
  },
  used: {
    title: string,
    value: number
  },
  total: {
    title: string,
    value: number
  }
}

@Component({
  name: "FileManager",
  components: {
    CardTitle,
    TextInputKeyboard
  },
  directives: {
    'longpress': longpress
  }
})
export default class FileManager extends Vue {
  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({ type: Boolean, default: false }) closeable!: boolean
  @Prop({ type: Boolean, default: true }) enableUpload!: boolean
  @Prop({ type: Boolean, default: true }) hasUsb!: boolean
  @Prop({ type: Boolean, default: true }) enablePrintDialog!: boolean
  @Prop({ type: Boolean, default: true }) enableDownload!: boolean
  @Prop({ type: Number, default: 0 }) timeOffsetSecs!: number
  @Prop({ type: Array, default: () => [] }) validGcodeExtensions!: string[]
  @Prop({ type: String, default: '' }) downloadUrl!: string
  @Prop({ type: String, default: '' }) uploadUrl!: string
  @Prop({ type: String, default: 'Search' }) searchTitle!: string
  @Prop({ type: String, default: 'Files' }) title!: string
  @Prop({ type: String, default: 'Upload File' }) uploadTitle!: string
  @Prop({ type: String, default: 'Create Directory' }) createDirectoryTitle!: string
  @Prop({ type: String, default: 'Create Printjob' }) createJobTitle!: string
  @Prop({ type: String, default: 'Refresh' }) refreshTitle!: string
  @Prop({ type: String, default: 'Download' }) downloadTitle!: string
  @Prop({ type: String, default: 'Rename' }) renameTitle!: string
  @Prop({ type: String, default: 'Delete' }) deleteTitle!: string
  @Prop({ type: String, default: 'Move' }) moveTitle!: string
  @Prop({ type: String, default: 'Copy' }) copyTitle!: string
  @Prop({ type: String, default: 'Selected Path' }) selectedPathTitle!: string
  @Prop({ type: String, default: 'Cancel' }) cancelTitle!: string
  @Prop({ type: String, default: 'Are you sure?' }) confirmationTitle!: string
  @Prop({ type: String, default: 'Drop files to upload' }) dropzoneTitle!: string
  @Prop({ type: String, default: 'Uploading' }) snackbarTitle!: string
  @PropSync('path', { type: String, default: 'gcodes' }) pathSync!: string
  @Prop({ type: String, default: 'Current Path' }) pathTitle!: string
  @PropSync('root', { type: String, default: 'gcodes' }) rootSync!: string
  @Prop({
    type: Array, default: (): FileManagerHeader[] => {
      return [
        { text: '', value: '', align: 'left', configable: false, visible: true },
        { text: 'Name', value: 'filename', align: 'left', configable: false, visible: true },
        { text: 'Filesize', value: 'size', align: 'right', configable: true, visible: true },
        { text: 'Last Modified', value: 'modified', align: 'right', configable: true, visible: true },
      ]
    }
  }) headers!: FileManagerHeader[]
  @Prop({
    type: Array, default: () => {
      return [
        "object_height",
        "layer_height",
        "filament_total",
        "filament_weight_total",
        "estimated_time",
        "slicer"
      ]
    }
  }) hiddenColums!: string[]
  @Prop({ type: Object, default: () => { return null } }) diskUsage!: DiskUsageInfo
  @Prop({ type: Array, default: () => [] }) filetree!: FileStateFile[]


  copyDialog: dialogCopyObject = {
    action: 'copy',
    show: false,
    filename: '',
    currentPath: '',
    newPath: '/',
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    },
    fileList: []
  }

  $refs!: {
    fileUpload: HTMLInputElement
    table: any
  }

  $helpers: Helpers;

  get accept () {
    return this.validGcodeExtensions.join(", ")
  }

  dropzone = {
    visibility: false,
    opacity: 0,
  }
  draggingFile: draggingFile = {
    status: false,
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  dragOverUpload (e: Event) {
    if (!this.draggingFile.status && this.enableUpload) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.dropzone.visibility = true
      this.dropzone.opacity = 1
    }
  }
  dragLeaveUpload (e: Event) {
    if (!this.draggingFile.status && this.enableUpload) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.dropzone.visibility = false
      this.dropzone.opacity = 0
    }
  }

  async dragDropUpload (e: any) {
    if (!this.draggingFile.status && this.enableUpload) {
      e.preventDefault()
      this.dropzone.visibility = false
      this.dropzone.opacity = 0
      if (e.dataTransfer.files.length) {
        this.uploading = true
        let successFiles = []
        this.uploadSnackbar.number = 0
        this.uploadSnackbar.max = e.dataTransfer.files.length
        for (const file of e.dataTransfer.files) {
          if (!this.validGcodeExtensions.includes(`.${file.name.split('.').pop()}`))
            continue
          this.uploadSnackbar.number++
          const result = await this.doUploadFile(file)
          successFiles.push(result)
        }
        this.uploading = false
        for (const file of successFiles) {
          this.$emit('uploaded', file)
        }
      }
    }
  }

  async uploadFile () {
    if (this.$refs.fileUpload.files?.length) {
      this.uploading = true
      let successFiles = []
      this.uploadSnackbar.number = 0
      this.uploadSnackbar.max = this.$refs.fileUpload.files.length
      for (const file of this.$refs.fileUpload.files) {
        this.uploadSnackbar.number++
        const result = await this.doUploadFile(file)
        successFiles.push(result)
      }
      this.uploading = false
      for (const file of successFiles) {
        this.$emit('uploaded', file)
      }
      this.$refs.fileUpload.value = ''
    }
  }

  uploadSnackbar: uploadSnackbar = {
    status: false,
    filename: "",
    percent: 0,
    speed: 0,
    total: 0,
    number: 0,
    max: 0,
    cancelTokenSource: {},
    lastProgress: {
      time: 0,
      loaded: 0
    }
  }

  uploading = false
  search = ''

  clickUploadButton () {
    this.$refs.fileUpload.click()
  }

  createDirectory () {
    this.dialogCreateDirectory.name = ""
    this.dialogCreateDirectory.show = true
  }

  refreshFileList () {
    this.$emit('refresh', this.pathSync)
  }

  get configHeaders () {
    return this.filteredHeaders.filter(header => header.configable)
  }

  get filteredHeaders () {
    return this.headers.map(h => {
      let res = Object.assign({}, h)
      if (h.visible && this.hiddenColums.includes(h.value)) {
        res.visible = false
      } else if (!h.visible && !this.hiddenColums.includes(h.value)) {
        res.visible = true
      }
      return res
    })
  }

  changeHeaderVisible (name: string) {
    if (this.headers.find(header => header.value === name)) {
      const value = this.headers.find(header => header.value === name)?.visible || false;
      this.$emit('changeHeaderVisible', { name, value })
    }
  }

  get visiblePath () {
    return this.pathSync !== this.rootSync ? this.pathSync.substring(this.rootSync.length) : '/'
  }

  files: FileStateFile[] | null = []

  get visibleHeaders () {
    return this.filteredHeaders.filter(h => h.visible)
  }

  advancedSearch (value: string | number, search: string) {
    return value != null &&
      search != null &&
      typeof value === 'string' &&
      value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
  }

  refreshMetadata (data: any) {
    let sortBy = 'modified'
    if (this.$attrs.options?.sortBy) {
      sortBy = this.$attrs.options.sortBy[0] ?? sortBy
    }
    if (this.$attrs.sortBy) {
      sortBy = typeof this.$attrs.sortBy === 'string' ? this.$attrs.sortBy : (this.$attrs.sortBy[0] ?? sortBy)
    }
    let sortDesc = false
    if (this.$attrs.options?.sortDesc) {
      sortDesc = this.$attrs.options.sortDesc[0] ?? sortDesc
    }
    if (this.$attrs.sortDesc) {
      sortDesc = typeof this.$attrs.sortDesc === 'boolean' ? this.$attrs.sortDesc : (this.$attrs.sortDesc[0] ?? sortDesc)
    }
    const items = this.$helpers.sortFiles(this.files, [sortBy], [sortDesc])
    for (let i = data.pageStart; i < data.pageStop; i++) {
      if (items[i] && !items[i].isDirectory && !items[i].metadataPulled) {
        let filename = join(this.visiblePath, items[i].filename)
        this.$emit('update:metadata', filename)
      }
    }
  }

  clickRowGoBack () {
    this.$emit('update:path', this.pathSync.substring(0, this.pathSync.lastIndexOf("/")))
  }
  dragOverFilelist (e: any, row: any) {
    if (this.draggingFile.status) {
      e.preventDefault()
      //e.stopPropagation()
      if (row.isDirectory) {
        e.target.parentElement.style.backgroundColor = this.$vuetify.theme.currentTheme.primary?.toString()
      }
    }
  }
  dragLeaveFilelist (e: any) {
    if (this.draggingFile.status) {
      e.preventDefault()
      e.stopPropagation()
      e.target.parentElement.style.backgroundColor = 'transparent'
    }
  }

  dragDropFilelist (e: any, row: any) {
    if (this.draggingFile.status) {
      e.preventDefault()
      e.target.parentElement.style.backgroundColor = 'transparent'
      let dest = "";
      if (row.filename === '..') {
        dest = this.pathSync.substring(0, this.pathSync.lastIndexOf("/") + 1) + this.draggingFile.item.filename
      } else dest = this.pathSync + "/" + row.filename + "/" + this.draggingFile.item.filename
      this.$emit('move', {
        source: this.pathSync + "/" + this.draggingFile.item.filename,
        dest: dest
      })
    }
  }

  contextMenu: contextMenu = {
    shown: false,
    isDirectory: false,
    touchTimer: undefined,
    x: 0,
    y: 0,
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  showContextMenu (e: any, item: FileStateFile) {
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

  async clickRow (item: FileStateFile, force = false) {
    if (!this.contextMenu.shown || force) {
      if (force) {
        this.contextMenu.shown = false;
      }
      if (!item.isDirectory) {
        if (!this.enablePrintDialog) {
          this.$emit('fileclick', this.pathSync,
            item)
        } else {
          this.dialogPrintFile.show = true;
          this.dialogPrintFile.item = item;
        }
      } else {
        this.$emit('update:path', this.pathSync + "/" + item.filename)
        await this.$nextTick()
        this.loadPath();
      }
    }
  }

  dialogPrintFile: dialogPrintFile = {
    show: false,
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  isUsb (item: FileStateFile) {
    return this.hasUsb && this.pathSync === this.rootSync && item.isDirectory && item.filename === 'USB'
  }
  isUsbInDialog (item: FileStateFile) {
    return this.hasUsb && this.copyDialog.currentPath === this.rootSync && item.isDirectory && item.filename === 'USB'
  }

  dragFile (e: Event, item: FileStateFile) {
    e.preventDefault();
    this.draggingFile.status = true;
    this.draggingFile.item = item;
  }
  dragendFile (e: Event) {
    e.preventDefault();
    this.draggingFile.status = false
    this.draggingFile.item = {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  getSmallThumbnail (item: FileStateFile) {
    if (item.thumbnails?.length) {
      const thumbnail = item.thumbnails.find(thumb =>
        thumb.width >= 32 && thumb.width <= 64 &&
        thumb.height >= 32 && thumb.height <= 64
      )
      if (thumbnail && 'relative_path' in thumbnail) return `${this.downloadUrl}/${this.pathSync}/${thumbnail.relative_path}?timestamp=${item.modified}`
    }
    return ""
  }
  getBigThumbnail (item: FileStateFile) {
    if (item.thumbnails?.length) {
      const thumbnail = item.thumbnails.find(thumb => thumb.width >= 300 && thumb.width <= 400)
      if (thumbnail && 'relative_path' in thumbnail) return `${this.downloadUrl}/${this.pathSync}/${thumbnail.relative_path}?timestamp=${item.modified}`
    }
    return ""
  }

  cancelUpload () {
    this.uploadSnackbar.cancelTokenSource.cancel()
    this.uploadSnackbar.status = false
    this.$refs.fileUpload.value = ''
  }

  downloadFile () {
    const filename = (this.pathSync + "/" + this.contextMenu.item.filename)
    const href = `${this.downloadUrl}/${encodeURI(filename)}`
    window.open(href)
  }

  dialogRenameDirectory: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  renameDirectory (item: FileStateFile) {
    this.dialogRenameDirectory.item = item
    this.dialogRenameDirectory.newName = item.filename
    this.dialogRenameDirectory.show = true
  }
  renameDirectoryAction () {
    this.dialogRenameDirectory.show = false
    this.$emit('move', {
      source: this.pathSync + "/" + this.dialogRenameDirectory.item.filename,
      dest: this.pathSync + "/" + this.dialogRenameDirectory.newName
    })
  }

  dialogRenameFile: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  renameFile (item: FileStateFile) {
    this.dialogRenameFile.item = item
    this.dialogRenameFile.newName = item.filename
    this.dialogRenameFile.show = true
  }
  renameFileAction () {
    this.dialogRenameFile.show = false
    this.$emit('move', {
      source: this.pathSync + "/" + this.dialogRenameFile.item.filename,
      dest: this.pathSync + "/" + this.dialogRenameFile.newName
    })
  }

  removeFile () {
    this.$emit('delete', this.pathSync + "/" + this.contextMenu.item.filename)
  }

  dialogDeleteDirectory: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }

  deleteDirectory (item: FileStateFile) {
    this.dialogDeleteDirectory.item = item
    this.dialogDeleteDirectory.show = true
  }
  deleteDirectoryAction () {
    this.dialogDeleteDirectory.show = false
    this.$emit('delete:dir', this.pathSync + "/" + this.contextMenu.item.filename, true)
  }



  copyFile (item: FileStateFile, action: 'copy' | 'move') {
    this.copyDialog.action = action
    this.copyDialog.show = true
    this.copyDialog.filename = item.filename
    this.copyDialog.currentPath = this.pathSync
    this.copyDialog.newPath = this.pathSync
    this.copyDialog.item = item
    // const dirArray = this.copyDialog.newPath.split("/")
    const dirArray = [this.rootSync, ...this.copyDialog.newPath.replace(this.rootSync, '').split("/")].filter((itm: string)=>itm.length);
    this.copyDialog.fileList = this.$helpers.findDirectory(this.filetree, dirArray) || []
    if (this.copyDialog.fileList.length !== 0) {
      this.copyDialog.fileList = this.copyDialog.fileList.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory))
    }
  }

  copyFileAction () {
    this.copyDialog.show = false
    if (this.copyDialog.action === 'copy') {
      this.$emit('copy', {
        source: this.copyDialog.currentPath + '/' + this.copyDialog.item.filename,
        dest: this.copyDialog.newPath + '/' + this.copyDialog.item.filename
      })
    } else if (this.copyDialog.action === 'move') {
      this.$emit('move', {
        source: this.copyDialog.currentPath + '/' + this.copyDialog.item.filename,
        dest: this.copyDialog.newPath + '/' + this.copyDialog.item.filename
      })
    }
    this.copyDialog.newPath = ''
    this.copyDialog.fileList = []
  }

  clickCopyItem (item: any) {
    if (item.isDirectory) {
      this.copyDialog.newPath += '/' + item.filename
      // const dirArray = this.copyDialog.newPath.split("/")
      const dirArray = [this.rootSync, ...this.copyDialog.newPath.replace(this.rootSync, '').split("/")].filter((itm: string)=>itm.length);
      this.copyDialog.fileList = this.$helpers.findDirectory(this.filetree, dirArray) || []
      if (this.copyDialog.fileList.length !== 0) {
        this.copyDialog.fileList = this.copyDialog.fileList.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory))
      }
    }
  }

  @Prop({
    type: Object, default: () => {
      return {
        show: false,
        name: "",
        title: "",
        description: '',
        rules: [
          (value: string) => value.indexOf(" ") === -1 || 'Name contains spaces!'
        ]
      }
    }
  }) dialogCreateDirectory!: any

  createDirectoryAction () {
    if (this.dialogCreateDirectory.name.length && this.dialogCreateDirectory.name.indexOf(" ") === -1) {
      this.dialogCreateDirectory.show = false
      this.$emit('create:dir', this.pathSync + "/" + this.dialogCreateDirectory.name)
    }
  }

  startPrint (filename = "") {
    filename = join(this.visiblePath, filename)
    this.dialogPrintFile.show = false
    this.$emit('start', filename)
  }

  upClick () {
    let arr = this.copyDialog.newPath.split('/')
    arr.length = arr.length - 1
    this.copyDialog.newPath = arr.join('/')
    const dirArray = [this.rootSync, ...this.copyDialog.newPath.replace(this.rootSync, '').split("/")].filter((itm: string)=>itm.length);
    this.copyDialog.fileList = this.$helpers.findDirectory(this.filetree, dirArray) || []
    if (this.copyDialog.fileList.length !== 0) {
      this.copyDialog.fileList = this.copyDialog.fileList.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory))
    }
  }

  created () {
    if (!this.$helpers) {
      this.$helpers = new Helpers()
    }
    this.loadPath()
  }
  loadPath () {
    this.$emit('refresh', this.pathSync)
    let dirArray = [this.rootSync, ...this.pathSync.replace(this.rootSync, '').split("/")].filter((itm: string)=>itm.length);
    console.log('loadPath', dirArray)
    this.files = this.$helpers.findDirectory(this.filetree, dirArray)
    if (this.files !== null) {
      this.files = this.files.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory))
    }
  }
  @Watch('filetree', { deep: true })
  filetreeChanged (newVal: FileStateFile[]) {
    let dirArray = [this.rootSync, ...this.pathSync.replace(this.rootSync, '').split("/")].filter((itm: string)=>itm.length);
    console.log('filetreeChanged', dirArray)
    this.files = this.$helpers.findDirectory(newVal, dirArray);
    if (this.files?.length) {
      this.files = this.files.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory));
    }
  }
  doUploadFile (file: File) {
    let formData = new FormData()
    let filename = file.name;
    filename = this.$helpers.cyrillicTransform(filename, "_");
    filename = filename.replace(/[^a-zA-Z0-9\.]/gi, "_");
    this.uploadSnackbar.filename = filename
    this.uploadSnackbar.status = true
    this.uploadSnackbar.percent = 0
    this.uploadSnackbar.speed = 0
    this.uploadSnackbar.lastProgress.loaded = 0
    this.uploadSnackbar.lastProgress.time = 0
    formData.append('file', file, (this.visiblePath + filename))
    return new Promise(resolve => {
      this.uploadSnackbar.cancelTokenSource = this.$axios.CancelToken.source();
      this.$axios.post(this.uploadUrl,
        formData, {
        cancelToken: this.uploadSnackbar.cancelTokenSource.token,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          this.uploadSnackbar.percent = (progressEvent.loaded * 100) / progressEvent.total
          if (this.uploadSnackbar.lastProgress.time) {
            const time = progressEvent.timeStamp - this.uploadSnackbar.lastProgress.time
            const data = progressEvent.loaded - this.uploadSnackbar.lastProgress.loaded
            if (time) this.uploadSnackbar.speed = data / (time / 1000)
          }
          this.uploadSnackbar.lastProgress.time = progressEvent.timeStamp
          this.uploadSnackbar.lastProgress.loaded = progressEvent.loaded
          this.uploadSnackbar.total = progressEvent.total
        }
      }
      ).then((result: any) => {
        const filename = result.data.item.path.substr(result.data.item.path.indexOf("/") + 1)
        this.uploadSnackbar.status = false
        resolve(filename)
      }).catch(() => {
        this.uploadSnackbar.status = false
        this.uploading = false
        this.$emit('upload:error', filename)
      })
    })
  }
}
</script>

<style scoped>
.v-data-table .file-list-cursor:hover {
  cursor: pointer;
}
</style>
