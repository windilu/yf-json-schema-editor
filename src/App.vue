<script setup lang="ts">
import { ref } from 'vue';
import YFJsonSchemaEditor from './packages/yf-json-schema-editor/YFJsonSchemaEditor.vue';

const schema = ref({
  type: 'object',
  properties: {
    readingId: {
      type: 'integer',
    },
    readTimeStamp: {
      type: 'string',
    },
    tk: {
      type: 'object',
      properties: {
        powerOff: {
          type: 'integer',
        },
        batCharging: {
          type: 'integer',
        },
        comType: {
          type: 'integer',
        },
        bat: {
          type: 'integer',
          enum: [0],
        },
      },
      required: ['powerOff', 'batCharging', 'comType', 'bat'],
    },
    wifiDataList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bssid: {
            type: 'string',
            pattern: '^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$',
          },
          rssi: {
            type: 'integer',
          },
          ufo: {
            type: 'object',
            properties: {
              field_3_1: {
                type: 'string',
                title: '',
              },
            },
          },
        },
        required: ['bssid', 'rssi'],
      },
    },
    credate: {
      type: 'array',
      title: '创建日期',
      items: [{ type: 'string' }, { type: 'integer' }],
    },
    alone: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
  required: ['readingId', 'readTimeStamp', 'tk', 'wifiDataList'],
});
</script>

<template>
  <YFJsonSchemaEditor v-model="schema" />
</template>

<style scoped>
body {
  padding: 0;
  margin: 0;
  /* 针对IE和Edge 隐藏滚动条  */
  -ms-overflow-style: none;
}
</style>
