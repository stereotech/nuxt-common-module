<template>
  <ECharts
    ref="echartDiagram"
    :option="options"
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
  name: "StatsEchartsGauge",
  components: {
    ECharts: createComponent({ echarts }),
  },
})
export default class StatsEchartsGauge extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return { name: "", value: 0, itemStyle: {} };
    },
  })
  data!: { name: String; value: Number; itemStyle: Object };

  $refs!: {
    echartDiagram: any;
  };

  get options(): any {
    return {
      darkMode: this.$vuetify.theme.dark,
      tooltip: {
        trigger: "item",
        borderWidth: 2,
      },
      title: {
        text: this.allDataArray[0].title,
        textStyle: {
          color: this.$vuetify.theme.dark
            ? this.$vuetify.theme.currentTheme.secondary
            : this.$vuetify.theme.currentTheme.accent,
          fontSize: 16,
        },
      },

      series: [
        {
          type: "gauge",
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: false,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: "#464646",
            },
          },
          axisLine: {
            // линии диаграммы
            lineStyle: {
              width: 20,
            },
          },
          splitLine: {
            // засечки как на часах Часы
            show: false,
            distance: 0,
            length: 10,
          },
          axisTick: {
            // засечки как на часах Минуты
            show: false,
          },
          axisLabel: {
            // засечки цифровые
            show: false,
            distance: 50,
          },
          data: [],
          title: {
            fontSize: 0, // размер шрифта в центре
          },
          detail: {
            // проценты в центре
            width: 50,
            height: 14,
            fontSize: 14,
            color: "black",
            borderColor: "inherit",
            borderRadius: 20,
            borderWidth: 0,
            formatter: "{value}%",
          },
        },
      ],
    };
  }

  get allDataArray() {
    let arr = [
      {
        value: this.data.value,
        detail: {
          valueAnimation: true,
          offsetCenter: ["0%", "0%"],
        },
        itemStyle: this.data.itemStyle,
        title: this.data.name,
      },
    ];
    return arr;
  }

  get chart(): ECharts {
    return this.$refs.echartDiagram.inst;
  }

  mounted() {
    this.options.series[0].data = this.allDataArray;
    this.chart.setOption(this.options);

    window.addEventListener("resize", this.eventListenerResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.eventListenerResize);
  }

  beforeDestroy() {
    if (typeof window === "undefined") return;
    if (this.chart) this.chart.dispose();
  }

  @Watch("allDataArray")
  allDataArrayChanged(newVal: any) {
    this.options.series[0].data = this.allDataArray;
    this.chart.setOption(this.options);
  }

  visibilityChanged(entries: any, observer: any) {
    const isVisible = entries[0].isIntersecting;
    if (isVisible) this.chart.resize();
  }

  eventListenerResize(event: Event) {
    this.chart.resize();
  }

  getImage(): string | undefined {
    return (
      this.chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: this.$vuetify.theme.dark ? "black" : "white",
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
