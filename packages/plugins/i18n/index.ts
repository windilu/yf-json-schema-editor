import { createI18n } from 'vue-i18n';
import zhHans from './locale/zh.json';
import zhHant from './locale/zhHant.json';
import en from './locale/en.json';
import ja from './locale/ja.json';

const i18n = createI18n({
  locale: 'en', // 默认为浏览器默认语言
  legacy: false,
  messages: {
    zhHans, // 简体中文
    zhHant, // 繁体中文
    en, // 英文
    ja, // 日文
  },
});

export const t: typeof i18n.global.t = i18n.global.t;

export default i18n;
