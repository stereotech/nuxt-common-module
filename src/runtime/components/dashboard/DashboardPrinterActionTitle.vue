<template>
  <div class="action-title">
    <slot>
      <v-col cols="12" :class="`${color}--text title`">
        {{ title }}
      </v-col>
    </slot>
    <slot name="description">
      <v-col cols="12" class="subtitle-2 text-truncate">
        {{ description }}
      </v-col>
    </slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  name: "DashboardPrinterActionTitle",
})
export default class DashboardPrinterActionTitle extends Vue {
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: String, default: "" }) color!: string;
  @Prop({ type: String, default: "" }) description!: string;
}
</script>

<style>
.action-title {
  display: contents;
}
</style>
