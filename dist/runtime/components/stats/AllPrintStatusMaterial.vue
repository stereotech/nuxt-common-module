<template>
  <ECharts
    ref="statsAllPrintStatusMaterial"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 250px; width: 100%"
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
import * as echarts from "echarts";
import { createComponent } from "echarts-for-vue";
let StatsAllPrintStatusMaterial = class extends Vue {
  get chartOptions() {
    return {
      darkMode: this.$vuetify.theme.dark,
      animation: false,
      grid: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 10
      },
      tooltip: {
        trigger: "item",
        borderWidth: 0,
        formatter: (datasets) => {
          let output = `${datasets["marker"]} ${datasets["data"]["name"]}<br/>`;
          output += `${this.$helpers.formatLength(datasets["value"])}<br/><b>${datasets["percent"]}%</b>`;
          return output;
        }
      },
      title: {
        text: this.$t("Statistics.Material"),
        textStyle: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
        }
      },
      series: [
        {
          type: "pie",
          data: [],
          avoidLabelOverlap: false,
          radius: ["35%", "60%"],
          itemStyle: {
            borderRadius: 1,
            borderColor: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent,
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
            }
          },
          label: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          },
          labelLine: {
            lineStyle: {
              color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
            }
          }
        }
      ]
    };
  }
  get allPrintStatusArray() {
    return this.materialStatusArray.map(
      (i) => {
        return {
          ...i,
          name: this.$t(i.name)
        };
      }
    );
  }
  get chart() {
    const historyAllPrintStatus = this.$refs.statsAllPrintStatusMaterial;
    return historyAllPrintStatus?.inst ?? null;
  }
  mounted() {
    this.chartOptions.series[0].data = this.allPrintStatusArray;
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
  allPrintStatusArrayChanged(newVal) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }
  visibilityChanged(entries, observer) {
    const isVisible = entries[0].isIntersecting;
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
    }) || "not results allPrintStatus";
  }
  getGeometry() {
    return {
      width: this.chart?.getWidth() || 0,
      height: this.chart?.getHeight() || 0
    };
  }
};
__decorateClass([
  Prop({ type: Array, default: () => {
  } })
], StatsAllPrintStatusMaterial.prototype, "materialStatusArray", 2);
__decorateClass([
  Watch("allPrintStatusArray")
], StatsAllPrintStatusMaterial.prototype, "allPrintStatusArrayChanged", 1);
StatsAllPrintStatusMaterial = __decorateClass([
  Component({
    name: "StatsAllPrintStatusMaterial",
    components: {
      ECharts: createComponent({ echarts })
    }
  })
], StatsAllPrintStatusMaterial);
export {
  StatsAllPrintStatusMaterial as default
};
</script>

<style></style>
