import DashboardPrinterAvatar from '../runtime/components/dashboard/DashboardPrinterAvatar.vue';
import { Meta } from '@storybook/vue';

export default {
    title: 'DashboardPrinterAvatar',
    component: DashboardPrinterAvatar,
    argTypes: {
        state: {
            control: 'select',
            options: ['success','error', 'warning','white', '']
        }
    },
    args: {
        width: 160,
        src: 'https://stage.stereotech.org/assets/printers/desktop/series3.jpg'
    }
} as Meta<typeof DashboardPrinterAvatar>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { DashboardPrinterAvatar },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<DashboardPrinterAvatar v-bind="$props"/>',
});

export const Example = Template.bind({});
