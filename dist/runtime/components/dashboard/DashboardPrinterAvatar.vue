<template>
  <v-img
    v-if="
      this.printerInfo.printerState === 'printing' ||
      this.printerInfo.printerState === 'paused'
    "
    class="elevation-1"
    :src="bigImg"
    alt="Avatar"
    aspect-ratio="1"
    :max-width="$vuetify.breakpoint.smAndDown ? 120 : 160"
  >
    <div v-if="error" class="fill-height repeating-gradient-error" />
    <div v-else-if="white" class="fill-height repeating-gradient-white" />
    <div v-else-if="warning" class="fill-height repeating-gradient-warning" />
    <div v-else-if="success" class="fill-height repeating-gradient-success" />

    <div v-else />
  </v-img>
  <v-img
    v-else
    class="elevation-1"
    :src="'/printers/' + printerInfo.model + '.jpg'"
    alt="Avatar"
    aspect-ratio="1"
    :max-width="$vuetify.breakpoint.smAndDown ? 120 : 160"
  >
    <div v-if="error" class="fill-height repeating-gradient-error" />
    <div v-else-if="white" class="fill-height repeating-gradient-white" />
    <div v-else-if="warning" class="fill-height repeating-gradient-warning" />
    <div v-else-if="success" class="fill-height repeating-gradient-success" />
    <div v-else />
  </v-img>
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
let DashboardPrinterAvatar = class extends Vue {
  get warning() {
    return this.queueStatus === "maintenance" && this.printerInfo.printerState === "standby" || this.printerInfo.printerState === "paused";
  }
  get white() {
    return this.printerInfo.printerState === "printing";
  }
  get success() {
    return this.printerInfo.printerState === "complete" && this.queueStatus !== "idle";
  }
  get error() {
    return this.printerInfo.printerState === "cancelled" || this.printerInfo.printerState === "error" || this.klipperState === "shutdown";
  }
  get bigImg() {
    let widthImg = 0;
    let current = `${this.params.isPanel ? "" : "/"}printers/${this.printerInfo.model}.jpg`;
    if (this.currentPrintjob.metadata?.thumbnails !== void 0) {
      this.currentPrintjob.metadata?.thumbnails.forEach((item) => {
        if (item.width > widthImg) {
          widthImg = item.width;
          current = "http://" + this.params.apiUrl + "/server/files/gcodes/" + item.relative_path;
        }
      });
    }
    return current;
  }
};
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinterAvatar.prototype, "klipperState", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], DashboardPrinterAvatar.prototype, "queueStatus", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        metadata: { thumbnails: [] }
      };
    }
  })
], DashboardPrinterAvatar.prototype, "currentPrintjob", 2);
__decorateClass([
  Prop({ type: Object, default: () => {
    return { timezoneOffset: 0, apiUrl: "", isPanel: true };
  } })
], DashboardPrinterAvatar.prototype, "params", 2);
__decorateClass([
  Prop({
    type: Object,
    default: () => {
      return {
        printerState: "",
        model: ""
      };
    }
  })
], DashboardPrinterAvatar.prototype, "printerInfo", 2);
DashboardPrinterAvatar = __decorateClass([
  Component({
    name: "DashboardPrinterAvatar"
  })
], DashboardPrinterAvatar);
export {
  DashboardPrinterAvatar as default
};
</script>

<style scoped>
.repeating-gradient-white {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 255, 255, 0.5) 5px,
    rgba(255, 255, 255, 0.5) 10px
  );
}
.repeating-gradient-error {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 82, 82, 0.5) 5px,
    rgba(255, 82, 82, 0.5) 10px
  );
}
.repeating-gradient-warning {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 193, 7, 0.5) 5px,
    rgba(255, 193, 7, 0.5) 10px
  );
}
.repeating-gradient-success {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(76, 175, 80, 0.5) 5px,
    rgba(76, 175, 80, 0.5) 10px
  );
}
</style>