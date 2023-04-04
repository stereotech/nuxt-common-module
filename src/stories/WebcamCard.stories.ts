import WebcamCard from '../runtime/components/webcam/WebcamCard.vue'
import {Meta} from '@storybook/vue';

export default {
    title: 'Root/WebcamCard',
    component: WebcamCard,
    args: {
        url: `http://st-whe.local/webcam/?action=snapshot`,
        lighting: {
            enable: true,
            color: 'rgb(100,0,0)'
        },
        title: 'Webcam'
      }
} as Meta<typeof WebcamCard>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { WebcamCard },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<WebcamCard v-bind="$props"/>',
});

export const Example = Template.bind({});
