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
import { Vue, Component, Watch, Prop } from "nuxt-property-decorator";
import * as echarts from "echarts";
import { ECharts } from "echarts/core";
import { createComponent } from "echarts-for-vue";

@Component({
  name: 'StatsAllPrintStatusTime',
  components: {
    ECharts: createComponent({ echarts })
  }
})
export default class StatsAllPrintStatusTime extends Vue {
  @Prop({ type: Array, default: () => [] }) printStatusTime!: []
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
        borderWidth: 0,
        formatter: (datasets: any) => {
          let output = "";
          output = datasets["marker"];
          const outputValue = this.$helpers.formatPrintTime(datasets["value"]);
          output += `${datasets["data"]["name"]}<br/>${outputValue}<br/><b>${datasets["percent"]}%</b>`;
          return output;
        }
      },
      title: {
        text: this.$t("Statistics.Time"),
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
    return this.printStatusTime.map(
      (i: any) => {
        return {
          ...i,
          name: this.$t(i.name)
        };
      }
    );
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
      }) || "not results allPrintStatusTime"
    );
  }
}
</script>

<style></style>
