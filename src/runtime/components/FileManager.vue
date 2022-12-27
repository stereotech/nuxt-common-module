<template>
  <div>
    <v-card
      :disabled="loadings.includes('fileMoving')"
      @dragover="dragOverUpload"
      @dragleave="dragLeaveUpload"
      @drop.prevent.stop="dragDropUpload"
    >
      <card-title
        icon="mdi-file-document-multiple-outline"
        :title="$t('Files.GCodeFiles')"
        :closeable="closeable"
        @close="$emit('closeFileManagerDialog', $event)"
      ></card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4" :id="'files-toppanel'">
            <text-input-keyboard
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('Files.Search')"
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
              :accept="validGcodeExtensions"
              @change="uploadFile"
            />
            <v-btn
              v-if="!params.isPanel"
              fab
              small
              depressed
              @click="clickUploadButton"
              :title="$t('Files.UploadNewGcode')"
              color="primary"
              :loading="loadings.includes('gcodeUpload')"
              ><v-icon>mdi-upload</v-icon></v-btn
            >
            <v-btn
              icon
              @click="createDirectory"
              :title="$t('Files.CreateNewDirectory')"
              color="primary"
              large
              class="ml-2"
              ><v-icon>mdi-folder-plus</v-icon></v-btn
            >
            <v-btn
              icon
              @click="refreshFileList"
              :title="$t('Files.RefreshCurrentDirectory')"
              color="primary"
              large
              class="ml-2"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
            <v-menu
              offset-y
              :close-on-content-click="false"
              :title="$t('Files.SetupCurrentList')"
            >
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
                  v-bind:key="header.key"
                >
                  <v-checkbox
                    class="mt-0"
                    hide-details
                    v-model="header.visible"
                    @change="changeMetadataVisible(header.value)"
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
              ><b>{{ $t("Files.CurrentPath") }}:</b>
              {{
                currentPath !== initialPath
                  ? "/" + this.currentPath.substring(7)
                  : "/"
              }}</span
            >
            <v-spacer></v-spacer>
            <template v-if="this.diskUsage !== null">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    <b>{{ $t("Files.FreeDisk") }}:</b>
                    {{ $helpers.formatFilesize(diskUsage.free) }}
                  </span>
                </template>
                <span>
                  {{ $t("Files.Used") }}:
                  {{ $helpers.formatFilesize(this.diskUsage.used) }}<br />
                  {{ $t("Files.Free") }}:
                  {{ $helpers.formatFilesize(this.diskUsage.free) }}<br />
                  {{ $t("Files.Total") }}:
                  {{ $helpers.formatFilesize(this.diskUsage.total) }}
                </span>
              </v-tooltip>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
      <v-data-table
        :items="files"
        :headers="filteredHeaders"
        :custom-sort="$helpers.sortFiles"
        :footer-props="{
          itemsPerPageText: $t('Files.Files'),
          itemsPerPageAllText: $t('Files.AllFiles'),
          itemsPerPageOptions: [5, 10, 15, 20, 25],
        }"
        item-key="name"
        :search="search"
        :custom-filter="advancedSearch"
        mobile-breakpoint="0"
        @pagination="refreshMetadata"
        :id="'files-main'"
        :options.sync="optionsSync"
      >
        <template slot="items">
          <td v-for="header in filteredHeaders" v-bind:key="header.value">
            {{ header.text }}
          </td>
        </template>

        <template #no-data>
          <div class="text-center">{{ $t("Files.Empty") }}</div>
        </template>

        <template slot="body.prepend" v-if="currentPath !== initialPath">
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
            <td class="" :colspan="filteredHeaders.length">..</td>
          </tr>
        </template>

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
                <template v-else>
                  <v-icon>mdi-file</v-icon>
                </template>
              </template>
            </td>
            <td>{{ item.filename }}</td>
            <td
              class="text-no-wrap text-right"
              v-if="headers.find((header) => header.value === 'size').visible"
            >
              {{ item.isDirectory ? "--" : $helpers.formatFilesize(item.size) }}
            </td>
            <td
              class="text-right"
              v-if="
                headers.find((header) => header.value === 'modified').visible
              "
            >
              {{
                isUsb(item)
                  ? "--"
                  : $helpers.formatDate(item.modified, params.timezoneOffset)
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                headers.find((header) => header.value === 'object_height')
                  .visible
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
                headers.find((header) => header.value === 'layer_height')
                  .visible
              "
            >
              {{
                item.layer_height ? item.layer_height.toFixed(2) + " mm" : "--"
              }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                headers.find((header) => header.value === 'filament_total')
                  .visible
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
                headers.find((header) => header.value === 'estimated_time')
                  .visible
              "
            >
              {{ $helpers.formatPrintTime(item.estimated_time) }}
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="headers.find((header) => header.value === 'slicer').visible"
            >
              {{ item.slicer ? item.slicer : "--" }}<br /><small
                v-if="item.slicer_version"
                >{{ item.slicer_version }}</small
              >
            </td>
            <td
              class="text-no-wrap text-right"
              v-if="
                headers.find((header) => header.value === 'printing_mode')
                  .visible
              "
            >
              {{
                "settings" in item &&
                "global_quality" in item.settings &&
                "printing_mode" in item.settings.global_quality.values &&
                item.settings
                  ? $t(
                      "PrintingModeName." +
                        item.settings.global_quality.values.printing_mode
                    )
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
        <div>{{ $t("Files.DropFilesToAddGcode") }}</div>
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
      ><strong>{{
        $t("Files.Uploading") + " " + uploadSnackbar.filename
      }}</strong
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
          <v-icon class="mr-1">mdi-plus</v-icon> {{ $t("Files.CreateJob") }}
        </v-list-item>
        <v-list-item
          @click="downloadFile"
          v-if="!contextMenu.item.isDirectory && !params.isPanel"
        >
          <v-icon class="mr-1">mdi-download</v-icon>
          {{ $t("Files.Download") }}
        </v-list-item>
        <v-list-item
          :disabled="isUsb(contextMenu.item)"
          @click="renameDirectory(contextMenu.item)"
          v-if="contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-rename-box</v-icon> {{ $t("Files.Rename") }}
        </v-list-item>
        <v-list-item
          @click="renameFile(contextMenu.item)"
          v-if="!contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-rename-box</v-icon> {{ $t("Files.Rename") }}
        </v-list-item>
        <v-list-item @click="removeFile" v-if="!contextMenu.item.isDirectory">
          <v-icon class="mr-1">mdi-delete</v-icon> {{ $t("Files.Delete") }}
        </v-list-item>
        <v-list-item
          :disabled="isUsb(contextMenu.item)"
          @click="deleteDirectory(contextMenu.item)"
          v-if="contextMenu.item.isDirectory"
        >
          <v-icon class="mr-1">mdi-delete</v-icon> {{ $t("Files.Delete") }}
        </v-list-item>

        <v-list-item @click="copyFile(contextMenu.item, 'copy')">
          <v-icon class="mr-1">mdi-content-copy</v-icon>
          {{ $t("Files.Copy") }}
        </v-list-item>

        <v-list-item @click="copyFile(contextMenu.item, 'move')">
          <v-icon class="mr-1">mdi-file-move-outline</v-icon>
          {{ $t("Files.Move") }}
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
          $t("Files.NewDirectory")
        }}</v-card-title>
        <v-card-text>
          {{ $t("Files.PleaseEnterANewDirectoryName") }}
          <text-input-keyboard
            label="Name"
            :rules="input_rules"
            @keypress.enter="createDirectoryAction"
            required
            outlined
            v-model="dialogCreateDirectory.name"
            ref="inputFieldCreateDirectory"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogCreateDirectory.show = false">{{
            $t("Files.Cancel")
          }}</v-btn>
          <v-btn color="primary" text @click="createDirectoryAction">{{
            $t("Files.Create")
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
        <v-card-title class="headline">{{
          $t("Files.RenameFile")
        }}</v-card-title>
        <v-card-text>
          <text-input-keyboard
            :label="$t('Files.Name')"
            required
            outlined
            v-model="dialogRenameFile.newName"
            ref="inputFieldRenameFile"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogRenameFile.show = false">{{
            $t("Files.Cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="renameFileAction"
            @keypress.enter="renameFileAction"
            >{{ $t("Files.Rename") }}</v-btn
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
        <v-card-title class="headline">{{
          $t("Files.RenameDirectory")
        }}</v-card-title>
        <v-card-text>
          <text-input-keyboard
            label="Name"
            required
            outlined
            v-model="dialogRenameDirectory.newName"
            ref="inputFieldRenameDirectory"
          ></text-input-keyboard>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogRenameDirectory.show = false">{{
            $t("Files.Cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="renameDirectoryAction"
            @keypress.enter="renameDirectoryAction"
            >{{ $t("Files.Rename") }}</v-btn
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
        <v-card-title class="headline">{{
          $t("Files.DeleteDirectory")
        }}</v-card-title>
        <v-card-text>
          <p class="mb-0">
            {{
              $t("Files.DeleteDirectoryQuestion", {
                name: dialogDeleteDirectory.item.filename,
              })
            }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="" text @click="dialogDeleteDirectory.show = false">{{
            $t("Files.Cancel")
          }}</v-btn>
          <v-btn
            color="error"
            text
            @click="deleteDirectoryAction"
            @keypress.enter="deleteDirectoryAction"
            >{{ $t("Files.Delete") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="380" v-model="dialogPrintFile.show" :transition="false">
      <v-card>
        <v-card-title class="headline">{{ $t("Files.StartJob") }}</v-card-title>
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
                <v-alert
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
            </v-row>
          </v-container>

          {{
            $t("Files.DoYouWantToStartFilename", [
              dialogPrintFile.item.filename,
            ])
          }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            text
            @click="dialogPrintFile.show = false"
            >{{ $t("Files.No") }}</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="startPrint(dialogPrintFile.item.filename)"
            >{{ $t("Files.Yes") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogCopy.show" max-width="500" :transition="false">
      <v-card>
        <v-card-title class="headline"
          >{{
            dialogCopy.action === "copy" ? $t("Files.Copy") : $t("Files.Move")
          }}
          {{ dialogCopy.filename }}</v-card-title
        >
        <v-card-text>
          <template>
            <span>
              <b>{{ $t("Files.SelectedPath") }} : {{ dialogCopy.newPath }} </b>
            </span>
          </template>

          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-if="dialogCopy.newPath !== initialPath" @click="upClick">
                  <td class="px-1"><v-icon>mdi-folder-upload</v-icon></td>
                  <td class="px-1">..</td>
                </tr>
                <tr
                  v-for="item in filesForCopyDialogSync"
                  :key="item.filename"
                  @click="clickCopyItem(item)"
                >
                  <template v-if="dialogCopy.filename !== item.filename">
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
          <v-btn color="" text @click="dialogCopy.show = false">{{
            $t("Files.Cancel")
          }}</v-btn>
          <v-btn
            color="primary"
            text
            @click="copyFileAction"
            :disabled="!dialogCopy.newPath"
            >{{
              dialogCopy.action === "copy" ? $t("Files.Copy") : $t("Files.Move")
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, PropSync, Model } from 'nuxt-property-decorator'
import { IParams, IPrinterInfo } from '../../types/common'
import { FileStateFile } from '../../types/helpers'
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
interface dialogCopyObject {
  action: 'copy' | 'move'
  show: boolean
  filename: string
  currentPath: string
  newPath: string
  item: FileStateFile
}
@Component({
  name: "FileManager"
})
export default class fileManager extends Vue {
  @Prop({ type: Boolean, default: false }) closeable!: boolean
  @Prop({ type: Boolean, default: false }) noPrint!: boolean
  @Prop({ type: Array, default: () => [] }) loadings!: string[]
  @Prop({ type: Object, default: () => { return { free: 0, total: 0, used: 0 } } }) diskUsage!: {}
  @Prop({ type: Array, default: () => [] }) validGcodeExtensions!: string[]
  @Prop({
    type: Object, default: () => {
      return {
        timezoneOffset: 0,
        apiUrl: '',
        isPanel: true
      }
    }
  }) params!: IParams
  @Prop({
    type: Object, default: () => {
      return {
        axisMode: '',
        printerIsPrinting: false,
      }
    }
  }) printerInfo!: IPrinterInfo
  @Prop({ type: String, default: '' }) currentPath!: string
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
  $refs!: {
    fileUpload: HTMLInputElement,
    inputFieldRenameFile: HTMLInputElement,
    inputFieldCreateDirectory: HTMLInputElement,
    inputFieldRenameDirectory: HTMLInputElement,
  }
  initialPath = this.currentPath
  printMode = ''
  private search = ''
  private files: FileStateFile[] | null = []
  private dropzone = {
    visibility: false,
    opacity: 0,
  }
  private draggingFile: draggingFile = {
    status: false,
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }
  private uploadSnackbar: uploadSnackbar = {
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
  private dialogCreateDirectory = {
    show: false,
    name: ""
  }
  private contextMenu: contextMenu = {
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
  private dialogPrintFile: dialogPrintFile = {
    show: false,
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }
  private dialogRenameFile: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }
  private dialogCopy: dialogCopyObject = {
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
    }
  }
  private dialogRenameDirectory: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }
  private dialogDeleteDirectory: dialogRenameObject = {
    show: false,
    newName: "",
    item: {
      settings: {},
      isDirectory: false,
      filename: "",
      modified: (new Date()).getTime()
    }
  }
  private input_rules = [
    (value: string) => value.indexOf(" ") === -1 || 'Name contains spaces!'
  ]
  get headers () {
    const headers = [
      { text: '', value: '', align: 'left', configable: false, visible: true, filterable: false },
      { text: this.$t('Files.Name'), value: 'filename', align: 'left', configable: false, visible: true },
      //{ text: '', value: 'status', align: 'left', configable: false, visible: true },
      { text: this.$t('Files.Filesize'), value: 'size', align: 'right', configable: true, visible: true },
      { text: this.$t('Files.LastModified'), value: 'modified', align: 'right', configable: true, visible: true },
      { text: this.$t('Files.ObjectHeight'), value: 'object_height', align: 'right', configable: true, visible: false },
      { text: this.$t('Files.LayerHeight'), value: 'layer_height', align: 'right', configable: true, visible: false },
      { text: this.$t('Files.FilamentUsage'), value: 'filament_total', align: 'right', configable: true, visible: false },
      // { text: this.$t('Files.FilamentWeight'), value: 'filament_weight_total', align: 'right', configable: true, visible: false },
      { text: this.$t('Files.PrintTime'), value: 'estimated_time', align: 'right', configable: true, visible: false },
      { text: this.$t('Files.Slicer'), value: 'slicer', align: 'right', configable: true, visible: false },
      { text: this.$t('Files.PrintingMode'), value: 'printing_mode', align: 'right', configable: true, visible: false },
    ]
    headers.forEach((header) => {
      if (header.visible && this.optionsSync.hideMetadataColums.includes(header.value)) {
        header.visible = false
      } else if (!header.visible && !this.optionsSync.hideMetadataColums.includes(header.value)) {
        header.visible = true
      }
    })
    return headers
  }
  get filteredHeaders () {
    return this.headers.filter(header => header.visible)
  }
  get configHeaders () {
    return this.headers.filter(header => header.configable)
  }
  clickUploadButton () {
    this.$refs.fileUpload.click()
  }
  createDirectory () {
    this.dialogCreateDirectory.name = ""
    this.dialogCreateDirectory.show = true
  }
  createDirectoryAction () {
    if (this.dialogCreateDirectory.name.length && this.dialogCreateDirectory.name.indexOf(" ") === -1) {
      this.dialogCreateDirectory.show = false
      this.$emit('postDirectory', { path: this.currentPath + "/" + this.dialogCreateDirectory.name }, { action: 'files/getCreateDir' })
    }
  }
  refreshFileList () {
    this.$emit('getDirectory', { path: this.currentPath }, { action: 'files/getDirectory' })
  }
  async uploadFile () {
    if (this.$refs.fileUpload.files?.length) {
      this.$emit('socketAddLoading', { name: 'gcodeUpload' })
      let successFiles = []
      this.uploadSnackbar.number = 0
      this.uploadSnackbar.max = this.$refs.fileUpload.files.length
      for (const file of this.$refs.fileUpload.files) {
        this.uploadSnackbar.number++
        const result = await this.doUploadFile(file)
        successFiles.push(result)
      }
      this.$emit('socketRemoveLoading', { name: 'gcodeUpload' })
      for (const file of successFiles) {
        this.$notify.call({
          type: 'success',
          text: this.$t('Files.SuccessfullyUploaded', { filename: file }).toString()
        })
      }
      this.$refs.fileUpload.value = ''
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
    formData.append('file', file, (this.currentPath + "/" + filename).substring(7))
    return new Promise(resolve => {
      this.uploadSnackbar.cancelTokenSource = this.$axios.CancelToken.source();
      this.$axios.post(this.params.apiUrl + '/server/files/upload',                  //todo ?
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
        this.$emit('socketRemoveLoading', { name: 'gcodeUpload' })
        this.$notify.call({
          type: 'error',
          text: this.$t("File.CannotUpload").toString()
        })
      })
    })
  }
  advancedSearch (value: string | number, search: string) {
    return value != null &&
      search != null &&
      typeof value === 'string' &&
      value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
  }
  refreshMetadata (data: any) {
    const items = this.$helpers.sortFiles(this.files, [this.optionsSync.sortBy[0]], [this.optionsSync.sortDesc[0]])
    for (let i = data.pageStart; i < data.pageStop; i++) {
      if (items[i] && !items[i].isDirectory && !items[i].metadataPulled) {
        let filename = (this.currentPath + "/" + items[i].filename).substring(7)
        this.$emit('serverFilesMetadata', { filename: filename }, { action: "files/getMetadata" })
      }
    }
  }
  clickRowGoBack () {
    this.currentPath = this.currentPath.substr(0, this.currentPath.lastIndexOf("/"))
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
  async dragDropFilelist (e: any, row: any) {
    if (this.draggingFile.status) {
      e.preventDefault()
      e.target.parentElement.style.backgroundColor = 'transparent'
      let dest = "";
      if (row.filename === '..') {
        dest = this.currentPath.substring(0, this.currentPath.lastIndexOf("/") + 1) + this.draggingFile.item.filename
      } else dest = this.currentPath + "/" + row.filename + "/" + this.draggingFile.item.filename
      this.$emit('serverFilesMove', {
        source: this.currentPath + "/" + this.draggingFile.item.filename,
        dest: dest
      }, { action: 'files/getMove' })
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
  clickRow (item: FileStateFile, force = false) {
    this.printMode = item.settings.global_quality?.values.printing_mode || ''
    if (!this.contextMenu.shown || force) {
      if (force) {
        this.contextMenu.shown = false;
      }
      if (!item.isDirectory) {
        if (this.noPrint) {
          this.$emit('fileclick', this.currentPath,
            item)
        } else {
          this.dialogPrintFile.show = true;
          this.dialogPrintFile.item = item;
        }
      } else {
        this.currentPath += "/" + item.filename;
        this.loadPath();
      }
    }
  }
  created () {
    this.loadPath()
  }
  loadPath () {
    this.$emit('getDirectory', { path: this.currentPath }, { action: 'files/getDirectory' })
    let dirArray = this.currentPath.split("/")
    this.files = this.$helpers.findDirectory(this.filetree, dirArray)
    if (this.files !== null) {
      if (!this.optionsSync.showHiddenFiles) {
        this.files = this.files.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory))
      }
    }
  }
  @Watch('filetree', { deep: true })
  filetreeChanged (newVal: FileStateFile[]) {
    let dirArray = this.currentPath.split("/");
    this.files = this.$helpers.findDirectory(newVal, dirArray);
    if (this.files?.length && !this.optionsSync.showHiddenFiles) {
      this.files = this.files.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory));
    }
  }
  @Watch('currentPath')
  currentPathChanged (newVal: string) {
    let dirArray = newVal.split("/");
    this.files = this.$helpers.findDirectory(this.filetree, dirArray);
    if (this.files?.length && !this.optionsSync.showHiddenFiles) {
      this.files = this.files.filter(file => file.filename !== "thumbs" && file.filename.substr(0, 1) !== "." && (this.validGcodeExtensions.includes(`.${file.filename.split('.').pop()}`) || file.isDirectory));
    }
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
      if (thumbnail && 'relative_path' in thumbnail) return 'http://' + this.params.apiUrl + "/server/files/" + this.currentPath + "/" + thumbnail.relative_path + "?timestamp=" + item.modified
    }
    return ""
  }
  getBigThumbnail (item: FileStateFile) {
    if (item.thumbnails?.length) {
      const thumbnail = item.thumbnails.find(thumb => thumb.width >= 300 && thumb.width <= 400)
      if (thumbnail && 'relative_path' in thumbnail) return 'http://' + this.params.apiUrl + "/server/files/" + this.currentPath + "/" + thumbnail.relative_path + "?timestamp=" + item.modified
    }
    return ""
  }
  getThumbnailWidth (item: FileStateFile) {
    if (this.getBigThumbnail(item)) {
      const thumbnail = item.thumbnails?.find(thumb => thumb.width >= 300 && thumb.width <= 400)
      if (thumbnail) return thumbnail.width
    }
    return 400
  }
  changeMetadataVisible (name: string) {
    if (this.headers.filter(header => header.value === name).length) {
      const value = this.headers.filter(header => header.value === name)[0].visible;
      this.$emit('setGcodefilesMetadata', { name, value })
    }
  }
  dragOverUpload (e: Event) {
    if (!this.draggingFile.status) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.dropzone.visibility = true
      this.dropzone.opacity = 1
    }
  }
  dragLeaveUpload (e: Event) {
    if (!this.draggingFile.status) {
      e.preventDefault()
      e.stopImmediatePropagation()
      this.dropzone.visibility = false
      this.dropzone.opacity = 0
    }
  }
  async dragDropUpload (e: any) {
    if (!this.draggingFile.status) {
      e.preventDefault()
      this.dropzone.visibility = false
      this.dropzone.opacity = 0
      if (e.dataTransfer.files.length) {
        this.$emit('socketAddLoading', { name: 'gcodeUpload' })
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
        this.$emit('socketRemoveLoading', { name: 'gcodeUpload' })
        for (const file of successFiles) {
          this.$notify.call({
            type: 'success',
            text: this.$t('Files.SuccessfullyUploaded', { filename: file }).toString()
          })
        }
      }
    }
  }
  cancelUpload () {
    this.uploadSnackbar.cancelTokenSource.cancel()
    this.uploadSnackbar.status = false
    this.$refs.fileUpload.value = ''
  }
  downloadFile () {
    const filename = (this.currentPath + "/" + this.contextMenu.item.filename)
    const href = this.params.apiUrl + '/server/files/' + encodeURI(filename)
    window.open(href)
  }
  renameFile (item: FileStateFile) {
    this.dialogRenameFile.item = item
    this.dialogRenameFile.newName = item.filename
    this.dialogRenameFile.show = true
  }
  renameFileAction () {
    this.dialogRenameFile.show = false
    this.$emit('serverFilesMove', {
      source: this.currentPath + "/" + this.dialogRenameFile.item.filename,
      dest: this.currentPath + "/" + this.dialogRenameFile.newName
    }, { action: 'files/getMove' })
  }
  renameDirectory (item: FileStateFile) {
    this.dialogRenameDirectory.item = item
    this.dialogRenameDirectory.newName = item.filename
    this.dialogRenameDirectory.show = true
  }
  renameDirectoryAction () {
    this.dialogRenameDirectory.show = false
    this.$emit('serverFilesMove', {
      source: this.currentPath + "/" + this.dialogRenameDirectory.item.filename,
      dest: this.currentPath + "/" + this.dialogRenameDirectory.newName
    }, { action: 'files/getMove' })
  }
  removeFile () {
    if (!this.printerInfo.printerIsPrinting) {
      this.$emit('printerGcodeScript', { script: 'SDCARD_RESET_FILE' })
    }
    this.$emit('serverFilesDeleteFile', { path: this.currentPath + "/" + this.contextMenu.item.filename }, { action: 'files/getDeleteFile' });
  }
  deleteDirectory (item: FileStateFile) {
    this.dialogDeleteDirectory.item = item
    this.dialogDeleteDirectory.show = true
  }
  deleteDirectoryAction () {
    this.dialogDeleteDirectory.show = false
    this.$emit('serverFilesDeleteDirectory', { path: this.currentPath + "/" + this.contextMenu.item.filename, force: true }, { action: 'files/getDeleteDir' })
  }
  // создание задания на печать
  startPrint (filename = "") {
    filename = (this.currentPath + "/" + filename).substring(7)
    this.dialogPrintFile.show = false
    this.$emit('serverPrintjobsPostJob', {
      name: `Print ${filename}`,
      description: 'Job created from file manager',
      filename: filename
    }, { action: 'switchToDashboard' })
  }
  isUsb (item: FileStateFile) {
    return this.currentPath === this.initialPath && item.isDirectory && item.filename === 'USB'
  }
  isUsbInDialog (item: FileStateFile) {
    return this.dialogCopy.currentPath === this.initialPath && item.isDirectory && item.filename === 'USB'
  }
  // copy
  copyFile (item: FileStateFile, action: 'copy' | 'move') {
    this.dialogCopy.action = action
    this.dialogCopy.show = true
    this.dialogCopy.filename = item.filename
    this.dialogCopy.currentPath = this.currentPath
    this.dialogCopy.newPath = this.currentPath
    this.dialogCopy.item = item
    this.$emit('getDirectory', { path: this.dialogCopy.currentPath }, { action: 'files/getDirectoryForCopyDialog' })
  }
  copyFileAction () {
    this.dialogCopy.show = false
    if (this.dialogCopy.action === 'copy') {
      this.$emit('serverFilesCopy', {
        source: this.dialogCopy.currentPath + '/' + this.dialogCopy.item.filename,
        dest: this.dialogCopy.newPath + '/' + this.dialogCopy.item.filename
      }, { action: 'files/getCopy', loading: 'fileMoving' })
    } else if (this.dialogCopy.action === 'move') {
      this.$emit('serverFilesMove', {
        source: this.dialogCopy.currentPath + '/' + this.dialogCopy.item.filename,
        dest: this.dialogCopy.newPath + '/' + this.dialogCopy.item.filename
      }, { action: 'files/getCopy', loading: 'fileMoving' })
    }
    this.dialogCopy.newPath = ''
  }
  // Click in copy dialog line
  clickCopyItem (item: any) {
    if (item.isDirectory) {
      this.dialogCopy.newPath += '/' + item.filename
      this.$emit('getDirectory', { path: this.dialogCopy.newPath }, { action: 'files/getDirectoryForCopyDialog' })
    }
  }
  // Click in copy dialog up directory
  upClick () {
    let arr = this.dialogCopy.newPath.split('/')
    arr.length = arr.length - 1
    this.dialogCopy.newPath = arr.join('/')
    this.$emit('getDirectory', { path: this.dialogCopy.newPath }, { action: 'files/getDirectoryForCopyDialog' })
  }
  getDate (item: any) {
    if (this.isUsb(item)) {
      return "--"
    } else {
      if (this.params.isPanel) {
        return this.$helpers.formatDate(item.modified, this.params.timezoneOffset)
      } else {
        return this.$helpers.formatDate(item.modified, 0)
      }
    }
  }
  mounted () {
    console.log('---!--- nuxt-common-Module diskUsage:', this.diskUsage);

  }
}
</script>

<style scoped>
.v-data-table .file-list-cursor:hover {
  cursor: pointer;
}
</style>
