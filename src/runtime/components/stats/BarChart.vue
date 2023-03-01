<template>
  <ECharts
    ref="echart"
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
  name: "BarChart",
  components: {
    ECharts: createComponent({ echarts }),
  },
})
export default class BarChart extends Vue {
  @Prop({ type: Array, default: () => [] }) data!: [];
  @Prop({ type: Boolean, default: false }) dark!: boolean;
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: Function, default: () => { } }) formatter!: (
    datasets: any
  ) => string;
  @Prop({
    type: Object,
    default: () => {
      return {};
    },
  })
  xAxis!: any;

  $refs!: {
    echart: any;
  };

  get chartOptions (): any {
    return {
      darkMode: true,
      animation: false,
      grid: {
        top: 30,
        right: 40,
        bottom: 30,
        left: 40,
      },
      title: {
        text: this.title,
        textStyle: {
          color: this.dark
            ? this.$vuetify.theme.currentTheme.secondary
            : this.$vuetify.theme.currentTheme.accent,
        },
      },
      tooltip: {
        trigger: "axis",
        borderWidth: 0,
        formatter: this.formatter,
      },
      xAxis: this.xAxis,
      yAxis: {
        type: "value",
        minInterval: 10,
        maxInterval: 100,
        nameLocation: "end",
        nameGap: 5,
        nameTextStyle: {
          color: this.dark
            ? this.$vuetify.theme.currentTheme.secondary
            : this.$vuetify.theme.currentTheme.accent,
          align: "left",
        },
        splitLine: {
          lineStyle: {
            color: this.dark
              ? this.$vuetify.theme.currentTheme.secondary
              : this.$vuetify.theme.currentTheme.accent,
          },
        },
        axisLabel: {
          color: this.dark
            ? this.$vuetify.theme.currentTheme.secondary
            : this.$vuetify.theme.currentTheme.accent,
          formatter: "{value}",
          //rotate: 90,
          //showMaxLabel: false,
          showMinLabel: true,
          margin: 5,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: this.dark
              ? this.$vuetify.theme.currentTheme.secondary
              : this.$vuetify.theme.currentTheme.accent,
          },
        },
      },
      color: [
        this.dark
          ? this.$vuetify.theme.currentTheme.secondary
          : this.$vuetify.theme.currentTheme.accent,
      ],
      series: [
        {
          type: "bar",
          data: [],
          showSymbol: false,
        },
      ],
    };
  }

  visibilityChanged (entries: any, observer: any) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible) this.chart.resize();
  }

  eventListenerResize (event: Event) {
    this.chart.resize();
  }

  get chart (): ECharts {
    const echart = this.$refs.echart;
    return echart.inst;
  }

  mounted () {
    this.chartOptions.series[0].data = this.data;
    this.chart.setOption(this.chartOptions);

    window.addEventListener("resize", this.eventListenerResize);
  }

  destroyed () {
    window.removeEventListener("resize", this.eventListenerResize);
  }

  beforeDestroy () {
    if (typeof window === "undefined") return;
    if (this.chart) this.chart.dispose();
  }

  @Watch("data")
  dataChanged (newVal: any) {
    this.chart.setOption({
      series: {
        data: newVal,
      },
    });
  }

  getImage (): string | undefined {
    return (
      this.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: this.dark ? "black" : "white",
      }) || "not results allPrintStatus"
    );
  }

  getGeometry () {
    return {
      width: this.chart.getWidth() || 0,
      height: this.chart.getHeight() || 0,
    };
  }
}
</script>

<style></style>
