<template>
  <v-card>
    <card-title
      icon="mdi-chart-areaspline"
      :title="$t('Statistics.TotalStatistics')"
    >
      <v-spacer />
    </card-title>
    <v-container>
      <v-row align="center">
        <!-- Statistic table  -->
        <v-col cols="12">
          <v-simple-table>
            <tbody>
              <tr>
                <td>{{ $t("Statistics.PrinterName") }}</td>
                <td class="text-right">
                  {{ this.printerName }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.TotalPrinttime") }}</td>
                <td class="text-right">
                  {{ formatTime(totalPrintTime) }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.LongestPrinttime") }}</td>
                <td class="text-right">
                  {{ formatTime(longestPrintTime) }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.AvgPrinttime") }}</td>
                <td class="text-right">
                  {{ formatTime(avgPrintTime) }}
                </td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.TotalFilamentUsed") }}</td>
                <td class="text-right">
                  {{ Math.round(totalFilamentUsed / 100) / 10 }} m
                </td>
              </tr>
              <tr>
                <td>{{ $t("Statistics.TotalJobs") }}</td>
                <td class="text-right">{{ totalJobsCount }}</td>
              </tr>
            </tbody>
          </v-simple-table></v-col
        >

        <!-- Diagrams -->
        <v-col cols="12" md="6" sm="6">
          <stats-filament-usage
            ref="filamentUsage"
            :filament-usage-array="filamentUsageArray"
          />
        </v-col>
        <v-col cols="12" md="6" sm="6">
          <stats-print-time-avg
            ref="printTimeAvg"
            :printtime-avg-array="printtimeAvgArray"
          />
        </v-col>
      </v-row>

      <!-- Hidden container for images and canvas elements. It`s needs for "Download statistic" -->
      <v-row class="hidden">
        <img ref="imgForFilamentUsage" class="square-img" />
        <img ref="imgForAPrintTimeAvg" class="square-img" />
        <br />canvas:<br />
        <canvas
          ref="allDiadramsAsImage"
          style="border: 1px solid #000"
          :class="`background-color: ${
            this.$vuetify.theme.dark
              ? this.$vuetify.theme.currentTheme.accent
              : this.$vuetify.theme.currentTheme.secondary
          }`"
        ></canvas>
        <a style="display: none" ref="linkForDownload">download</a>
      </v-row>
    </v-container>
  </v-card>
</template>


<script lang="ts">
import { Vue, Component, mixins, Prop } from "nuxt-property-decorator";
import StatsFilamentUsage from '../stats/FilamentUsage.vue'
import StatsPrintTimeAvg from '../stats/PrintTimeAvg.vue'
import  CardTitle from '~common/components/CardTitle.vue'

@Component({
  name: 'StatsMain',
  components: {
    StatsFilamentUsage,
    StatsPrintTimeAvg,
    CardTitle
  }
})
export default class StatsMain extends Vue {
  @Prop({ type: Array, default: () => { } }) printtimeAvgArray!: []
  @Prop({ type: Array, default: () => [] }) filamentUsageArray!: []
  @Prop({ type: Number, default: 0 }) totalPrintTime!: number
  @Prop({ type: Number, default: 0 }) longestPrintTime!: number
  @Prop({ type: Number, default: 0 }) totalFilamentUsed!: number
  @Prop({ type: Number, default: 0 }) totalJobsCount!: number
  @Prop({ type: String, default: '' }) printerName!: string
  $refs!: {
    filamentUsage: any;
    printTimeAvg: any;
    allDiadramsAsImage: HTMLCanvasElement;
    imgForFilamentUsage: HTMLImageElement;
    imgForAPrintTimeAvg: HTMLImageElement;
    linkForDownload: HTMLLinkElement;
  };

  get avgPrintTime () {
    if (this.totalJobsCount > 0 && this.totalPrintTime > 0)
      return Math.round(this.totalPrintTime / this.totalJobsCount);

    return 0;
  }

  formatTime (totalSeconds: number) {
    return this.$helpers.formatPrintTime(totalSeconds)
  }

  refreshHistory () {
    this.$emit('refreshHistory', { start: 0, limit: 50 }, { action: "server/printjobs/getPrintjobs" });
  }

  get canvasCTX () {
    return this.$refs.allDiadramsAsImage.getContext("2d");
  }
}

</script>

<style>
.square_img {
  height: 200px;
  width: 200px;
}
.hidden {
  display: none;
}
</style>