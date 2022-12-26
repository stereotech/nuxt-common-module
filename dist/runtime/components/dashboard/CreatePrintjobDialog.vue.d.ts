import { Vue } from 'nuxt-property-decorator';
import { IParams, IPrinterInfo } from '../../../types/common';
import { ServerPrintjobsStatePrintjob } from '../../../types/printjobs';
interface ICreateDialog {
    bool: boolean;
    edit: boolean;
    item: ServerPrintjobsStatePrintjob;
    valid: boolean;
}
export default class DashboardCreatePrintjobDialog extends Vue {
    createDialog: ICreateDialog;
    createDialogSync: ICreateDialog;
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
    printMode: string;
    closeCreateDialog(): void;
    fileSelectorDialog: {
        bool: boolean;
    };
    timePickerMenu: boolean;
    copies: number;
    clearFileSelection(): void;
    get ticksLabels(): any[];
    private rules;
    get selectedPriority(): number;
    set selectedPriority(newVal: number);
    get priorityIcons(): {
        icon: string;
        color: string;
    }[];
    get delayTime(): string;
    set delayTime(newVal: string);
    createPrintjob(): void;
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
    closeFileManagerDialog(): void;
}
export {};
