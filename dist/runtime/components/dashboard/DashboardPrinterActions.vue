<template>
  <v-container class="py-0 py-md-3">
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
    <v-row dense v-else-if="printerInfo.printerState === 'complete'">
      <v-col cols="12" class="success--text title">
        {{ $t("Dashboard.Printer.Done") }}
      </v-col>
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ $t("Dashboard.Printer.DoneDescription") }}
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
let DashboardPrinterActions = class extends Vue {
  get lastErrorEventMessage() {
    return this.events.find((e) => e.message.startsWith("!!"))?.formatMessage ?? "";
  }
  get stateActions() {
    const states = ["maintenance", "idle"];
    return states.map((s) => {
      return {
        name: this.$t(this.$helpers.convertName(s)),
        key: s
      };
    });
  }
  firmwareRestart() {
    this.$socket.emit("printer.firmware_restart", {}, { loading: "firmwareRestart" });
  }
  get estimatedPrintTime() {
    const time_left = this.printerInfo.estimatedTimeAvg;
    if (time_left < 0) {
      return void 0;
    }
    const h = Math.floor(time_left / 3600);
    const m = Math.floor((time_left - h * 3600) / 60);
    const s = Math.floor(time_left - h * 3600 - m * 60);
    return `${h}:${m}:${s}`;
  }
  get timeSpent() {
    const time = this.printerInfo.totalDuration;
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    const s = Math.floor(time - h * 3600 - m * 60);
    return `${h}:${m}:${s}`;
  }
};
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinterActions.prototype, "klipperState", 2);
__decorateClass([
  Prop({ type: Boolean, default: false })
], DashboardPrinterActions.prototype, "klippyIsConnected", 2);
__decorateClass([
  PropSync("queueStatus", { type: String, default: "" })
], DashboardPrinterActions.prototype, "queueStatusSync", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        name: "",
        metadata: { thumbnails: [] }
      };
    }
  })
], DashboardPrinterActions.prototype, "currentPrintjob", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        axisMode: "",
        printerName: "",
        printerState: "",
        printerIsPrinting: false,
        currentExtruder: "",
        model: "",
        showSensor: false,
        filamentPresent: false,
        hasFilamentSensors: false,
        printPercent: 0,
        estimatedTimeAvg: 0,
        totalDuration: 0
      };
    }
  })
], DashboardPrinterActions.prototype, "printerInfo", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        socketIsConnected: false,
        loadings: []
      };
    }
  })
], DashboardPrinterActions.prototype, "socketInfo", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinterActions.prototype, "klippyMessage", 2);
__decorateClass([
  Prop({ type: Array, default: () => [{ formatMessage: "" }] })
], DashboardPrinterActions.prototype, "events", 2);
DashboardPrinterActions = __decorateClass([
  Component({
    name: "DashboardPrinterActions"
  })
], DashboardPrinterActions);
export {
  DashboardPrinterActions as default
};
</script>

<style>
</style>