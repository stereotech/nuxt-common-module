<template>
  <v-card>
    <card-title :title="title"></card-title>
    <v-container>
      <v-row align="center">
        <!-- Statistic table  -->
        <v-col cols="12">
          <v-simple-table>
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.text }}</td>
                <td class="text-right">
                  {{ item.value }}
                </td>
              </tr>
            </tbody>
          </v-simple-table></v-col
        >
      </v-row></v-container
    ></v-card
  >
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import CardTitle from "../CardTitle.vue";
@Component({
  name: "StatsTotalTable",
  components: {
    CardTitle,
  },
})
export default class StatsTotalTable extends Vue {
  @Prop({ type: String, default: "" }) title!: string;
  @Prop({ type: Array, default: () => [] }) items!: {
    text: string;
    value: string;
  }[];
}
</script>

<style></style>
