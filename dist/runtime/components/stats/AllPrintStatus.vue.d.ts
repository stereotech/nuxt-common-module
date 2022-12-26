import { Vue } from "nuxt-property-decorator";
import { ECharts } from "echarts/core";
export default class StatsAllPrintStatus extends Vue {
    printStatusArray: [];
    $refs: {
        statsAllPrintStatus: any;
    };
    get chartOptions(): any;
    get allPrintStatusArray(): any[];
    get chart(): ECharts | null;
    mounted(): void;
    destroyed(): void;
    beforeDestroy(): void;
    allPrintStatusArrayChanged(newVal: any): void;
    visibilityChanged(entries: any, observer: any): void;
    eventListenerResize(event: Event): void;
    getImage(): string | undefined;
    getGeometry(): {
        width: any;
        height: any;
    };
}
