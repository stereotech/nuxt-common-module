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
import DashboardPrinterAvatar from "../dashboard/DashboardPrinterAvatar.vue";
import DashboardPrinterActions from "../dashboard/DashboardPrinterActions.vue";
import DashboardPrinterHeaters from "../dashboard/DashboardPrinterHeaters.vue";
let DashboardPrinter = class extends Vue {
  constructor() {
    super(...arguments);
    this.isTemperatureDialogOpen = false;
  }
  lightControl() {
    const gcode = "TOGGLE_LIGHT";
    this.$emit("lightControl", { script: gcode }, { message: gcode, type: "command" });
  }
  get lightIsOff() {
    return this.lightColor === "rgb(0, 0, 0)";
  }
  get fiber() {
    return this.printerInfo.model[1] === "F";
  }
};
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinter.prototype, "lightColor", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinter.prototype, "klipperState", 2);
__decorateClass([
  Prop({ type: Boolean, default: false })
], DashboardPrinter.prototype, "klippyIsConnected", 2);
__decorateClass([
  PropSync("queueStatus", { type: String, default: "" })
], DashboardPrinter.prototype, "queueStatusSync", 2);
__decorateClass([
  Prop({ type: Object, default: () => {
    return { timezoneOffset: 0, apiUrl: "", isPanel: true };
  } })
], DashboardPrinter.prototype, "params", 2);
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
        hasFilamentSensors: false
      };
    }
  })
], DashboardPrinter.prototype, "printerInfo", 2);
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
], DashboardPrinter.prototype, "socketInfo", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinter.prototype, "klippyMessage", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], DashboardPrinter.prototype, "events", 2);
DashboardPrinter = __decorateClass([
  Component({
    name: "DashboardPrinter",
    components: {
      DashboardPrinterAvatar,
      DashboardPrinterActions,
      DashboardPrinterHeaters
    }
  })
], DashboardPrinter);
export {
  DashboardPrinter as default
};
</script>

<style>
</style>