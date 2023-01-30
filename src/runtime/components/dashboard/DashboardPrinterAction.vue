<template>
  <v-select
    v-if="type === 'selector'"
    hide-details="always"
    v-bind="$attrs"
    v-on="$listeners"
    outlined
    item-text="name"
    item-value="key"
  ></v-select>
  <div v-else-if="type === 'progress'">
    <v-col cols="12">
      <v-progress-linear striped v-bind="$attrs"></v-progress-linear>
    </v-col>
    <v-col cols="12">
      <toolbar-printer-controls v-bind="$attrs" v-on="$listeners" />
    </v-col>
  </div>
  <v-btn
    v-else-if="type === 'reset'"
    block
    v-bind="$attrs"
    v-on="$listeners"
    depressed
    color="error"
    ><v-icon>mdi-restart</v-icon
    ><slot name="reset">Firmware Restart</slot></v-btn
  >

  <v-progress-circular
    v-else-if="type === 'loading'"
    indeterminate
    color="primary"
  ></v-progress-circular>
  <div v-else><slot></slot></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import ToolbarPrinterControls from "./ToolbarPrinterControls.vue";

@Component({
  name: "DashboardPrinterAction",
  components: {
    ToolbarPrinterControls,
  },
})
export default class DashboardPrinterAction extends Vue {
  @Prop({ type: String, default: "selector" }) type!:
    | "selector"
    | "reset"
    | "progress"
    | "loading"
    | "";
}
</script>

<style></style>
