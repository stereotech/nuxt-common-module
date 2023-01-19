<template>
  <v-container class="py-0 py-md-3">
    <!-- Загрузка системы... -->
    <v-row dense v-if="klipperState === 'disconnected' && !klippyIsConnected">
      <v-col cols="12" class="primary--text title">
        {{ $t("Dashboard.Printer.FirmwareLoading") }}
      </v-col>
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
    <!-- Системная ошибка -->
    <v-row
      dense
      v-else-if="klipperState !== 'ready' && socketInfo.socketIsConnected"
    >
      klipperState{{ klipperState }}
      <v-col cols="12" class="error--text title">
        {{ $t("Dashboard.Printer.FirmwareError") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t(klippyMessage) }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ lastErrorEventMessage }}
      </v-col>
      <v-col cols="12">
        <v-btn
          block
          @click="firmwareRestart"
          :loading="socketInfo.loadings.includes('firmwareRestart')"
          depressed
          color="error"
          ><v-icon>mdi-restart</v-icon
          >{{ $t("Panels.KlippyStatePanel.FirmwareRestart") }}</v-btn
        >
      </v-col>
    </v-row>
    <!-- Обслуживание -->
    <v-row
      no-gutters
      v-else-if="
        printerInfo.printerState === 'standby' &&
        queueStatusSync === 'maintenance'
      "
    >
      <v-col cols="12" class="warning--text title">
        {{ $t("Dashboard.Printer.Maintenance") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t("Dashboard.Printer.MaintenanceDescription") }}
      </v-col>
      <v-col cols="12" class="mt-1">
        <v-select
          hide-details="always"
          :items="stateActions"
          v-model="queueStatusSync"
          outlined
          item-text="name"
          item-value="key"
          :label="$t('Dashboard.Printer.Select')"
        ></v-select>
      </v-col>
    </v-row>
    <!-- Ожидание -->
    <v-row dense v-else-if="queueStatusSync === 'idle'">
      <v-col cols="12" class="accent--text title">
        {{ $t("Dashboard.Printer.Idle") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t("Dashboard.Printer.IdleDescription") }}
      </v-col>
      <v-col cols="12">
        <v-select
          hide-details="always"
          :items="stateActions"
          v-model="queueStatusSync"
          outlined
          item-text="name"
          item-value="key"
          :label="$t('Dashboard.Printer.Select')"
        ></v-select>
      </v-col>
    </v-row>
    <!-- Печать... -->
    <v-row dense v-else-if="printerInfo.printerState === 'printing'">
      <v-col cols="12" class="accent--text title">
        {{ $t("Dashboard.Printer.Printing") }}
        {{ printerInfo.printPercent }}%
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate" v-if="currentPrintjob">
        {{ $t("Dashboard.Printer.Job") }}
        {{ currentPrintjob.name }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate" v-if="timeSpent">
        {{ $t("Dashboard.Printer.TimeSpent") }}
        {{ timeSpent }}
      </v-col>
      <v-col
        cols="12"
        class="subtitle-2 text-truncate"
        v-if="estimatedPrintTime"
      >
        {{ $t("Dashboard.Printer.TimeLeft") }}
        {{ estimatedPrintTime }}
      </v-col>
      <v-col cols="12">
        <v-progress-linear
          striped
          :value="printerInfo.printPercent"
        ></v-progress-linear>
      </v-col>
      <v-col cols="12">
        <toolbar-printer-controls />
      </v-col>
    </v-row>
    <!-- Пауза -->
    <v-row
      dense
      v-else-if="
        printerInfo.printerState === 'paused' && klipperState === 'ready'
      "
    >
      <v-col cols="12" class="warning--text title">
        {{ $t("Dashboard.Printer.Paused") }}
        {{ printerInfo.printPercent }}%
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate" v-if="currentPrintjob">
        {{ $t("Dashboard.Printer.Job") }}
        {{ currentPrintjob.name }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate" v-if="timeSpent">
        {{ $t("Dashboard.Printer.TimeSpent") }}
        {{ timeSpent }}
      </v-col>
      <v-col
        cols="12"
        class="subtitle-2 text-truncate"
        v-if="estimatedPrintTime"
      >
        {{ $t("Dashboard.Printer.TimeLeft") }}
        {{ estimatedPrintTime }}
      </v-col>
      <v-col cols="12">
        <v-progress-linear
          color="warning"
          striped
          :value="printerInfo.printPercent"
        ></v-progress-linear>
      </v-col>
      <v-col cols="12" class="text-center">
        <toolbar-printer-controls />
      </v-col>
    </v-row>
    <!-- Печать завершена -->
    <v-row dense v-else-if="printerInfo.printerState === 'complete'">
      <v-col cols="12" class="success--text title">
        {{ $t("Dashboard.Printer.Done") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t("Dashboard.Printer.DoneDescription") }}
      </v-col>
      <v-col>
        <v-radio-group
          v-model="selectedPrintStatus"
          column
          class="statusSelect"
        >
          <template v-for="status in switchStatus">
            <v-radio
              :value="status.value"
              :key="status.value"
              :class="{ bold: status.selected }"
              :color="status.selected ? status.color : ''"
            >
              <template v-slot:default>default slot</template>
              <template v-slot:label>
                <v-icon :color="status.selected ? status.color : ''">{{
                  status.icon
                }}</v-icon>
                <font :color="status.selected ? status.color : ''">
                  {{ status.text }}
                </font>
              </template>
            </v-radio>
          </template>
        </v-radio-group>
      </v-col>
      <v-col
        cols="12"
        v-if="['completed', 'failed'].includes(lastPrintjobStatus)"
      >
        <v-select
          hide-details="always"
          :items="stateActions"
          v-model="queueStatusSync"
          outlined
          item-text="name"
          item-value="key"
          :label="$t('Dashboard.Printer.Select')"
        ></v-select>
      </v-col>
    </v-row>
    <!-- Ошибка печати -->
    <v-row
      dense
      v-else-if="
        printerInfo.printerState === 'cancelled' ||
        printerInfo.printerState === 'error'
      "
    >
      <v-col cols="12" class="error--text title">
        {{ $t("Dashboard.Printer.Error") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t("Dashboard.Printer.ErrorDescription") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $helpers.convertName(printerInfo.printerState) }}
      </v-col>
      <v-col cols="12">
        <v-select
          hide-details="always"
          :items="stateActions"
          v-model="queueStatusSync"
          outlined
          item-text="name"
          item-value="key"
          :label="$t('Dashboard.Printer.Select')"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, PropSync } from 'nuxt-property-decorator'
import { IPrinterInfo } from '../../../types/common'

@Component({
  name: 'DashboardPrinterActions'
})
export default class DashboardPrinterActions extends Vue {
  @Prop({ type: String, default: '' }) klipperState!: string
  @Prop({ type: Boolean, default: false }) klippyIsConnected!: boolean
  @PropSync('queueStatus', { type: String, default: '' }) queueStatusSync!: string
  @Prop({ type: Object, default: () => { } }) currentPrintjob!: { [key: string]: any }
  @Prop({ type: Object, default: () => { } }) lastPrintjob!: { [key: string]: any }

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
        printPercent: 0,
        estimatedTimeAvg: 0,
        totalDuration: 0,
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
  @Prop({ type: Array, default: () => [{ formatMessage: '' }] }) events!: [{ formatMessage: '' }]

  get lastErrorEventMessage () {
    return this.events.find((e: any) => e.message.startsWith('!!'))?.formatMessage ?? ''
  }

  get stateActions () {
    let states = ['maintenance', 'idle']
    if (this.printerInfo.printerState === 'complete' && !['completed', 'failed'].includes(this.lastPrintjobStatus)) {
      states = ['maintenance']
    }
    return states.map(s => {
      return {
        name: this.$t(this.$helpers.convertName(s)),
        key: s
      }
    })
  }

  firmwareRestart () {
    this.$emit('firmwareRestart', {}, { loading: 'firmwareRestart' })
  }


  get estimatedPrintTime () {
    const time_left = this.printerInfo.estimatedTimeAvg
    if (time_left < 0) {
      return undefined
    }
    const h = Math.floor(time_left / 3600)
    const m = Math.floor((time_left - h * 3600) / 60)
    const s = Math.floor(time_left - h * 3600 - m * 60)
    return `${h}:${m}:${s}`
  }

  get timeSpent () {
    const time = this.printerInfo.totalDuration
    const h = Math.floor(time / 3600)
    const m = Math.floor((time - h * 3600) / 60)
    const s = Math.floor(time - h * 3600 - m * 60)
    return `${h}:${m}:${s}`
  }

  switchStatus = [
    {
      text: this.$t('completed').toString(),
      icon: 'mdi-checkbox-marked-circle-outline',
      value: 'completed',
      color: 'green',
      selected: false
    },
    {
      text: this.$t('failed').toString(),
      icon: 'mdi-close-circle-outline',
      value: 'failed',
      color: 'red',
      selected: false
    },
  ]

  selectedPrintStatus = this.lastPrintjobStatus

  @Watch('selectedPrintStatus')
  selectedPrintStatusChanged (newVal: any) {
    this.switchStatus.forEach((item: any) => {
      item.selected = item.value === newVal ? true : false
      // Передать статус newVal для установки его крайнему заданию
      this.$emit('printjobsPostJob', { status: newVal, id: this.lastPrintjob.id }, { action: "server/printjobs/getPrintjobs" }
      );
    })
  }

  get lastPrintjobStatus () {

    if (this.lastPrintjob === null || this.lastPrintjob === undefined) {
      return ''
    }
    else {
      let tmpStatus = ''
      this.switchStatus.forEach((item: any) => {
        if (item.value === this.lastPrintjob.status) {
          item.selected = true
          tmpStatus = item.value
        } else {
          item.selected = false
        }
      });

      return tmpStatus ?? ''
    }
  }


}

</script>

<style>
.bold {
  font-weight: 600;
}

.statusSelect .v-input--selection-controls__input {
  display: none;
}
</style>