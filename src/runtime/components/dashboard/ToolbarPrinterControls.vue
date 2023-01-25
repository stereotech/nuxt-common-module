<template>
  <v-container>
    <template v-if="loading">
      <v-row align="center" class="text-center">
        <v-col cols="12">
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row align="center" class="text-center">
        <v-col cols="12">
          <v-btn-toggle>
            <v-btn
              text
              depressed
              :disabled="state === 'printing'"
              @click="resumeJob"
            >
              <v-icon color="success">mdi-play</v-icon>
            </v-btn>
            <v-btn
              text
              depressed
              :disabled="state === 'paused' || state === 'cancelled'"
              @click="pauseJob"
            >
              <v-icon color="warning">mdi-pause</v-icon>
            </v-btn>
            <v-btn
              text
              depressed
              :disabled="state === 'cancelled'"
              @click="cancelJob"
            >
              <v-icon color="error">mdi-stop</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
      <v-dialog v-model="cancelDialog" max-width="400" :transition="false">
        <v-card>
          <card-title
            icon="mdi-stop"
            :title="cancelDialogProps.title"
            closeable
            @close="cancelDialog = false"
          />
          <v-card-actions>
            <v-btn text color="success" @click="cancelDialog = false">
              {{ cancelDialogProps.cancel }}
            </v-btn>
            <v-btn text color="error" @click="cancelJobAction">
              {{ cancelDialogProps.accept }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import { title } from "process";
import CardTitle from "../CardTitle.vue";

@Component({
  name: "ToolbarPrinterControls",
  components: {
    CardTitle,
  },
})
export default class ToolbarPrinterControls extends Vue {
  @Prop({ type: String, default: "printing" }) state!:
    | "printing"
    | "paused"
    | "cancelled";
  @Prop({ type: Boolean, default: false }) loading!: boolean;
  @Prop({
    type: Object,
    default: () => {
      return {
        title: "Cancel Job",
        cancel: "No",
        accept: "Yes",
      };
    },
  })
  cancelDialogProps!: { title: string; cancel: string; accept: string };

  toggleNone = null;
  cancelDialog = false;

  pauseJob() {
    this.$emit("pause");
  }

  resumeJob() {
    this.$emit("resume");
  }

  cancelJob() {
    this.cancelDialog = true;
  }

  cancelJobAction() {
    this.cancelDialog = false;
    this.$emit("cancel");
  }
}
</script>

<style></style>
