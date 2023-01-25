import StatsFilter from '../runtime/components/stats/StatsFilter.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Stats/StatsFilter',
    component: StatsFilter,
    args: {
        items: [
      {
        text: "Day",
        value: "day",
      },
      {
        text: "Month",
        value: "month",
      },
      {
        text: "Year",
        value: "year",
      },
      {
        text: "Period",
        value: "period",
      },
      {
        text: "All",
        value: "all",
      },
    ],
    value: 'period',
    pickerLabel: 'Select Range',
    datesSync: []
      }

} as Meta<typeof StatsFilter>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { StatsFilter },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<StatsFilter v-bind="$props"/>',
});

export const Example = Template.bind({});