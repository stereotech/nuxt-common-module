import TextInputKeyboard from '../runtime/components/TextInputKeyboard.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'TextInputKeyboard',
    component: TextInputKeyboard
} as Meta<typeof TextInputKeyboard>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { TextInputKeyboard },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<TextInputKeyboard v-bind="$props"/>',
});

export const Example = Template.bind({});