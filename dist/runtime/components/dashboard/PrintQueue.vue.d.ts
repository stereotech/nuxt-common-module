import { Vue } from 'nuxt-property-decorator';
import { DataTableHeader } from 'vuetify';
import { ServerPrintjobsStatePrintjob } from '../../../types/printjobs';
import { IParams, IPrinterInfo } from '../../../types/common';
interface createDialog {
    bool: boolean;
    edit: boolean;
    item: ServerPrintjobsStatePrintjob;
    valid: boolean;
}
export default class DashboardPrintQueue extends Vue {
    printjobsSync: [];
    lastPrintedSync: ServerPrintjobsStatePrintjob;
    loadings: string[];
    diskUsage: {};
    validGcodeExtensions: string[];
    params: IParams;
    printerInfo: IPrinterInfo;
    optionsSync: {
        sortBy: string[];
        sortDesc: boolean[];
        showHiddenFiles: boolean;
        itemsPerPage: number;
        hideMetadataColums: String[];
    };
    filesForCopyDialogSync: [];
    filetree: [];
    isStartPrintPress: boolean;
    get headers(): DataTableHeader<any>[];
    get lastFileheaders(): DataTableHeader<any>[];
    createDialog: createDialog;
    showContextMenu(e: any, item: ServerPrintjobsStatePrintjob): void;
    private contextMenu;
    deleteJob(item: ServerPrintjobsStatePrintjob): void;
    editJob(item: ServerPrintjobsStatePrintjob): void;
    startPrint(item: ServerPrintjobsStatePrintjob): void;
    printStateChanged(newVal: string): void;
    get isTablet(): boolean;
    get isDesktop(): boolean;
    get isWidescreen(): boolean;
    setPriority(item: ServerPrintjobsStatePrintjob, priority?: 'NORMAL' | 'HIGH' | 'LOW' | 'DELAY'): void;
    updatePrintjob(item: {}): void;
    changePrintjobsSync(newVal: any): void;
    getPriorityNumber(priority: string): 0 | 1 | 2 | 3;
    postDirectory(options: any, settings: any): void;
    getDirectory(options: any, settings: any): void;
    socketAddLoading(obj: any): void;
    socketRemoveLoading(obj: any): void;
    setGcodefilesMetadata(obj: any): void;
    serverFilesMove(options: any, settings: any): void;
    serverFilesCopy(options: any, settings: any): void;
    serverFilesMetadata(options: any, settings: any): void;
    printerGcodeScript(options: any, settings: any): void;
    serverFilesDeleteFile(options: any, settings: any): void;
    serverFilesDeleteDirectory(options: any, settings: any): void;
    serverPrintjobsPostJob(options: any, settings: any): void;
}
export {};
