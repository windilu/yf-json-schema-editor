// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Translations provided by Vuetify
import { ja, zhHans, en, zhHant } from 'vuetify/locale';

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    global: { reset: false },
    VTabs: { density: 'compact' },
    VTextField: { density: 'compact', variant: 'underlined' },
    VSelect: { variant: 'underlined' },
    VBtn: { density: 'comfortable' },
    VAlert: { density: 'compact' },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  locale: {
    locale: 'en',
    fallback: 'sv',
    messages: { ja, zhHans, en, zhHant },
  },
});

export default vuetify;
