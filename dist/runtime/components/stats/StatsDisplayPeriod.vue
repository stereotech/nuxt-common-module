<template>
  <div>
    <v-card>
      <card-title
        icon="mdi-filter-outline"
        :title="$t('Statistics.DisplayPeriod.FilterHeader')"
      ></card-title>
      <v-card-text>
        <!-- Select diapazon -->
        <v-container>
          <v-row>
            <v-col cols="12" md="6" :id="'stats-display-period'">
              <v-select
                outlined
                :items="items"
                :label="$t('Statistics.DisplayPeriod.SelectPeriod')"
                v-model="period"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-if="showPicker"
                v-model="showDialogSelectPeriod"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    :value="dateRangeText"
                    :label="$t('Statistics.DisplayPeriod.SelectDiapazon')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datesSync"
                  range
                  max="nowDate()"
                  no-title
                  scrollable
                  first-day-of-week="1"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="showDialogSelectPeriod = false"
                    >{{ $t("Statistics.DisplayPeriod.Ok") }}</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <stats-filter
                :print-status-time="printStatusTime"
                :print-status-array="printStatusArray"
                :material-status-array="materialStatusArray"
                :printer-name="printerName"
                :is-panel="isPanel"
                @refreshHistory="refreshHistory"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
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
import { Vue, Component, Prop, PropSync, Watch, Model } from "nuxt-property-decorator";
import StatsFilter from "../stats/StatsFilter.vue";
let StatsDisplayPeriod = class extends Vue {
  constructor() {
    super(...arguments);
    this.period = this.displayPeriod;
    this.showDialogSelectPeriod = false;
  }
  periodChange(newVal) {
    this.$emit("change", newVal);
  }
  get showPicker() {
    return this.period === "period";
  }
  get items() {
    return [
      {
        text: this.$t("Statistics.DisplayPeriod.Day").toString(),
        value: "day"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Month").toString(),
        value: "month"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Year").toString(),
        value: "year"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Period").toString(),
        value: "period"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.All").toString(),
        value: "all"
      }
    ];
  }
  nowDate() {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }
  get dateRangeText() {
    return this.datesSync.join(" ~ ");
  }
  refreshHistory(options, settings) {
    this.$emit("refreshHistory", options, settings);
  }
};
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsDisplayPeriod.prototype, "printStatusTime", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsDisplayPeriod.prototype, "printStatusArray", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsDisplayPeriod.prototype, "materialStatusArray", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], StatsDisplayPeriod.prototype, "printerName", 2);
__decorateClass([
  Prop({ type: Boolean, default: false })
], StatsDisplayPeriod.prototype, "isPanel", 2);
__decorateClass([
  Model("change", { type: String, default: "" })
], StatsDisplayPeriod.prototype, "displayPeriod", 2);
__decorateClass([
  PropSync("dates", { type: Array, default: () => [] })
], StatsDisplayPeriod.prototype, "datesSync", 2);
__decorateClass([
  Watch("period")
], StatsDisplayPeriod.prototype, "periodChange", 1);
StatsDisplayPeriod = __decorateClass([
  Component({
    name: "StatsDisplayPeriod",
    components: {
      StatsFilter
    }
  })
], StatsDisplayPeriod);
export {
  StatsDisplayPeriod as default
};
</script>

<style></style>
