import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'packages'),
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'package/index.ts'), // 入口文件
      name: 'YFJsonSchemaEditor', // 库的名称（即暴露的全局变量名）
      fileName: (format) => `YFJsonSchemaEditor.${format}.js`, // 输出文件名
    },
    rollupOptions: {
      // 确保外部化处理那些依赖（如 vue）
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // Vue 的全局变量名
        },
      },
    },
  },
});
