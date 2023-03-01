<template>
  <div :class="keyboardClass" />
</template>

<script>
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
export default {
  name: 'SimpleKeyboard',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    keyboardClass: {
      default: 'simple-keyboard',
      type: String
    },
    value: {
      default: '',
      type: String
    },
    theme: {
      type: String
    },
    type: {
      default: 'default',
      type: String
    },
    multilang: {
      default: false,
      type: Boolean
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    if (this.multilang)
      this.type = 'en'

    let obj = {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      layout: {
        'default': [
          '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          'q w e r t y u i o p [ ] \\',
          'a s d f g h j k l ; \' {enter}',
          '{shift} z x c v b n m , . /',
          '{space}'
        ],
        'shift': [
          '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
          'Q W E R T Y U I O P { } |',
          'A S D F G H J K L : " {enter}',
          '{shift} Z X C V B N M < > ?',
          '{space}'
        ],
        'en': [
          '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          'q w e r t y u i o p [ ] \\',
          'a s d f g h j k l ; \' {enter}',
          'RU {shift} z x c v b n m , . /',
          '{space}'
        ],
        'enShift': [
          '~ ! @ # $ % ^ & * ( ) _ + {bksp}',
          'Q W E R T Y U I O P { } |',
          'A S D F G H J K L : " {enter}',
          'RU {shift} Z X C V B N M < > ?',
          '{space}'
        ],
        'ru': [
          '` 1 2 3 4 5 6 7 8 9 0 - = {bksp}',
          'й ц у к е н г ш щ з х ъ \\',
          'ф ы в а п р о л д ж э {enter}',
          'EN {shift} я ч с м и т ь б ю . /',
          '{space}'
        ],
        'ruShift': [
          '` ! " № ; % : ? * ( ) _ + {bksp}',
          'Й Ц У К Е Н Г Ш Щ З Х Ъ \\',
          'Ф Ы В А П Р О Л Д Ж Э {enter}',
          'EN {shift} Я Ч С М И Т Ь Б Ю . /',
          '{space}'
        ],

        'numbers': [
          '7 8 9',
          '4 5 6',
          '1 2 3',
          '- . 0 {bksp} {enter}',
        ]
      },
      display: {
        "{bksp}": "backspace ⌫",
        "{enter}": "enter ↵",
        "{shift}": "shift ⇧",
        "{space}": '&nbsp;',
        "RU": "RU🌍",
        "EN": "EN🌍",
      },
      theme: this.theme,
      layoutName: this.type
    }
    this.keyboard = new Keyboard(obj)
  },
  methods: {
    onChange(input) {
      //this.$emit('change', input)
    },
    onKeyPress(button) {
      /**
       * If you want to handle special buttons
       */

      let newLayout = ''

      switch (button) {
        case '{shift}':
          this.handleShift()
          break
        case '{lock}':
          this.handleShift()
          break
        case '{enter}':
          this.$emit('enterPressed')
          break
        case 'RU':
          newLayout = this.keyboard.options.layoutName === 'enShift' ? 'ruShift' : 'ru'
          this.keyboard.setOptions({
            layoutName: newLayout
          })
          break
        case 'EN':
          newLayout = this.keyboard.options.layoutName === 'ruShift' ? 'enShift' : 'en'
          this.keyboard.setOptions({
            layoutName: newLayout
          })
          break
        default:
          this.$emit('onKeyPress', button)
          break
      }
    },
    handleShift() {
      const currentLayout = this.keyboard.options.layoutName
      let shiftToggle = ''

      switch (currentLayout) {
        case 'default':
          shiftToggle = 'shift'
          break
        case 'shift':
          shiftToggle = 'default'
          break
        case 'ru':
          shiftToggle = 'ruShift'
          break
        case 'ruShift':
          shiftToggle = 'ru'
          break
        case 'en':
          shiftToggle = 'enShift'
          break
        case 'enShift':
          shiftToggle = 'en'
          break
      }
      this.keyboard.setOptions({
        layoutName: shiftToggle
      })
    }
  },
  input(input) {
    this.keyboard.setInput(input)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*
  Theme: DarkTheme
*/
.simple-keyboard.DarkTheme {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.simple-keyboard.DarkTheme .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
}
.simple-keyboard.DarkTheme .hg-button:active {
  background: #0277bd;
  color: white;
}
#root .simple-keyboard.DarkTheme + .simple-keyboard-preview {
  background: #0277bd;
}
/*
  Theme: LightTheme
*/
.simple-keyboard.LightTheme {
  background-color: rgba(240, 240, 240, 1);
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}
.simple-keyboard.LightTheme .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 1);
  color: black;
}
.simple-keyboard.LightTheme .hg-button:active {
  background: #0277bd;
  color: black;
}
#root .simple-keyboard.LightTheme + .simple-keyboard-preview {
  background: #0277bd;
}
</style>