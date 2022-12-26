import { Vue } from 'nuxt-property-decorator';
import { IParams, IPrinterInfo } from '../../../types/common';
export default class DashboardPrinter extends Vue {
    lightColor: string;
    klipperState: string;
    klippyIsConnected: boolean;
    queueStatusSync: string;
    params: IParams;
    printerInfo: IPrinterInfo;
    socketInfo: {};
    klippyMessage: '';
    events: [];
    isTemperatureDialogOpen: boolean;
    lightControl(): void;
    get lightIsOff(): boolean;
    get fiber(): boolean;
}
