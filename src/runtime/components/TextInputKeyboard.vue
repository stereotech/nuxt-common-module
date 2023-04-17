<template>
  <div>
    <v-text-field
      v-bind="$attrs"
      @click="open = true"
      :value="input"
      @change="$emit('change', $event)"
      @click:append="$emit('click:append', $event)"
      @input="$emit('input', $event)"
    >
      <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
    </v-text-field>
    <v-dialog
      :transition="false"
      fullscreen
      v-if="enable && open"
      v-model="open"
      @click:outside="closeKeyboard"
    >
      <v-sheet height="100%">
        <v-container class="pa-0">
          <v-row no-gutters>
            <v-col cols="12">
              <v-btn
                large
                color="primary"
                depressed
                block
                tile
                @click="closeKeyboard"
                >{{ closeTitle }}</v-btn
              >
            </v-col>
            <v-col cols="12" class="my-2">
              <v-text-field
                ref="text"
                v-bind="$attrs"
                :value="input"
                class="text"
                @change="$emit('change', input == $event ? $event : '')"
                @click:append="$emit('click:append', $event)"
                @click="inputClick"
                :autofocus="true"
                @input="$emit('input', $event)"
              >
                <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <simple-keyboard
                @onKeyPress="onKeyPress"
                :theme="
                  $vuetify.theme.dark
                    ? 'hg-theme-default DarkTheme'
                    : 'hg-theme-default LightTheme'
                "
                :type="kbType"
                :multilang="multilang"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, mixins, Model, Watch, Prop } from 'nuxt-property-decorator'
import SimpleKeyboard from "./SimpleKeyboard.vue";

@Component({
  components: {
    SimpleKeyboard
  }
})
export default class TextInputKeyBoard extends Vue {
  @Prop({ default: "default", type: String }) kbType?: string;
  @Prop({ default: "Close", type: String }) closeTitle?: string;
  @Prop({ default: false, type: Boolean }) multilang?: boolean;
  @Prop({ default: false, type: Boolean }) enable?: boolean;

  $refs!: {
    text: any
  }

  @Model('input', { default: '', type: String }) input!: string

  currentCursorPosition = this.input.length;
  cursorStand = false
  closeKeyboard () {
    this.open = false
    this.$emit('closeKeyboard')
  }

  open = false

  inputClick (val: string) {
    this.currentCursorPosition = typeof this.input === 'string' ? Number((this.$refs.text.$refs.input as HTMLInputElement).selectionStart) : 0;
    this.cursorStand = true;
  }
  onKeyPress (button: string) {
    this.cursorStand = false;

    if (button === '{bksp}') {
      if (this.currentCursorPosition > 0 && typeof this.input === 'string') {
        this.currentCursorPosition--;
        let arr = this.input.split('');
        arr.splice(this.currentCursorPosition, 1);
        let newStr = arr.join('');
        this.$emit('input', newStr);
      } else if (this.input && typeof this.input === 'number') {
        this.$emit('input', this.input)
        return
      }
      return
    }

    if (button === '{enter}') {
      this.closeKeyboard()
      return
    }
    if (button === '{space}') {
      this.$emit('change', this.input + ' ')
    } else {
      if (button.startsWith('{') && button.endsWith('}'))
        return
      if (button === '.' && this.kbType === "numbers" && this.input.includes('.'))
        return
      if (button === '-' && this.kbType === "numbers" && this.input.includes('-'))
        return
    }

    let newStr = '';
    if (this.input && typeof this.input === 'string') {
      let arr = this.input.split('')
      arr.splice(this.currentCursorPosition, 0, (button === '{space}' ? ' ' : button))
      newStr = arr.join('')
    } else if (this.input && typeof this.input === 'number') {
      this.$emit('input', Number(String(this.input) + button))
      return
    }

    this.currentCursorPosition++;
    this.$emit('input', newStr ? newStr : button)
  }
}

</script>

<style>
</style>
