import { Vue } from "nuxt-property-decorator";
export default class StatsMain extends Vue {
    printtimeAvgArray: [];
    filamentUsageArray: [];
    totalPrintTime: number;
    longestPrintTime: number;
    totalFilamentUsed: number;
    totalJobsCount: number;
    printerName: string;
    $refs: {
        filamentUsage: any;
        printTimeAvg: any;
        allDiadramsAsImage: HTMLCanvasElement;
        imgForFilamentUsage: HTMLImageElement;
        imgForAPrintTimeAvg: HTMLImageElement;
        linkForDownload: HTMLLinkElement;
    };
    get avgPrintTime(): number;
    formatTime(totalSeconds: number): any;
    refreshHistory(): void;
    get canvasCTX(): CanvasRenderingContext2D | null;
}
