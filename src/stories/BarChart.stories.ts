import BarChart from '../runtime/components/stats/BarChart.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Stats/BarChart',
    component: BarChart,
    args: {
        title: 'Bar Chart',
        dark: false,
        data: [
            [new Date(), 10],
        ],
        xAxis: {
        type: "time",
        min: new Date().setHours(0, 0, 0) - 60 * 60 * 24 * 14 * 1000,
        max: new Date().setHours(0, 0, 0),
        minInterval: 60 * 60 * 24 * 1000,
        splitLine: {
          show: true,
          lineStyle: {
            color: ''
          }
        },
        axisLabel: {
          color: '',
          margin: 10
        }
      }
    }
} as Meta<typeof BarChart>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { BarChart },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<BarChart v-bind="$props"/>',
});

export const Example = Template.bind({});