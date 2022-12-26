<template>
  <v-img
    v-if="
      this.printerInfo.printerState === 'printing' ||
      this.printerInfo.printerState === 'paused'
    "
    class="elevation-1"
    :src="bigImg"
    alt="Avatar"
    aspect-ratio="1"
    :max-width="$vuetify.breakpoint.smAndDown ? 120 : 160"
  >
    <div v-if="error" class="fill-height repeating-gradient-error" />
    <div v-else-if="white" class="fill-height repeating-gradient-white" />
    <div v-else-if="warning" class="fill-height repeating-gradient-warning" />
    <div v-else-if="success" class="fill-height repeating-gradient-success" />

    <div v-else />
  </v-img>
  <v-img
    v-else
    class="elevation-1"
    :src="'/printers/' + printerInfo.model + '.jpg'"
    alt="Avatar"
    aspect-ratio="1"
    :max-width="$vuetify.breakpoint.smAndDown ? 120 : 160"
  >
    <div v-if="error" class="fill-height repeating-gradient-error" />
    <div v-else-if="white" class="fill-height repeating-gradient-white" />
    <div v-else-if="warning" class="fill-height repeating-gradient-warning" />
    <div v-else-if="success" class="fill-height repeating-gradient-success" />
    <div v-else />
  </v-img>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { IParams, IPrinterInfo } from '../../../types/common'

@Component({
  name: 'DashboardPrinterAvatar'
})
export default class DashboardPrinterAvatar extends Vue {
  @Prop({ type: String, default: '' }) klipperState!: string
  @Prop({ type: String, default: '' }) queueStatus!: string
  @Prop({
    type: Object, default: () => {
      return {
        metadata: { thumbnails: [] }
      }
    }
  }) currentPrintjob!: { metadata: { thumbnails: [] } }
  @Prop({ type: Object, default: () => { return { timezoneOffset: 0, apiUrl: '', isPanel: true } } }) params!: IParams
  @Prop({
    type: Object, default: () => {
      return {
        printerState: '',
        model: ''
      }
    }
  }) printerInfo!: IPrinterInfo

  get warning (): boolean {
    return (this.queueStatus === 'maintenance' && this.printerInfo.printerState === 'standby') || this.printerInfo.printerState === 'paused'
  }

  get white (): boolean {
    return this.printerInfo.printerState === 'printing'
  }

  get success (): boolean {
    return this.printerInfo.printerState === 'complete' && this.queueStatus !== 'idle'
  }

  get error (): boolean {
    return this.printerInfo.printerState === 'cancelled' || this.printerInfo.printerState === 'error' || this.klipperState === 'shutdown'
  }

  get bigImg () {
    let widthImg = 0;
    let current = `${this.params.isPanel ? '' : '/'}printers/${this.printerInfo.model}.jpg`
    if (this.currentPrintjob.metadata?.thumbnails !== undefined) {
      this.currentPrintjob.metadata?.thumbnails.forEach((item: any) => {
        if (item.width > widthImg) {
          widthImg = item.width
          current = 'http://' + this.params.apiUrl + '/server/files/gcodes/' + item.relative_path
        }
      })
    }
    return current
  }
}

</script>

<style scoped>
.repeating-gradient-white {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 255, 255, 0.5) 5px,
    rgba(255, 255, 255, 0.5) 10px
  );
}
.repeating-gradient-error {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 82, 82, 0.5) 5px,
    rgba(255, 82, 82, 0.5) 10px
  );
}
.repeating-gradient-warning {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(255, 193, 7, 0.5) 5px,
    rgba(255, 193, 7, 0.5) 10px
  );
}
.repeating-gradient-success {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0) 5px,
    rgba(76, 175, 80, 0.5) 5px,
    rgba(76, 175, 80, 0.5) 10px
  );
}
</style>