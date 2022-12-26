import { Vue } from 'nuxt-property-decorator';
import { IParams, IPrinterInfo } from '../../../types/common';
export default class DashboardPrinterAvatar extends Vue {
    klipperState: string;
    queueStatus: string;
    currentPrintjob: {
        metadata: {
            thumbnails: [];
        };
    };
    params: IParams;
    printerInfo: IPrinterInfo;
    get warning(): boolean;
    get white(): boolean;
    get success(): boolean;
    get error(): boolean;
    get bigImg(): string;
}
