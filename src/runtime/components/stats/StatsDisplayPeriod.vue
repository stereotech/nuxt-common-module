<template>
  <div>
    <v-card>
      <card-title
        icon="mdi-filter-outline"
        :title="$t('Statistics.DisplayPeriod.FilterHeader')"
      ></card-title>
      <v-card-text>
        <!-- Select diapazon -->
        <v-container>
          <v-row>
            <v-col cols="12" md="6" :id="'stats-display-period'">
              <v-select
                outlined
                :items="items"
                :label="$t('Statistics.DisplayPeriod.SelectPeriod')"
                v-model="period"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-if="showPicker"
                v-model="showDialogSelectPeriod"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    outlined
                    :value="dateRangeText"
                    :label="$t('Statistics.DisplayPeriod.SelectDiapazon')"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="datesSync"
                  range
                  max="nowDate()"
                  no-title
                  scrollable
                  first-day-of-week="1"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="showDialogSelectPeriod = false"
                    >{{ $t("Statistics.DisplayPeriod.Ok") }}</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12">
              <stats-filter
                :print-status-time="printStatusTime"
                :print-status-array="printStatusArray"
                :material-status-array="materialStatusArray"
                :printer-name="printerName"
                :is-panel="isPanel"
                @refreshHistory="refreshHistory"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch, Model } from "nuxt-property-decorator";
import StatsFilter from '../stats/StatsFilter.vue'
import  CardTitle from '~common/components/CardTitle.vue'

@Component({
  name: 'StatsDisplayPeriod',
  components: {
    StatsFilter,
    CardTitle
  }
})
export default class StatsDisplayPeriod extends Vue {
  @Prop({ type: Array, default: () => [] }) printStatusTime!: []
  @Prop({ type: Array, default: () => [] }) printStatusArray!: []
  @Prop({ type: Array, default: () => [] }) materialStatusArray!: []
  @Prop({ type: String, default: '' }) printerName!: string
  @Prop({ type: Boolean, default: false }) isPanel!: boolean
  @Model('change', { type: String, default: '' }) displayPeriod!: string;
  @PropSync('dates', { type: Array, default: () => [] }) datesSync!: []

  period = this.displayPeriod
  @Watch('period') periodChange (newVal: any) {
    this.$emit('change', newVal)
  }

  private showDialogSelectPeriod = false;

  get showPicker (): boolean {
    return this.period === "period";
  }

  // initial data for select
  get items (): { text: string; value: string }[] {
    return [
      {
        text: this.$t("Statistics.DisplayPeriod.Day").toString(),
        value: "day"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Month").toString(),
        value: "month"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Year").toString(),
        value: "year"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.Period").toString(),
        value: "period"
      },
      {
        text: this.$t("Statistics.DisplayPeriod.All").toString(),
        value: "all"
      }
    ];
  }


  nowDate () {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  get dateRangeText (): string {
    return this.datesSync.join(" ~ ");
  }

  refreshHistory (options: any, settings: any) {
    this.$emit('refreshHistory', options, settings);
  }

}
</script>

<style></style>
