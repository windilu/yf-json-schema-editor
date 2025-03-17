// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import {
  VCard,
  VCardActions,
  VCardTitle,
  VCardText,
  VCheckbox,
  VContainer,
  VBtn,
  VRow,
  VCol,
  VDivider,
  VDialog,
  VSelect,
  VIcon,
  VTextField,
  VTooltip,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelTitle,
  VExpansionPanelText,
  VCardItem,
  VCombobox,
} from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Translations provided by Vuetify
import { ja, zhHans, en, zhHant } from 'vuetify/locale';

const vuetify = createVuetify({
  components: {
    VCard,
    VCardActions,
    VCardTitle,
    VCardText,
    VCheckbox,
    VContainer,
    VBtn,
    VRow,
    VCol,
    VDivider,
    VDialog,
    VSelect,
    VIcon,
    VTextField,
    VTooltip,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelTitle,
    VExpansionPanelText,
    VCardItem,
    VCombobox,
  },
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
