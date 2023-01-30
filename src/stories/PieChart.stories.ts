import PieChart from '../runtime/components/stats/PieChart.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'Stats/PieChart',
    component: PieChart,
    args: {
        title: 'Pie Chart',
        dark: false,
        data: [
            {
                name: 'idle',
                value: 50,
                itemStyle: {
        opacity: 0.9,
        color: "#424242"
      }
            },
                        {
                name: 'success',
                value: 50,
                itemStyle: {
        opacity: 0.9,
        color: "#4CAF50"
      }
            }
        ]
    }
} as Meta<typeof PieChart>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { PieChart },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<PieChart v-bind="$props"/>',
});

export const Example = Template.bind({});