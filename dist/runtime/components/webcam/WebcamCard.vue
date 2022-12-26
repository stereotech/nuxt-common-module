<template>
  <div>
    <v-card>
      <card-title
        icon="mdi-webcam"
        :title="$t('Camera.Camera')"
        :id="'webcam-card'"
      >
        <v-spacer></v-spacer>
        <v-btn v-if="lighting.enableLightControl" @click="zoomInImage" icon>
          <v-icon v-if="isZoomed">mdi-magnify-minus-outline</v-icon>
          <v-icon v-else>mdi-magnify-plus-outline</v-icon>
        </v-btn>
        <v-btn
          v-if="lighting.enableLightControl"
          icon
          @click="lightControl"
          :color="lighting.lightColor"
        >
          <v-icon v-if="lightIsOff">mdi-lightbulb-outline</v-icon>
          <v-icon v-else>mdi-lightbulb-off-outline</v-icon>
        </v-btn>
      </card-title>
    </v-card>

    <div v-intersect="onIntersect" style="position: relative" class="rotate">
      <div class="text-center py-5" v-if="!isLoaded">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <canvas
        ref="mjpegstreamerAdaptive"
        width="600"
        height="400"
        :class="
          'webcamImage ' +
          (isLoaded ? '' : 'hiddenWebcam') +
          (isZoomed ? 'zoomedWebcam' : '')
        "
      ></canvas>
    </div>
  </div>
</template>

<script>
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import { Vue, Component, Prop } from "nuxt-property-decorator";
let WebcamCard = class extends Vue {
  constructor() {
    super(...arguments);
    this.isVisible = false;
    this.refresh = Math.ceil(Math.random() * Math.pow(10, 12));
    this.isLoaded = true;
    this.timer = void 0;
    this.request_start_time = performance.now();
    this.start_time = performance.now();
    this.time = 0;
    this.request_time = 0;
    this.time_smoothing = 0.6;
    this.request_time_smoothing = 0.1;
    this.currentFPS = 0;
    this.showFps = true;
    this.isLightTurnOn = false;
    this.isZoomed = false;
    this.device = null;
    this.deviceId = null;
  }
  zoomInImage() {
    this.isZoomed = !this.isZoomed;
  }
  onIntersect(entries, observer) {
    const isVisible = entries[0].isIntersecting;
    this.isVisible = isVisible;
    if (isVisible) {
      this.refreshFrame();
    } else {
      clearTimeout(this.timer);
      this.timer = void 0;
    }
  }
  onCameras(cameras) {
    this.device = cameras.length > 0 ? cameras[0] : null;
    this.deviceId = this.device.deviceId;
  }
  refreshFrame() {
    if (this.isVisible) {
      this.refresh = new Date().getTime();
      this.setFrame();
    }
  }
  async setFrame() {
    const url = new URL(this.url);
    url.searchParams.append("bypassCache", this.refresh.toString());
    url.searchParams.set("action", "snapshot");
    this.request_start_time = performance.now();
    this.currentFPS = Math.round(1e3 / this.time);
    let canvas = this.$refs.mjpegstreamerAdaptive;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const frame = await this.loadImage(url.toString());
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientWidth * (frame.height / frame.width);
      ctx?.drawImage(
        frame,
        0,
        0,
        frame.width,
        frame.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      this.isLoaded = true;
    }
    this.$nextTick(() => {
      this.onLoad();
    });
  }
  loadImage(url) {
    return new Promise((r) => {
      let image = new Image();
      image.onload = () => r(image);
      image.onerror = () => setTimeout(this.refreshFrame, 1e3);
      image.src = url;
    });
  }
  onLoad() {
    this.isLoaded = true;
    const end_time = performance.now();
    const current_time = end_time - this.start_time;
    this.time = this.time * this.time_smoothing + current_time * (1 - this.time_smoothing);
    this.start_time = end_time;
    const target_time = 100;
    const current_request_time = performance.now() - this.request_start_time;
    this.request_time = this.request_time * this.request_time_smoothing + current_request_time * (1 - this.request_time_smoothing);
    const timeout = Math.max(0, target_time - this.request_time);
    this.$nextTick(() => {
      this.timer = setTimeout(this.refreshFrame, timeout);
    });
  }
  get lightIsOff() {
    return this.lighting.lightColor === "rgb(0, 0, 0)";
  }
  lightControl() {
    const gcode = "TOGGLE_LIGHT";
    this.$emit("lightControl", { script: gcode }, { message: gcode, type: "command" });
  }
};
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        enableLightControl: false,
        lightColor: ""
      };
    }
  })
], WebcamCard.prototype, "lighting", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], WebcamCard.prototype, "url", 2);
WebcamCard = __decorateClass([
  Component({
    name: "WebcamCard"
  })
], WebcamCard);
export {
  WebcamCard as default
};
</script>

<style scoped>
.rotate {
  transform: translateY(40%) rotate(-90deg);
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
