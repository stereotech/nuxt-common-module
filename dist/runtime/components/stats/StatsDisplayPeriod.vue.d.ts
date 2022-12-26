import { Vue } from "nuxt-property-decorator";
export default class StatsDisplayPeriod extends Vue {
    printStatusTime: [];
    printStatusArray: [];
    materialStatusArray: [];
    printerName: string;
    isPanel: boolean;
    displayPeriod: string;
    datesSync: [];
    period: string;
    periodChange(newVal: any): void;
    private showDialogSelectPeriod;
    get showPicker(): boolean;
    get items(): {
        text: string;
        value: string;
    }[];
    nowDate(): string;
    get dateRangeText(): string;
    refreshHistory(options: any, settings: any): void;
}
