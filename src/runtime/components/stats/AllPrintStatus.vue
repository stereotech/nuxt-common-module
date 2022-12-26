<template>
  <ECharts
    ref="statsAllPrintStatus"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 250px; width: 100%"
    v-intersect="visibilityChanged"
  ></ECharts>
</template>

<script lang="ts">
import { Vue, Component, mixins, Watch, Prop } from "nuxt-property-decorator";
import * as echarts from "echarts";
import { ECharts } from "echarts/core";
import { createComponent } from "echarts-for-vue";

@Component({
  name: 'StatsAllPrintStatus',
  components: {
    ECharts: createComponent({ echarts })
  }
})
export default class StatsAllPrintStatus extends Vue {
  @Prop({ type: Array, default: () => [] }) printStatusArray!: []

  $refs!: {
    statsAllPrintStatus: any;
  };

  get chartOptions (): any {
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
        borderWidth: 0
      },
      title: {
        text: this.$t("Statistics.Quantity"),
        textStyle: {
          color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
        },
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
          label: {
            color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
          },
          labelLine: {
            lineStyle: {
              color: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: this.$vuetify.theme.dark ? this.$vuetify.theme.currentTheme.secondary : this.$vuetify.theme.currentTheme.accent
            }
          }
        }
      ]
    };
  }

  get allPrintStatusArray () {
    let arr = this.printStatusArray.map(
      (i: any) => {
        return {
          ...i,
          name: this.$t(i.name)
        };
      }
    );
    return arr;
  }

  get chart (): ECharts | null {
    const historyAllPrintStatus = this.$refs.statsAllPrintStatus;
    return historyAllPrintStatus?.inst ?? null;
  }

  mounted () {
    this.chartOptions.series[0].data = this.allPrintStatusArray;
    this.chart?.setOption(this.chartOptions);

    window.addEventListener("resize", this.eventListenerResize);
  }

  destroyed () {
    window.removeEventListener("resize", this.eventListenerResize);
  }

  beforeDestroy () {
    if (typeof window === "undefined") return;
    if (this.chart) this.chart.dispose();
  }

  @Watch("allPrintStatusArray")
  allPrintStatusArrayChanged (newVal: any) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }

  visibilityChanged (entries: any, observer: any) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible) this.chart?.resize();
  }

  eventListenerResize (event: Event) {
    this.chart?.resize();
  }

  getImage (): string | undefined {
    return (
      this.chart?.getDataURL({
        pixelRatio: 2,
        backgroundColor: this.$vuetify.theme.dark ? "black" : "white"
      }) || "not results allPrintStatus"
    );
  }

  getGeometry () {
    return {
      width: this.chart?.getWidth() || 0,
      height: this.chart?.getHeight() || 0
    };
  }
}
</script>

<style></style>
