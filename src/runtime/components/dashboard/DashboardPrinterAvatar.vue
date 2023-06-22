<template>
  <div>
   <v-img
      :class="clickable ? 'clickable elevation-1' : 'elevation-1'"
      alt="Avatar"
      aspect-ratio="1"
      v-bind="$attrs"
      v-on="$listeners"
      @click="click"
    >
      <div :class="style" />
    </v-img>
    <v-dialog 
      :width="bigImageWidth+50" 
      v-model="isDialogBigImageShow" 
      :transition="false" 
      click:outside="isDialogBigImageShow = false"
      >
      <v-card>
        <v-card-text class="text-center pt-8">
          <v-img
            class="elevation-1 text-center"
            alt="Image"
            aspect-ratio="1"
            v-bind="$attrs"
            v-on="$listeners"
            :width="bigImageWidth"
            :max-width="bigImageWidth"
          />
        </v-card-text>
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
  @Prop({type: Boolean, default: false}) clickable!: boolean
  @Prop({type: Number, default: 300}) bigImageWidth!: number
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
  
  click(){
    if(this.clickable){
      this.isDialogBigImageShow = true
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
.clickable{
  cursor: pointer;
}
</style>
