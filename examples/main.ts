import { createApp } from 'vue';
import App from './App.vue';
import 'vue-json-pretty/lib/styles.css';
import YFJsonSchemaEditor from '../packages';

createApp(App).use(YFJsonSchemaEditor).mount('#app');
