<template>
  <v-container class="py-0 py-md-3">
    <v-row dense align="center" v-if="heaters.length > 0">
      <v-col
        cols="4"
        :class="`text-caption ${index < 1 ? 'text-center' : ''}`"
        v-for="(header, index) in headers"
        v-bind:key="index"
      >
        {{ header }}
      </v-col>
    </v-row>
    <div v-for="(heater, index) in heaters" v-bind:key="index">
      <v-divider class="my-2"></v-divider>
      <v-row dense align="center">
        <v-col cols="4" class="font-weight-bold">
          <v-icon left :color="heater.iconColor">mdi-{{ heater.icon }}</v-icon>
          <span>{{ heater.name }}</span>
        </v-col>
        <v-col cols="4" class="text-center">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <small v-bind="attrs" v-on="on">{{
                heater.target > 0 ? heater.target : "off"
              }}</small>
            </template>
            <span>{{ heater.avgPower + "%" }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="4" class="text-center">
          <span>{{ heater.temperature.toFixed(0) }}°C</span>
          <div v-for="(values, key) of heater.additionSensors" v-bind:key="key">
            <span v-if="values.bool"
              ><small>{{ values.value }} {{ values.unit }}</small></span
            >
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

export interface PrinterHeater {
  name: string;
  type: string;
  icon: string;
  iconColor: string;
  target: number;
  temperature: number;
  additionSensors: PrinterStateAdditionSensor[];
  power: number;
  avgPower: number;
  chartColor: string;
  chartSeries: string[];
  presets: number[];
  min_temp: number;
  max_temp: number;
}

export interface PrinterStateAdditionSensor {
  bool: boolean;
  name: string;
  unit: string;
  value: number;
}

@Component({
  name: "DashboardPrinterHeaters",
})
export default class DashboardPrinterHeaters extends Vue {
  @Prop({ type: Array, default: () => { } }) headers!: string[];
  @Prop({ type: Array, default: () => [] }) heaters!: PrinterHeater[];
}
</script>

<style></style>
