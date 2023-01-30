import DashboardPrinterAction from '../runtime/components/dashboard/DashboardPrinterAction.vue';

import {Meta} from '@storybook/vue';

export default {
    title: 'Dashboard/DashboardPrinterAction',
    component: DashboardPrinterAction,
    argTypes: {
        type: {
            control: 'select',
            options: [  "selector"
    ,"reset"
    , "progress"
    , "loading"
    , ""]
        }
    },
    args: {
        items: [
            {name:'Maintenance', key: 'maintenance'},
            {name:'Idle', key: 'idle'}
        ],
        value: 'maintenance',
        state: 'paused'
    }
} as Meta<typeof DashboardPrinterAction>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { DashboardPrinterAction },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<DashboardPrinterAction v-bind="$props"/>',
});

export const Example = Template.bind({});