<template>
  <v-container class="py-0 py-md-3">
    <v-row dense align="center" v-if="heaters.length > 0">
      <v-col cols="4" class="text-caption">{{
          $t("Panels.ToolsPanel.Name")
      }}</v-col>
      <v-col cols="4" class="text-caption text-center">{{
          $t("Panels.ToolsPanel.Target")
      }}</v-col>
      <v-col cols="4" class="text-caption text-center">{{
          $t("Panels.ToolsPanel.Current")
      }}</v-col>
    </v-row>
    <div v-for="(heater, index) in heaters" v-bind:key="index">
      <v-divider class="my-2"></v-divider>
      <v-row dense align="center">
        <v-col cols="4" class="font-weight-bold">
          <v-icon left :color="heater.iconColor">mdi-{{ heater.icon }}</v-icon>

          <span v-if="fiber && heater.type === 'extruder1'">{{
              $t($helpers.convertName("fiber_extruder"))
          }}</span>

          <span v-else>{{ $t($helpers.convertName(heater.name)) }}</span>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <small v-bind="attrs" v-on="on">{{
                  heater.target > 0 ? heater.target : "off"
              }}</small>
            </template>
            <span>{{ $t("Panels.ToolsPanel.Avg") }}:
              {{ heater.avgPower + "%" }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="4" class="text-center">
          <span>{{ heater.temperature.toFixed(0) }}°C</span>
          <div v-for="(values, key) of heater.additionSensors" v-bind:key="key">
            <span v-if="values.bool"><small>{{ values.value }} {{ values.unit }}</small></span>
          </div>
        </v-col>
      </v-row>
    </div>
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
import { Vue, Component, Prop } from "nuxt-property-decorator";
let DashboardPrinterHeaters = class extends Vue {
  get heaters() {
    return (this.$store?.getters["printer/getHeaters"] ?? []).filter((h) => {
      return h.temperature > 0 && !(h.type === "heater_bed" && this.printerInfo.axisMode === "five");
    });
  }
  get fiber() {
    return this.printerInfo.model[1] === "F";
  }
};
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        axisMode: "",
        model: ""
      };
    }
  })
], DashboardPrinterHeaters.prototype, "printerInfo", 2);
DashboardPrinterHeaters = __decorateClass([
  Component({
    name: "DashboardPrinterHeaters"
  })
], DashboardPrinterHeaters);
export {
  DashboardPrinterHeaters as default
};
</script>

<style>

</style>