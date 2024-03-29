<template>
  <v-card v-bind="$attrs" v-on="$listeners" min-width="200" min-height="200">
    <card-title icon="mdi-webcam" :title="title">
      <v-spacer></v-spacer>
      <v-btn v-if="zoomable" @click="zoomInImage" icon>
        <v-icon v-if="isZoomed">mdi-magnify-minus-outline</v-icon>
        <v-icon v-else>mdi-magnify-plus-outline</v-icon>
      </v-btn>
      <v-btn
        v-if="lighting.enable"
        icon
        @click="lightControl"
        :color="lighting.color"
      >
        <v-icon v-if="lightIsOff">mdi-lightbulb-outline</v-icon>
        <v-icon v-else>mdi-lightbulb-off-outline</v-icon>
      </v-btn>
    </card-title>
    <v-card-text>
      <div
        v-intersect="onIntersect"
      >
        <div class="text-center py-5" v-if="!isLoaded">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
        <canvas
          ref="mjpegstreamerAdaptive"
          :class="
            'webcamImage ' +
            (isLoaded ? '' : 'hiddenWebcam')
          "
        ></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import CardTitle from "../CardTitle.vue";

@Component({
  name: "WebcamCard",
  components: {
    CardTitle,
  },
})
export default class WebcamCard extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {
        enable: false,
        color: "",
      };
    },
  })
  lighting!: { enable: Boolean; color: String };
  @Prop({ type: String, default: "" }) url!: string;
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: Boolean, default: false }) zoomable!: boolean;
  @Prop({ type: Number, default: 0}) rotation!: number

  isVisible = false;
  refresh = Math.ceil(Math.random() * Math.pow(10, 12));
  isLoaded = true;
  timer: any = undefined;
  request_start_time = performance.now();
  start_time = performance.now();
  time = 0;
  request_time = 0;
  time_smoothing = 0.6;
  request_time_smoothing = 0.1;


  isZoomed = false;
  zoomInImage () {
    this.isZoomed = !this.isZoomed;
  }

  $refs!: {
    mjpegstreamerAdaptive: HTMLCanvasElement;
  };

  onIntersect (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) {
    const isVisible = entries[0].isIntersecting;
    this.isVisible = isVisible;
    if (isVisible) {
      this.refreshFrame();
    } else {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  device: any = null;
  deviceId: any = null;

  onCameras (cameras: any) {
    this.device = cameras.length > 0 ? cameras[0] : null;
    this.deviceId = this.device.deviceId;
  }

  refreshFrame () {
    if (this.isVisible) {
      this.refresh = new Date().getTime();
      this.setFrame();
    }
  }

  get rotationParams() {
    const sin_a = Math.sin(this.rotation * Math.PI / 180)
    const cos_a = Math.cos(this.rotation * Math.PI / 180)
    return {
      sin_a,
      cos_a
    }
  }

  async setFrame () {
    const url = new URL(this.url);

    this.request_start_time = performance.now();
    let canvas = this.$refs.mjpegstreamerAdaptive;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const frame = await this.loadImage(url.toString());
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientWidth * ((Math.abs(frame.width * this.rotationParams.sin_a) + Math.abs(frame.height * this.rotationParams.cos_a)) / (Math.abs(frame.width*this.rotationParams.cos_a) + Math.abs(frame.height * this.rotationParams.sin_a)));

      if (ctx) {
        if (this.isZoomed) {
          ctx.scale(2, 2)
        }
        const rot_width = Math.abs(canvas.height*this.rotationParams.sin_a) + Math.abs(canvas.width * this.rotationParams.cos_a)
        const rot_height = Math.abs(canvas.height*this.rotationParams.cos_a) + Math.abs(canvas.width * this.rotationParams.sin_a)
        ctx.translate(canvas.width/(this.isZoomed ? 4 : 2), canvas.height/(this.isZoomed ? 4 : 2))
        ctx.rotate(this.rotation * Math.PI / 180)
      ctx.drawImage(
        frame,
        0,
        0,
        frame.width,
        frame.height,
        -rot_width/2,
        -rot_height/2,
        rot_width,
        rot_height
      );

      }

      this.isLoaded = true;
    }

    this.$nextTick(() => {
      this.onLoad();
    });
  }

  loadImage (url: string): Promise<HTMLImageElement> {
    return new Promise((r) => {
      let image = new Image();
      image.onload = () => r(image);
      image.onerror = () => setTimeout(this.refreshFrame, 1000);
      image.src = url;
    });
  }

  onLoad () {
    this.isLoaded = true;

    const end_time = performance.now();
    const current_time = end_time - this.start_time;
    this.time =
      this.time * this.time_smoothing +
      current_time * (1.0 - this.time_smoothing);
    this.start_time = end_time;

    const target_time = 100;

    const current_request_time = performance.now() - this.request_start_time;
    this.request_time =
      this.request_time * this.request_time_smoothing +
      current_request_time * (1.0 - this.request_time_smoothing);
    const timeout = Math.max(0, target_time - this.request_time);

    this.$nextTick(() => {
      this.timer = setTimeout(this.refreshFrame, timeout);
    });
  }

  get lightIsOff () {
    return this.lighting.color === "rgb(0, 0, 0)";
  }

  lightControl () {
    this.$emit("light");
  }
}
</script>

<style scoped>
.rotate {
  transform: translateY(40%) rotate(-90deg);
  overflow: hidden;
}

.norotate {
  overflow: hidden;
}

.webcamImage {
  width: 100%;
  border: 1px solid #ccc;
}

.webcamFpsOutput {
  display: inline-block;
  position: absolute;
  bottom: 6px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 3px 10px;
  border-top-left-radius: 5px;
}

.zoomedWebcam {
  -webkit-transform: scale(2.5); /* Safari and Chrome */
  -moz-transform: scale(2.5); /* Firefox */
  -ms-transform: scale(2.5); /* IE 9 */
  -o-transform: scale(2.5); /* Opera */
  transform: scale(2.5);
}
</style>
