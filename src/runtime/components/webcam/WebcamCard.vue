<template>
  <div>
    <v-card>
      <v-card-title icon="mdi-webcam" :title="'new ' + title">
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
      </v-card-title>
    </v-card>

    <div style="position: relative" class="rotate">
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

<script lang="ts">
import { Vue, Component, mixins, Prop, Watch } from "nuxt-property-decorator";
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

  isLoaded = true;
  isZoomed = false;

  zoomInImage () {
    this.isZoomed = !this.isZoomed;
  }

  $refs!: {
    mjpegstreamerAdaptive: any;
  };

  @Watch('url')
  async setFrame () {
    if (!this.isLoaded) return
    const url = new URL(this.url);

    let canvas = this.$refs.mjpegstreamerAdaptive;
    if (canvas) {
      this.isLoaded = false;
      const ctx = canvas.getContext("2d");
      const frame: any = await this.loadImage(url.toString());

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientWidth * (frame.height / frame.width);

      ctx.drawImage(
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
  }

  loadImage (url: string) {
    return new Promise((r) => {
      let image = new Image();
      image.onload = () => r(image);
      image.src = url;
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
