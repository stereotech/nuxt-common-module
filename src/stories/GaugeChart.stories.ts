import GaugeChart from '../runtime/components/stats/GaugeChart.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Stats/GaugeChart',
    component: GaugeChart,
    args: {
        title: 'Gauge Chart',
        data: {
      value: 10,
      itemStyle: {
        color: "#4CAF50"
      },
      name: 'Availability'
    }
      }

} as Meta<typeof GaugeChart>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { GaugeChart },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<GaugeChart v-bind="$props"/>',
});

export const Example = Template.bind({});