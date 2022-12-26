<template>
  <ECharts
    ref="statsPrinttimeAvg"
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
import { createComponent } from "echarts-for-vue";
import * as echarts from "echarts";
import { Vue, Component, Watch, Prop } from "nuxt-property-decorator";
let StatsPrintTimeAvg = class extends Vue {
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
      tooltip: {
        trigger: "item",
        borderWidth: 0
      },
      xAxis: {
        type: "category",
        data: ["0-2h", "2-6h", "6-12h", "12-24h", ">24h"],
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
      title: {
        text: this.$t("Statistics.PrinttimeAvg"),
        textStyle: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
        }
      },
      series: [
        {
          type: "bar",
          data: [],
          itemStyle: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          }
        }
      ]
    };
  }
  get chart() {
    const historyPrinttimeAvg = this.$refs.statsPrinttimeAvg;
    return historyPrinttimeAvg?.inst ?? null;
  }
  mounted() {
    this.chartOptions.series[0].data = this.printtimeAvgArray;
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
  printtimeAvgArrayChanged(newVal) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }
  visibilityChanged(isVisible) {
    if (isVisible)
      this.chart?.resize();
  }
  eventListenerResize(event) {
    this.chart?.resize();
  }
  getImage() {
    return this.chart?.getDataURL({
      pixelRatio: 2,
      backgroundColor: this.$vuetify.theme.dark ? "black" : "white"
    }) || "not results Flament";
  }
};
__decorateClass([
  Prop({ type: Array, default: () => {
  } })
], StatsPrintTimeAvg.prototype, "printtimeAvgArray", 2);
__decorateClass([
  Watch("printtimeAvgArray")
], StatsPrintTimeAvg.prototype, "printtimeAvgArrayChanged", 1);
StatsPrintTimeAvg = __decorateClass([
  Component({
    name: "StatsPrintTimeAvg",
    components: {
      ECharts: createComponent({ echarts })
    }
  })
], StatsPrintTimeAvg);
export {
  StatsPrintTimeAvg as default
};
</script>

<style></style>
