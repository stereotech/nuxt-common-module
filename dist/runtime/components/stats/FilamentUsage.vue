<template>
  <ECharts
    ref="statsFilamentUsage"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 175px; width: 100%"
    v-intersect="visibilityChanged"
  ></ECharts>
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
import { Vue, Component, Watch, Prop } from "nuxt-property-decorator";
import { createComponent } from "echarts-for-vue";
import * as echarts from "echarts";
let StatsFilamentUsage = class extends Vue {
  get chartOptions() {
    return {
      darkMode: true,
      animation: false,
      grid: {
        top: 30,
        right: 40,
        bottom: 30,
        left: 40
      },
      title: {
        text: this.$t("Statistics.FilamentUsage"),
        textStyle: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
        }
      },
      tooltip: {
        trigger: "axis",
        borderWidth: 0,
        formatter: (datasets) => {
          let output = "";
          if (datasets.length) {
            output = datasets[0]["marker"];
            const outputTime = datasets[0]["axisValueLabel"];
            const a = outputTime.split(/[^0-9]/);
            const outputTimeDate = new Date(a[0], a[1] - 1, a[2]);
            const outputValue = Math.round(datasets[0]["data"][1] * 10) / 10;
            output += outputTimeDate.toLocaleDateString() + ": " + outputValue + "m";
          }
          return output;
        }
      },
      xAxis: {
        type: "time",
        min: new Date().setHours(0, 0, 0) - 60 * 60 * 24 * 14 * 1e3,
        max: new Date().setHours(0, 0, 0),
        minInterval: 60 * 60 * 24 * 1e3,
        splitLine: {
          show: true,
          lineStyle: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          }
        },
        axisLabel: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent,
          margin: 10
        }
      },
      yAxis: {
        type: "value",
        minInterval: 10,
        maxInterval: 100,
        nameLocation: "end",
        nameGap: 5,
        nameTextStyle: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent,
          align: "left"
        },
        splitLine: {
          lineStyle: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          }
        },
        axisLabel: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent,
          formatter: "{value}",
          showMinLabel: true,
          margin: 5
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          }
        }
      },
      color: [this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent],
      series: [
        {
          type: "bar",
          data: [],
          showSymbol: false
        }
      ]
    };
  }
  visibilityChanged(entries, observer) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible)
      this.chart?.resize();
  }
  eventListenerResize(event) {
    this.chart?.resize();
  }
  get chart() {
    const historyFilamentUsage = this.$refs.statsFilamentUsage;
    return historyFilamentUsage?.inst ?? null;
  }
  mounted() {
    this.chartOptions.series[0].data = this.filamentUsageArray;
    this.chart?.setOption(this.chartOptions);
    window.addEventListener("resize", this.eventListenerResize);
  }
  destroyed() {
    window.removeEventListener("resize", this.eventListenerResize);
  }
  beforeDestroy() {
    if (typeof window === "undefined")
      return;
    if (this.chart)
      this.chart.dispose();
  }
  filamentUsageArrayChanged(newVal) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }
  getImage() {
    return this.chart?.getDataURL({
      pixelRatio: 2,
      backgroundColor: this.$vuetify.theme.dark ? "black" : "white"
    }) || "not results Flaments";
  }
};
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsFilamentUsage.prototype, "filamentUsageArray", 2);
__decorateClass([
  Watch("filamentUsageArray")
], StatsFilamentUsage.prototype, "filamentUsageArrayChanged", 1);
StatsFilamentUsage = __decorateClass([
  Component({
    name: "StatsFilamentUsage",
    components: {
      ECharts: createComponent({ echarts })
    }
  })
], StatsFilamentUsage);
export {
  StatsFilamentUsage as default
};
</script>

<style></style>
