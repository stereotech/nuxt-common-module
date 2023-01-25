import DashboardPrinterHeaters from '../runtime/components/dashboard/DashboardPrinterHeaters.vue';

import { Meta } from '@storybook/vue';

export default {
    title: 'DashboardPrinterHeaters',
    component: DashboardPrinterHeaters,
    args: {
      headers: [
        'Name', 'Power','Temp'
      ],
      heaters: [
        {
 name: 'Extruder',
  type: 'extruder',
  icon: 'printer-3d-nozzle',
  iconColor: 'primary',
  target: 0,
  temperature: 200,
  additionSensors: [],
  power: 15,
  avgPower: 30,
  chartColor: 'primary',
  chartSeries: [],
  presets: [],
  min_temp: -100,
  max_temp: 320
        },
                {
 name: 'Extruder 2',
  type: 'extruder',
  icon: 'printer-3d-nozzle',
  iconColor: 'primary',
  target: 0,
  temperature: 25,
  additionSensors: [],
  power: 0,
  avgPower: 0,
  chartColor: 'primary',
  chartSeries: [],
  presets: [],
  min_temp: -100,
  max_temp: 320
        }
      ]
    }
} as Meta<typeof DashboardPrinterHeaters>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { DashboardPrinterHeaters },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<DashboardPrinterHeaters v-bind="$props"/>',
});

export const Example = Template.bind({});