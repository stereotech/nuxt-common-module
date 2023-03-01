<template>
  <ECharts
    ref="echart"
    :option="chartOptions"
    :init-options="{ renderer: 'svg' }"
    style="height: 250px; width: 100%"
    v-intersect="visibilityChanged"
  ></ECharts>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "nuxt-property-decorator";
import * as echarts from "echarts";
import { ECharts } from "echarts/core";
import { createComponent } from "echarts-for-vue";

@Component({
  name: "PieChart",
  components: {
    ECharts: createComponent({ echarts }),
  },
})
export default class PieChart extends Vue {
  @Prop({ type: Array, default: () => [] }) data!: [];
  @Prop({ type: Boolean, default: false }) dark!: boolean;
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: Function, default: () => {} }) formatter!: (
    datasets: any
  ) => string;

  $refs!: {
    echart: any;
  };

  get chartOptions(): any {
    return {
      darkMode: this.dark,
      animation: false,
      grid: {
        top: 10,
        right: 0,
        bottom: 0,
        left: 10,
      },
      tooltip: {
        trigger: "item",
        borderWidth: 0,
        formatter: this.formatter,
      },
      title: {
        text: this.title,
        textStyle: {
          color: this.dark
            ? this.$vuetify.theme.currentTheme.secondary
            : this.$vuetify.theme.currentTheme.accent,
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
            borderColor: this.dark
              ? this.$vuetify.theme.currentTheme.secondary
              : this.$vuetify.theme.currentTheme.accent,
            borderWidth: 1,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: this.dark
                ? this.$vuetify.theme.currentTheme.secondary
                : this.$vuetify.theme.currentTheme.accent,
            },
          },
          label: {
            color: this.dark
              ? this.$vuetify.theme.currentTheme.secondary
              : this.$vuetify.theme.currentTheme.accent,
          },
          labelLine: {
            lineStyle: {
              color: this.dark
                ? this.$vuetify.theme.currentTheme.secondary
                : this.$vuetify.theme.currentTheme.accent,
            },
          },
        },
      ],
    };
  }

  get chart(): ECharts {
    const echart = this.$refs.echart;
    return echart.inst;
  }

  mounted() {
    this.chartOptions.series[0].data = this.data;
    this.chart.setOption(this.chartOptions);

    window.addEventListener("resize", this.eventListenerResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.eventListenerResize);
  }

  eventListenerResize(event: Event) {
    this.chart.resize();
  }

  visibilityChanged(entries: any, observer: any) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible) this.chart.resize();
  }

  beforeDestroy() {
    if (typeof window === "undefined") return;
    if (this.chart) this.chart.dispose();
  }

  @Watch("data")
  dataChanged(newVal: any) {
    this.chart.setOption({
      series: {
        data: newVal,
      },
    });
  }

  getImage(): string | undefined {
    return (
      this.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: this.dark ? "black" : "white",
      }) || "not results allPrintStatus"
    );
  }

  getGeometry() {
    return {
      width: this.chart.getWidth() || 0,
      height: this.chart.getHeight() || 0,
    };
  }
}
</script>

<style></style>
