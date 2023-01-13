<template>
  <v-toolbar flat dense v-bind="$attrs">
    <v-toolbar-title>
      <span class="subheading align-baseline"
        ><v-icon left>{{ icon }}</v-icon
        >{{ title }}</span
      >
    </v-toolbar-title>

    <slot />

    <template v-if="closeable">
      <v-spacer />
      <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  name: 'CardTitle'
})
export default class CardTitle extends Vue {
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: String, default: "mdi-circle-small" }) icon!: string;
  @Prop({ type: Boolean, default: false }) closeable!: boolean;
}
</script>

<style></style>