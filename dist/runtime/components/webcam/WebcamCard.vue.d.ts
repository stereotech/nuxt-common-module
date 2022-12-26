import { Vue } from "nuxt-property-decorator";
export default class WebcamCard extends Vue {
    lighting: {
        enableLightControl: Boolean;
        lightColor: String;
    };
    url: string;
    isVisible: boolean;
    refresh: number;
    private isLoaded;
    private timer;
    private request_start_time;
    private start_time;
    private time;
    private request_time;
    private time_smoothing;
    private request_time_smoothing;
    private currentFPS;
    showFps: boolean;
    isLightTurnOn: boolean;
    isZoomed: boolean;
    zoomInImage(): void;
    $refs: {
        mjpegstreamerAdaptive: any;
    };
    onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
    device: any;
    deviceId: any;
    onCameras(cameras: any): void;
    refreshFrame(): void;
    setFrame(): Promise<void>;
    loadImage(url: string): Promise<unknown>;
    onLoad(): void;
    get lightIsOff(): boolean;
    lightControl(): void;
}
