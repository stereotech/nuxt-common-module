import LastJobStatus from '../runtime/components/dashboard/LastJobStatus.vue'

import {Meta} from '@storybook/vue';

export default {
    title: 'LastJobStatus',
    component: LastJobStatus,
    argTypes: {
value: {
    control: 'select',
    options: ['completed', 'failed', '']
}
    },
    args: {
        items: [
{
      text: "Completed",
      icon: "mdi-checkbox-marked-circle-outline",
      value: "completed",
      color: "success",
    },
    {
      text: 'Failed',
      icon: "mdi-close-circle-outline",
      value: "failed",
      color: "red"
    },
        ],

    }
} as Meta<typeof LastJobStatus>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { LastJobStatus },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<LastJobStatus v-bind="$props"/>',
});

export const Example = Template.bind({});