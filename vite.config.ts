import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'), // 入口文件
      name: 'YFJsonSchemaEditor', // 库的名称（即暴露的全局变量名）
      fileName: (format) => `YFJsonSchemaEditor.${format}.js`, // 输出文件名
    },
    cssCodeSplit: true,
    rollupOptions: {
      // 确保外部化处理那些依赖（如 vue）
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue', // Vue 的全局变量名
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // 自定义 CSS 文件名格式，例如：styles-[hash].css
            return 'assets/css/YFJsonSchemaEditor.[ext]';
          }
          // 保持其他资源默认格式
          return 'assets/[name].[ext]';
        },
      },
    },
  },
});
