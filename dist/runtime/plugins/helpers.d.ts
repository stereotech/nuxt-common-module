import { FileStateFile, IHelpers } from '../../types/helpers';
export declare class Helpers implements IHelpers {
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
