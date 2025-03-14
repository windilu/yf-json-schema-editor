import { App, Plugin } from 'vue';
import YFJsonSchemaEditor from './package/yf-json-schema-editor/YFJsonSchemaEditor.vue';

const install: Plugin = {
  install(app: App) {
    app.component('YFJsonSchemaEditor', YFJsonSchemaEditor);
  },
};

export default {
  install,
};
export { YFJsonSchemaEditor };
