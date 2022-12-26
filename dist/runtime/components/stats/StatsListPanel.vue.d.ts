import { Vue } from "nuxt-property-decorator";
import { ServerPrintjobsStatePrintjob } from '../../../types/printjobs';
export default class StatsListPanel extends Vue {
    apiUrl: string;
    isPanel: boolean;
    allPrintStatusArray: [];
    jobs: [];
    statusInfo: [];
    priorityInfo: [];
    hideColumsSync: String[];
    countPerPageSync: number;
    search: string;
    options: {};
    sortBy: string;
    sortDesc: boolean;
    contextMenu: {
        shown: boolean;
        touchTimer: undefined;
        x: number;
        y: number;
        item: {};
    };
    detailsDialog: {
        item: {};
        boolShow: boolean;
    };
    refreshHistory(): void;
    get configHeaders(): ({
        text: string;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable: boolean;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable?: undefined;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        outputType: string;
        filterable?: undefined;
    })[];
    get headers(): ({
        text: string;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable: boolean;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable?: undefined;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        outputType: string;
        filterable?: undefined;
    })[];
    get filteredHeaders(): ({
        text: string;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable: boolean;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable?: undefined;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        outputType: string;
        filterable?: undefined;
    })[];
    sortFiles(items: any[], sortBy: string[], sortDesc: boolean[]): any[];
    advancedSearch(value: string, search: string): boolean;
    changeStatusVisible(status: any): void;
    changeColumnVisible(name: string): void;
    showContextMenu(e: any, item: ServerPrintjobsStatePrintjob): void;
    clickRow(item: ServerPrintjobsStatePrintjob, e: any): void;
    getSmallThumbnail(item: ServerPrintjobsStatePrintjob): string | false;
    getBigThumbnail(item: ServerPrintjobsStatePrintjob): string | false;
    getThumbnailWidth(item: ServerPrintjobsStatePrintjob): any;
    startPrint(item: ServerPrintjobsStatePrintjob): void;
    deleteJob(item: ServerPrintjobsStatePrintjob): void;
    getStatusIcon(status: string): never;
    getStatusColor(status: string): never;
    getPriorityIcon(priority: string): never;
    getPriorityColor(priority: string): never;
    get tableFields(): ({
        text: string;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable: boolean;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        filterable?: undefined;
        outputType?: undefined;
    } | {
        text: any;
        value: string;
        align: string;
        configable: boolean;
        visible: boolean;
        outputType: string;
        filterable?: undefined;
    })[];
    outputValue(col: any, item: any): any;
    formatDate(date: number): string;
    get switchStatus(): {
        text: string;
        icon: string;
        value: string;
        color: string;
    }[];
    isSwitch(item: any): boolean;
    changeStatus(item: ServerPrintjobsStatePrintjob, e: any): void;
    downloadCSV(): void;
    headerToCsv(): void;
    tableToCSV(): void;
    textCSV: string;
    getPrintingModeName(settings: any): any;
}
