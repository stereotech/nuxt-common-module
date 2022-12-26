import { Vue } from "nuxt-property-decorator";
export default class StatsFilter extends Vue {
    printStatusTime: [];
    printStatusArray: [];
    materialStatusArray: [];
    printerName: string;
    isPanel: boolean;
    $refs: {
        allPrintStatus: any;
        allPrintStatusTime: any;
        printStatusMaterial: any;
        allDiadramsAsImage: HTMLCanvasElement;
        imgForAllPrintStatus: HTMLImageElement;
        imgForAllPrintStatusTime: HTMLImageElement;
        imgForPrintStatusMaterial: HTMLImageElement;
        linkForDownload: HTMLLinkElement;
    };
    formatTime(totalSeconds: number): any;
    get withoutIdle(): number;
    get successfulDetails(): number;
    refreshHistory(): void;
    get imgGeometry(): any;
    get canvasCTX(): CanvasRenderingContext2D | null;
    downloadStatisticty(): void;
    drawImages(img: HTMLImageElement, src: string, x?: number, y?: number): void;
}
