import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vuetify from 'vite-plugin-vuetify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    VueI18nPlugin({
      include: path.resolve(__dirname, './src/plugins/i18n/locale/**'),
    }),

    vuetify({
      autoImport: true, // 启用自动导入
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
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
      entry: './src/package/index.js', // 入口文件
      name: 'yf-json-schema-editor', // 库的名称（即暴露的全局变量名）
      fileName: (format) => `yf-json-schema-editor.${format}.js`, // 输出文件名
    },
    outDir: 'lib', // 输出目录
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
