<template>
  <v-card outlined elevation="0" style="border: none">
    <card-title
      icon="mdi-chart-areaspline"
      :title="$t('Statistics.FilterStatistics')"
    >
      <v-spacer />

      <template v-if="!isPanel">
        <v-btn
          v-if="$vuetify.breakpoint.smAndUp"
          @click="downloadStatisticty"
          outlined
          color="primary"
          ><v-icon left>mdi-download</v-icon
          >{{ $t("Statistics.DownloadBtnText") }}
        </v-btn>
        <v-btn v-else icon color="primary" @click="downloadStatisticty"
          ><v-icon>mdi-download</v-icon></v-btn
        >
      </template>

      <v-btn
        :title="$t('Statistics.History.TitleRefreshHistory')"
        color="primary"
        @click="refreshHistory"
        icon
        ><v-icon>mdi-refresh</v-icon></v-btn
      >
    </card-title>
    <v-container>
      <v-row align="center">
        <!-- Statistic table  -->
        <v-col cols="12">
          <v-simple-table>
            <tbody>
              <tr>
                <td>{{ $t("Statistics.wihtoutIdle") }}</td>
                <td class="text-right">{{ withoutIdle }} %</td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.SuccessfulDetailss") }}</td>
                <td class="text-right">{{ successfulDetails }} %</td>
              </tr>
            </tbody>
          </v-simple-table></v-col
        >

        <!-- Diagrams -->
        <v-col cols="12" md="6" sm="6">
          <stats-all-print-status
            ref="allPrintStatus"
            :print-status-array="printStatusArray"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <stats-all-print-status-time
            ref="allPrintStatusTime"
            :print-status-time="printStatusTime"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <stats-all-print-status-material
            ref="printStatusMaterial"
            :material-status-array="materialStatusArray"
          />
        </v-col>
      </v-row>

      <!-- Hidden container for images and canvas elements. It`s needs for "Download statistic" -->
      <v-row class="hidden">
        <img ref="imgForAllPrintStatus" class="square-img" />
        <img ref="imgForAllPrintStatusTime" class="square-img" />
        <img ref="imgForPrintStatusMaterial" class="square-img" />
        <br />canvas:<br />
        <canvas
          ref="allDiadramsAsImage"
          style="border: 1px solid #000"
          :class="`background-color: ${
            $vuetify.theme.dark
              ? $vuetify.theme.currentTheme.accent
              : $vuetify.theme.currentTheme.secondary
          }`"
        ></canvas>
        <a style="display: none" ref="linkForDownload">download</a>
      </v-row>
    </v-container>
  </v-card>
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
import StatsAllPrintStatus from "../stats/AllPrintStatus.vue";
import StatsAllPrintStatusTime from "../stats/AllPrintStatusTime.vue";
import StatsAllPrintStatusMaterial from "../stats/AllPrintStatusMaterial.vue";
let StatsFilter = class extends Vue {
  formatTime(totalSeconds) {
    return this.$helpers.formatPrintTime(totalSeconds);
  }
  get withoutIdle() {
    let allTime = 0;
    let idleTime = 0;
    this.printStatusTime.forEach((item) => {
      allTime += item.value > 0 ? item.value : 0;
      idleTime += item.name === "idle" && item.value > 0 ? item.value : 0;
    });
    let itog = allTime ? (allTime - idleTime) / allTime * 100 : 0;
    return Math.floor(itog);
  }
  get successfulDetails() {
    let allTime = 0;
    let completedTime = 0;
    this.printStatusTime.forEach((item) => {
      allTime += item.value > 0 ? item.value : 0;
      completedTime += item.name === "completed" && item.value > 0 ? item.value : 0;
    });
    let itog = allTime ? completedTime / allTime * 100 : 0;
    return Math.floor(itog);
  }
  refreshHistory() {
    this.$emit("refreshHistory", { start: 0, limit: 50 }, { action: "server/printjobs/getPrintjobs" });
  }
  get imgGeometry() {
    return this.$refs.allPrintStatus?.getGeometry();
  }
  get canvasCTX() {
    return this.$refs.allDiadramsAsImage.getContext("2d");
  }
  downloadStatisticty() {
    let padding = 10;
    let paddingTop = 30;
    this.drawImages(
      this.$refs.imgForAllPrintStatus,
      this.$refs.allPrintStatus?.getImage(),
      padding,
      paddingTop
    );
    this.drawImages(
      this.$refs.imgForAllPrintStatusTime,
      this.$refs.allPrintStatusTime?.getImage(),
      this.imgGeometry.width,
      paddingTop
    );
    this.drawImages(
      this.$refs.imgForPrintStatusMaterial,
      this.$refs.printStatusMaterial?.getImage(),
      padding,
      this.imgGeometry.height + paddingTop
    );
    if (this.canvasCTX) {
      let width = this.imgGeometry.width * 2 + 10;
      let height = this.imgGeometry.height * 2 + 20;
      this.$refs.allDiadramsAsImage.width = width;
      this.$refs.allDiadramsAsImage.height = height;
      this.canvasCTX.fillStyle = this.$vuetify.theme.dark ? "black" : "white";
      this.canvasCTX.fillRect(0, 0, width, height);
      this.canvasCTX.font = "18px Roboto";
      this.canvasCTX.fillStyle = this.$vuetify.theme.dark ? "white" : "black";
      this.canvasCTX?.fillText(
        this.$t("Statistics.PrinterName") + ": " + this.printerName,
        10,
        20
      );
    }
    setTimeout(() => {
      this.$refs.linkForDownload.setAttribute(
        "href",
        this.$refs.allDiadramsAsImage.toDataURL()
      );
      const d = new Date();
      const fileName = this.printerName + "-" + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" + d.toTimeString().split(" ")[0];
      this.$refs.linkForDownload.setAttribute("download", fileName);
      this.$refs.linkForDownload.click();
    }, 20);
  }
  drawImages(img, src, x = 0, y = 0) {
    img.src = src;
    img.width = this.imgGeometry.width;
    img.height = this.imgGeometry.height;
    img.onload = () => {
      this.canvasCTX?.drawImage(img, x, y, img.width, img.height);
    };
  }
};
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsFilter.prototype, "printStatusTime", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsFilter.prototype, "printStatusArray", 2);
__decorateClass([
  Prop({ type: Array, default: () => [] })
], StatsFilter.prototype, "materialStatusArray", 2);
__decorateClass([
  Prop({ type: String, default: "" })
], StatsFilter.prototype, "printerName", 2);
__decorateClass([
  Prop({ type: Boolean, default: false })
], StatsFilter.prototype, "isPanel", 2);
StatsFilter = __decorateClass([
  Component(
    {
      name: "StatsFilter",
      components: {
        StatsAllPrintStatus,
        StatsAllPrintStatusTime,
        StatsAllPrintStatusMaterial
      }
    }
  )
], StatsFilter);
export {
  StatsFilter as default
};
</script>

<style>
.hidden {
  display: none;
}
</style>