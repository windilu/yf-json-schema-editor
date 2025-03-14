import { App, Plugin } from 'vue';
import YFJsonSchemaEditor from './yf-json-schema-editor/YFJsonSchemaEditor.vue';
// taiwincss
import './assets/style.css';

import vuetify from './plugins/vuetify';

const install: Plugin = {
  install(app: App) {
    app.use(vuetify); // 在插件中使用 Vuetify
    app.component('YFJsonSchemaEditor', YFJsonSchemaEditor);
  },
};

export default install;
export { YFJsonSchemaEditor };
