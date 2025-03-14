import { App, Plugin } from 'vue';
import YFJsonSchemaEditor from './yf-json-schema-editor/YFJsonSchemaEditor.vue';
import vuetify from './plugins/vuetify';
// taiwincss
import './assets/style.css';

const install: Plugin = {
  install(app: App) {
    app.use(vuetify); // 在插件中使用 Vuetify
    app.component('YFJsonSchemaEditor', YFJsonSchemaEditor);
  },
};

export default install;
export { YFJsonSchemaEditor };
