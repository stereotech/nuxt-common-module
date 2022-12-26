import { Vue } from 'nuxt-property-decorator';
export default class DashboardPrinterHeaters extends Vue {
    printerInfo: {
        axisMode: string;
        model: string;
    };
    get heaters(): [];
    get fiber(): boolean;
}
