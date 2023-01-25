<template>
  <v-container>
    <template v-if="loadings.includes('statusPrintCancel')">
      <v-row align="center" class="text-center">
        <v-col cols="12">
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row align="center" class="text-center">
        <v-col cols="12">
          <v-btn-toggle v-model="toggleNone">
            <v-btn
              text
              depressed
              :disabled="printerState === 'printing'"
              @click="resumeJob"
            >
              <v-icon color="success">mdi-play</v-icon>
            </v-btn>
            <v-btn
              text
              depressed
              :disabled="
                printerState === 'paused' || printerState === 'cancelled'
              "
              @click="pauseJob"
            >
              <v-icon color="warning">mdi-pause</v-icon>
            </v-btn>
            <v-btn
              text
              depressed
              :disabled="printerState === 'cancelled'"
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
            :title="$t('Dashboard.Printer.CancelJob')"
            closeable
            @close="cancelDialog = false"
          />
          <v-card-actions>
            <v-btn text color="success" @click="cancelDialog = false">
              {{ $t("Dashboard.Printer.No") }}
            </v-btn>
            <v-btn text color="error" @click="cancelJobAction">
              {{ $t("Dashboard.Printer.Yes") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";
import CardTitle from '~common/components/CardTitle.vue'

@Component
(
  {
    name: 'ToolbarPrinterControls',
    components: {
      CardTitle
      }
    }
  )
export default class ToolbarPrinterControls extends Vue {
  @Prop({ type: String, default: '' }) printerState!: string
  @Prop({ type: Array, default: () => [''] }) loadings!: Array<String>

  toggleNone = null;
  cancelDialog = false

  pauseJob () {
    this.$emit('printerPrintPause', {}, { loading: 'statusPrintPause' })
  }

  resumeJob() {
    this.$emit('printerPrintResume', {}, { loading: 'statusPrintResume' })
  }

  cancelJob() {
    this.cancelDialog = true
  }

  cancelJobAction() {
    this.cancelDialog = false
    this.$emit('printerPrintCancel', {}, { loading: 'statusPrintCancel' })
  }

}
</script>

<style>
</style>