import ToolbarPrinterControls from '../runtime/components/dashboard/ToolbarPrinterControls.vue';

import {Meta} from '@storybook/vue';

export default {
    title: 'Dashboard/ToolbarPrinterControls',
    component: ToolbarPrinterControls,
    argTypes: {
        state: {
            control: 'select',
            options: ["printing", "paused", "cancelled"]
        }
    },
} as Meta<typeof ToolbarPrinterControls>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { ToolbarPrinterControls },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<ToolbarPrinterControls v-bind="$props"/>',
});

export const Example = Template.bind({});