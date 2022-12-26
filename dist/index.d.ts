import { Context, Module } from '@nuxt/types';

interface IHelpers {
    findDirectory: (folder: FileStateFile[], dirArray: string[]) => FileStateFile[] | null;
    caseInsensitiveSort: (values: any[], orderType: string) => any[];
    capitalize: (str: string) => string;
    convertPanelnameToIcon: (name: string) => string;
    camelize: (str: string) => string;
    formatConsoleMessage: (message: string) => string;
    convertName: (name: string) => string;
    formatFilesize: (fileSizeInBytes: number) => string;
    formatDate: (date: number, offset: number) => string;
    formatFrequency: (frequency: number) => string;
    sortFiles: (items: FileStateFile[] | null, sortBy: string[], sortDesc: boolean[]) => FileStateFile[];
    strLongestEqual: (a: string, b: string) => string;
    reverseString: (str: string) => string;
    formatTime: (date: Date, offset: number) => string;
    cyrillicTransform: (input: string, spaceReplacement?: string) => string;
    formatPrintTime: (totalSeconds: number, days?: boolean) => string;
    formatLength: (value: number) => string;
}
interface FileStateFile {
    isDirectory: boolean;
    filename: string;
    modified: number;
    childrens?: FileStateFile[];
    disk_usage?: FileStateDiskUsage;
    print_start_time?: Date | null;
    job_id?: string | null;
    estimated_time?: number;
    filament_total?: number;
    filament_weight_total?: number;
    first_layer_height?: number;
    first_layer_bed_temp?: number;
    first_layer_extr_temp?: number;
    gcode_start_byte?: number;
    gcode_end_byte?: number;
    layer_height?: number;
    object_height?: number;
    slicer?: string;
    slicer_version?: string;
    thumbnails?: FileStateFileThumbnail[];
    metadataPulled?: boolean;
    size?: number;
    printing_mode?: string;
    settings: any;
}
interface FileStateDiskUsage {
    free: number;
    total: number;
    used: number;
}
interface FileStateFileThumbnail {
    width: number;
    height: number;
    size: number;
    relative_path: string;
}

declare class Helpers implements IHelpers {
    capitalize(str: string): string;
    findDirectory(folder: FileStateFile[], dirArray: string[]): FileStateFile[] | null;
    caseInsensitiveSort(values: any[], orderType: string): any[];
    convertPanelnameToIcon(name: string): string;
    camelize(str: string): string;
    formatConsoleMessage(message: string): string;
    convertName(name: string): string;
    formatFilesize(fileSizeInBytes: number): string;
    formatDate(date: number, offset?: number): string;
    formatFrequency(frequency: number): string;
    sortFiles(items: FileStateFile[] | null, sortBy: string[], sortDesc: boolean[]): FileStateFile[];
    strLongestEqual(a: string, b: string): string;
    reverseString(str: string): string;
    formatTime(date: Date, offset?: number): string;
    cyrillicTransform(input: string, spaceReplacement?: string): string;
    _firstLetters: {
        [letter: string]: string;
    };
    _nonFirstLetters: {
        [letter: string]: string;
    } & {
        й: string;
        е: string;
    };
    formatPrintTime(totalSeconds: number, days?: boolean): string;
    formatLength(value: number): string;
    constructor();
}

type MessageType = 'success' | 'info' | 'error' | 'warning';
interface Message {
    type: MessageType;
    text: string;
    actions?: MessageAction[];
    timeout?: number;
}
interface MessageAction {
    text: string;
    onClick: (e: any) => void;
    closeOnClick?: boolean;
}

declare class Notification {
    context: Context;
    constructor(context: Context);
    call(message: Message): void;
}

type Common = {
    name: string;
    helpers: any;
    notify: any;
};

declare module '@nuxt/types' {
    interface Context {
        $common: Common;
        $helpers: Helpers;
        $notify: Notification;
    }
    interface NuxtAppOptions {
        $common: Common;
        $helpers: Helpers;
        $notify: Notification;
    }
    interface Configuration {
        common?: Partial<ModuleOptions>;
    }
}

interface ModuleOptions {
    a: boolean;
    b: number;
    c: string;
}
declare const commonModule: Module<ModuleOptions>;

declare const meta: any;

export { ModuleOptions, commonModule as default, meta };
