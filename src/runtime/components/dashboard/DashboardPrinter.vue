<template>
  <v-card>
    <card-title
      icon="mdi-printer-3d"
      :title="printerInfo.printerName"
      :id="'dashboard-printer'"
    >
      <v-chip
        class="ml-2"
        color="blue-grey darken-3"
        v-if="fiber"
        outlined
        label
        >FIBER</v-chip
      >

      <v-chip
        class="ml-2"
        color="info"
        v-if="printerInfo.axisMode === 'five'"
        outlined
        label
        link
        nuxt
        to="/settings/5D"
      >
        5D
      </v-chip>

      <v-chip
        class="ml-2"
        color="primary"
        v-else-if="printerInfo.axisMode === 'three'"
        outlined
        label
        nuxt
        to="/settings/3D"
      >
        3D
      </v-chip>

      <v-chip class="ml-2" color="error" v-else outlined label>
        {{ $t("Dashboard.Printer.Module") }}
      </v-chip>

      <v-chip
        class="ml-2"
        color="primary"
        outlined
        label
        link
        :nuxt="printerInfo.hasFilamentSensors"
        :to="printerInfo.hasFilamentSensors ? `/settings/material-control` : ''"
        ><v-icon
          left
          v-if="printerInfo.showSensor"
          :color="printerInfo.filamentPresent ? 'success' : 'warning'"
          >mdi-checkbox-blank-circle</v-icon
        >{{ $t($helpers.capitalize(printerInfo.currentExtruder)) }}
      </v-chip>

      <v-spacer />
      <v-btn
        v-if="printerInfo.printerState === 'paused'"
        text
        @click="isTemperatureDialogOpen = true"
      >
        <v-icon left>mdi-thermometer</v-icon>
        <v-icon left>mdi-fan</v-icon>
      </v-btn>
      <v-btn
        text
        v-if="printerInfo.printerIsPrinting && params.isPanel"
        nuxt
        to="/control"
      >
        <v-icon left>mdi-arrow-collapse-vertical</v-icon>
        {{ $t("Control.Babystep.Headline") }}
      </v-btn>
      <v-btn icon @click="lightControl" :color="lightColor">
        <v-icon v-if="lightIsOff">mdi-lightbulb-outline</v-icon>
        <v-icon v-else>mdi-lightbulb-off-outline</v-icon>
      </v-btn>
    </card-title>
    <v-container class="pt-0 pt-md-3">
      <v-row dense>
        <v-col cols="4">
          <dashboard-printer-avatar
            :klipper-state="klipperState"
            :printer-info="printerInfo"
            :params="params"
            :queue-status="queueStatusSync"
            :current-printjob="currentPrintjob"
          />
        </v-col>
        <v-col cols="8">
          <dashboard-printer-actions
            :klipper-state="klipperState"
            :socket-info="socketInfo"
            :printer-info="printerInfo"
            :queue-status.sync="queueStatusSync"
            :klippy-message="klippyMessage"
            :klippy-is-connected="klippyIsConnected"
            :events="events"
            :current-printjob="currentPrintjob"
          />
        </v-col>
        <v-col cols="12">
          <dashboard-printer-heaters :printer-info="printerInfo" />
        </v-col>
      </v-row>
    </v-container>

    <v-dialog
      v-model="isTemperatureDialogOpen"
      :width="600"
      :transition="false"
    >
      <v-card>
        <card-title
          icon=""
          title=""
          closeable
          @close="isTemperatureDialogOpen = false"
        />
        <v-card-text>
          <v-row>
            <v-col class="col-12 py-1">
              <control-tools-panel-printer-paused />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="col-12 py-1">
              <control-fans-panel-printer-paused />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'nuxt-property-decorator'
import { IParams, IPrinterInfo } from '../../../types/common'
import DashboardPrinterAvatar from './DashboardPrinterAvatar.vue'
import DashboardPrinterActions from './DashboardPrinterActions.vue'
import DashboardPrinterHeaters from './DashboardPrinterHeaters.vue'

@Component({
  name: 'DashboardPrinter',
  components: {
    DashboardPrinterAvatar,
    DashboardPrinterActions,
    DashboardPrinterHeaters
  }
})
export default class DashboardPrinter extends Vue {
  @Prop({ type: String, default: '' }) lightColor!: string
  @Prop({ type: String, default: '' }) klipperState!: string
  @Prop({ type: Boolean, default: false }) klippyIsConnected!: boolean
  @Prop({ type: Object, default: () => { } }) currentPrintjob!: {}
  @PropSync('queueStatus', { type: String, default: '' }) queueStatusSync!: string

  @Prop({ type: Object, default: () => { return { timezoneOffset: 0, apiUrl: '', isPanel: true } } }) params!: IParams
  @Prop({
    type: Object, default: () => {
      return {
        axisMode: '',
        printerName: '',
        printerState: '',
        printerIsPrinting: false,
        currentExtruder: '',
        model: '',
        showSensor: false,
        filamentPresent: false,
        hasFilamentSensors: false,
      }
    }
  }) printerInfo!: IPrinterInfo
  @Prop({
    type: Object, default: () => {
      return {
        socketIsConnected: false,
        loadings: []
      }
    }
  }) socketInfo!: {}
  @Prop({ type: String, default: '' }) klippyMessage!: ''
  @Prop({ type: Array, default: () => [] }) events!: []

  isTemperatureDialogOpen = false

  lightControl () {
    const gcode = 'TOGGLE_LIGHT'
    this.$emit('lightControl', { script: gcode }, { message: gcode, type: 'command' })
  }
  get lightIsOff () {
    return this.lightColor === 'rgb(0, 0, 0)'
  }
  get fiber () {
    return this.printerInfo.model[1] === "F";
  }
}

</script>

<style>
</style>