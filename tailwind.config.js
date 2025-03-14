/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './packages/yf-json-schema-editor/*.{js,ts,vue}',
    './packages/yf-json-schema-editor/**/*.{js,ts,vue}',

    './examples/**/*.{js,ts,jsx,tsx,vue}',
    './examples/**/**/*.{js,ts,jsx,tsx,vue}',
    './examples/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

