import YFJsonSchemaEditor from './yf-json-schema-editor/YFJsonSchemaEditor.vue';


const install = (Vue) => {
  Vue.component('YFJsonSchemaEditor', YFJsonSchemaEditor);
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  YFJsonSchemaEditor
}