<template>
  <ECharts
    ref="statsFilamentUsage"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 175px; width: 100%"
    v-intersect="visibilityChanged"
  ></ECharts>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "nuxt-property-decorator";
import { createComponent } from "echarts-for-vue";
import * as echarts from "echarts";
import { ECharts } from "echarts/core";

@Component({
  name: 'StatsFilamentUsage',
  components: {
    ECharts: createComponent({ echarts })
  }
})
export default class StatsFilamentUsage extends Vue {
  @Prop({ type: Array, default: () => [] }) filamentUsageArray!: []
  $refs!: {
    statsFilamentUsage: any;
  };

  // private chartOptions: any = {
  get chartOptions (): any {
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
        formatter: (datasets: any) => {
          let output = "";

          if (datasets.length) {
            output = datasets[0]["marker"];
            const outputTime = datasets[0]["axisValueLabel"];
            const a = outputTime.split(/[^0-9]/);
            const outputTimeDate = new Date(a[0], a[1] - 1, a[2]);
            const outputValue = Math.round(datasets[0]["data"][1] * 10) / 10;

            output +=
              outputTimeDate.toLocaleDateString() + ": " + outputValue + "m";
          }

          return output;
        }
      },
      xAxis: {
        type: "time",
        min: new Date().setHours(0, 0, 0) - 60 * 60 * 24 * 14 * 1000,
        max: new Date().setHours(0, 0, 0),
        minInterval: 60 * 60 * 24 * 1000,
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
          //rotate: 90,
          //showMaxLabel: false,
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

  visibilityChanged (entries: any, observer: any) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible) this.chart?.resize();
  }

  eventListenerResize (event: Event) {
    this.chart?.resize();
  }

  get chart (): ECharts | null {
    const historyFilamentUsage = this.$refs.statsFilamentUsage;
    return historyFilamentUsage?.inst ?? null;
  }

  mounted () {
    this.chartOptions.series[0].data = this.filamentUsageArray;
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

  @Watch("filamentUsageArray")
  filamentUsageArrayChanged (newVal: any) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }

  getImage (): string | undefined {
    return (
      this.chart?.getDataURL({
        pixelRatio: 2,
        backgroundColor: this.$vuetify.theme.dark ? "black" : "white"
      }) || "not results Flaments"
    );
  }
}
</script>

<style></style>
