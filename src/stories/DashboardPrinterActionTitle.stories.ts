import DashboardPrinterActionTitle from '../runtime/components/dashboard/DashboardPrinterActionTitle.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Dashboard/DashboardPrinterActionTitle',
    component: DashboardPrinterActionTitle,
    args: {
        title: 'Maintenance',
        description: 'Printer is on maintenance',
        color: 'warning'
    },
} as Meta<typeof DashboardPrinterActionTitle>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { DashboardPrinterActionTitle },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<DashboardPrinterActionTitle v-bind="$props"/>',
});

export const Example = Template.bind({});