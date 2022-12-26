import { Vue } from 'nuxt-property-decorator';
import { IPrinterInfo } from '../../../types/common';
export default class DashboardPrinterActions extends Vue {
    klipperState: string;
    klippyIsConnected: boolean;
    queueStatusSync: string;
    currentPrintjob: {
        name: '';
        metadata: {
            thumbnails: [];
        };
    };
    printerInfo: IPrinterInfo;
    socketInfo: {};
    klippyMessage: '';
    events: [{
        formatMessage: '';
    }];
    get lastErrorEventMessage(): "";
    get stateActions(): {
        name: any;
        key: string;
    }[];
    firmwareRestart(): void;
    get estimatedPrintTime(): string | undefined;
    get timeSpent(): string;
}
