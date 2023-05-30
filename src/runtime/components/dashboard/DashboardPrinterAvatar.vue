<template>
  <div>
   <v-img
      class="elevation-1"
      alt="Avatar"
      aspect-ratio="1"
      v-bind="$attrs"
      v-on="$listeners"
      @click="isDialogBigImageShow = true"
    >
      <div :class="style" />
    </v-img>
    <v-dialog width="400" v-model="isDialogBigImageShow" :transition="false" click:outside="isDialogBigImageShow = false">
      <v-card class="text-center">
        <v-img
          class="elevation-1"
          alt="Image"
          aspect-ratio="1"
          v-bind="$attrs"
          v-on="$listeners"
        />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="isDialogBigImageShow = false">close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator";

@Component({
  name: "DashboardPrinterAvatar",
})
export default class DashboardPrinterAvatar extends Vue {
  @Prop({type: Boolean, default: false}) clicable!: boolean
  @Prop({ type: String, default: "" }) state!:
    | "warning"
    | "white"
    | "success"
    | "error"
    | "grey"
    | "";

  isDialogBigImageShow = false
  
  get style() {
    switch (this.state) {
      case "warning":
        return "fill-height repeating-gradient-warning";
      case "error":
        return "fill-height repeating-gradient-error";
      case "success":
        return "fill-height repeating-gradient-success";
      case "white":
        return "fill-height repeating-gradient-white";
      default:
        return "";
        break;
    }
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
