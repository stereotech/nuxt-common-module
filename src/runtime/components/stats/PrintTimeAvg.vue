<template>
  <ECharts
    ref="statsPrinttimeAvg"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 175px; width: 100%"
    v-intersect="visibilityChanged"
  ></ECharts>
</template>

<script lang="ts">
import { createComponent } from "echarts-for-vue";
import * as echarts from "echarts";
import { ECharts } from "echarts/core";
import { Vue, Component, Watch, Prop } from "nuxt-property-decorator";

@Component({
  name: 'StatsPrintTimeAvg',
  components: {
    ECharts: createComponent({ echarts })
  }
})
export default class StatsPrintTimeAvg extends Vue {
  @Prop({ type: Array, default: () => { } }) printtimeAvgArray!: []
  $refs!: {
    statsPrinttimeAvg: any;
  };

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
        },
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

  get chart (): ECharts | null {
    const historyPrinttimeAvg = this.$refs.statsPrinttimeAvg;
    return historyPrinttimeAvg?.inst ?? null;
  }

  mounted () {
    this.chartOptions.series[0].data = this.printtimeAvgArray;
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

  @Watch("printtimeAvgArray")
  printtimeAvgArrayChanged (newVal: any) {
    this.chart?.setOption({
      series: {
        data: newVal
      }
    });
  }

  visibilityChanged (isVisible: boolean) {
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
      }) || "not results Flament"
    );
  }
}
</script>

<style></style>
