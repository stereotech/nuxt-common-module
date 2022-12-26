import { Vue } from "nuxt-property-decorator";
import { ECharts } from "echarts/core";
export default class StatsFilamentUsage extends Vue {
    filamentUsageArray: [];
    $refs: {
        statsFilamentUsage: any;
    };
    get chartOptions(): any;
    visibilityChanged(entries: any, observer: any): void;
    eventListenerResize(event: Event): void;
    get chart(): ECharts | null;
    mounted(): void;
    destroyed(): void;
    beforeDestroy(): void;
    filamentUsageArrayChanged(newVal: any): void;
    getImage(): string | undefined;
}
