import FileManager from '../runtime/components/FileManager.vue'

import {Meta} from '@storybook/vue';
import filetree from "./filetree.json";

export default {
    title: 'FileManager',
    component: FileManager,
    args: {
      filetree: filetree,
      headers: [{"text":"","value":"","align":"left","configable":false,"visible":true,"filterable":false},{"text":"Имя","value":"filename","align":"left","configable":false,"visible":true},{"text":"Размер файла","value":"size","align":"right","configable":true,"visible":true},{"text":"Последнее изменение","value":"modified","align":"right","configable":true,"visible":true},{"text":"Высота объекта","value":"object_height","align":"right","configable":true,"visible":false},{"text":"Высота Слоя","value":"layer_height","align":"right","configable":true,"visible":false},{"text":"Количество Материала","value":"filament_total","align":"right","configable":true,"visible":false},{"text":"Время печати","value":"estimated_time","align":"right","configable":true,"visible":true},{"text":"Слайсер","value":"slicer","align":"right","configable":true,"visible":true},{"text":"Режим печати","value":"printing_mode","align":"right","configable":true,"visible":true}],
      path: 'gcodes',
      root: 'gcodes',
      validGcodeExtensions: ['.gcode']
    }
} as Meta<typeof FileManager>

const Template = (args: any, { argTypes }: {argTypes: any}) => ({
  components: { FileManager },
  props: [...Object.keys(argTypes), ...Object.keys(args)],
  template: '<FileManager v-bind="$props" :path.sync="path"/>',
});

export const Example = Template.bind({});