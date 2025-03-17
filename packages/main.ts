import { createApp } from 'vue';
import App from './App.vue';
import 'vue-json-pretty/lib/styles.css';
// import YFJsonSchemaEditor from '.';
import YFJsonSchemaEditor from '../dist/YFJsonSchemaEditor.es';
import '../dist/assets/css/YFJsonSchemaEditor.css';

createApp(App).use(YFJsonSchemaEditor).mount('#app');
