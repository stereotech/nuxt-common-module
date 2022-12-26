import { ECharts } from "echarts/core";
import { Vue } from "nuxt-property-decorator";
export default class StatsPrintTimeAvg extends Vue {
    printtimeAvgArray: [];
    $refs: {
        statsPrinttimeAvg: any;
    };
    get chartOptions(): any;
    get chart(): ECharts | null;
    mounted(): void;
    destroyed(): void;
    beforeDestroy(): void;
    printtimeAvgArrayChanged(newVal: any): void;
    visibilityChanged(isVisible: boolean): void;
    eventListenerResize(event: Event): void;
    getImage(): string | undefined;
}
