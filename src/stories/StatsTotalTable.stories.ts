import StatsTotalTable from '../runtime/components/stats/StatsTotalTable.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Stats/StatsTotalTable',
    component: StatsTotalTable,
    args: {
        items: [
      {
        text: "PrinterName",
        value: "st-aaa",
      },
      {
        text: "TotalPrinttime",
        value: "100 days",
      },
      {
        text: "LongestPrinttime",
        value: "500 hours",
      }
    ],
    title: 'Total Stats',

      }

} as Meta<typeof StatsTotalTable>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { StatsTotalTable },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<StatsTotalTable v-bind="$props"/>',
});

export const Example = Template.bind({});