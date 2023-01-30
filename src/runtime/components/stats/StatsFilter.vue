<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" :id="'stats-display-period'">
        <v-select
          outlined
          v-bind="$attrs"
          v-on="$listeners"
          @change="$emit('change', $event)"
          :value="value"
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
              :label="pickerLabel"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="datesSync"
            range
            :max="nowDate()"
            no-title
            scrollable
            first-day-of-week="1"
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="showDialogSelectPeriod = false"
              >{{ pickerOk }}</v-btn
            >
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop, PropSync } from "nuxt-property-decorator";

@Component({
  name: "StatsFilter",
})
export default class StatsFilter extends Vue {
  @Model("change", { type: String, default: "all" }) value!: string;
  @PropSync("dates", { type: Array, default: () => [] }) datesSync!: [];
  @Prop({ type: String, default: "" }) pickerLabel!: string;
  @Prop({ type: String, default: "Ok" }) pickerOk!: string;

  get showPicker(): boolean {
    return this.value === "period";
  }

  get dateRangeText(): string {
    return this.datesSync.join(" ~ ");
  }

  nowDate() {
    let now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }

  showDialogSelectPeriod = false;
}
</script>

<style></style>
