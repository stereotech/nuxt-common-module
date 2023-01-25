<template>
  <v-radio-group v-model="value" column class="statusSelect">
    <template v-for="status in items">
      <v-radio
        :key="status.value"
        :value="status.value"
        active-class="font-weight-bold"
        :color="value === status.value ? status.color : ''"
      >
        <template v-slot:label>
          <v-icon
            v-if="status.icon"
            :color="value === status.value ? status.color : ''"
            >{{ status.icon }}</v-icon
          >
          <font :color="value === status.value ? status.color : ''">
            {{ status.text }}
          </font>
        </template>
      </v-radio>
    </template>
  </v-radio-group>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from "nuxt-property-decorator";

@Component({
  name: "LastJobStatus",
})
export default class LastJobStatus extends Vue {
  @Model("change", { default: "", type: String }) value!: string;
  @Prop({ type: Array, default: () => [] }) items!: {
    text: string;
    color?: string;
    icon?: string;
    value: string;
  }[];
}
</script>

<style>
.statusSelect .v-input--selection-controls__input {
  display: none;
}
</style>
