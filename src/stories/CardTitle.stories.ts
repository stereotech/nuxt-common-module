import CardTitle from '../runtime/components/CardTitle.vue';

import {Meta} from '@storybook/vue';

export default {
    title: 'CardTitle',
    component: CardTitle,
    args: {
        title: 'Card Title',
        icon: 'mdi-printer-3d'
    }
} as Meta<typeof CardTitle>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { CardTitle },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<CardTitle v-bind="$props"/>',
});

export const Example = Template.bind({});