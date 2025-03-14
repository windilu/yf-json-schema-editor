import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vuetify from 'vite-plugin-vuetify';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    VueI18nPlugin({
      include: resolve(__dirname, './src/plugins/i18n/locale/**'),
    }),

    vuetify({
      autoImport: true, // 启用自动导入
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {},
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/package/index.ts'), // 入口文件
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
