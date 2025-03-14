<template>
  <div>
    <div v-for="(item, index) of items" :key="index">
      <v-text-field
        v-model="item.value"
        label="Value"
        hide-details
        class="mb-4"
        @update:focused="(isFocused) => handleValueChange(isFocused, item)"
      >
        <template #prepend>
          <v-text-field
            v-model="item.key"
            label="Key"
            width="80"
            hide-details
            :rules="keyRule"
            @update:focused="(isFocused) => handleKeyChange(isFocused, item)"
          />
        </template>

        <template #append>
          <div class="flex items-end">
            <v-btn
              elevation="0"
              density="compact"
              icon="mdi-close-circle-outline"
              @click="() => handleRemoveItem(index, item)"
            />
          </div>
        </template>
      </v-text-field>
    </div>

    <v-btn icon="mdi-plus" size="x-small" class="mt-2" @click="handleAddItem" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { t } from './../../plugins/i18n';
import { createUniqueId } from './../../utils';

type TItem = { key: string; value: string };

// defaultKeys schema对应类型的默认设置项
const { defaultKeys = [] } = defineProps<{ defaultKeys: string[] }>();

const schemaItem = defineModel<Record<string, any>>({ default: {} });

// 自定义数据
const initItems = (): TItem[] => {
  return Object.entries(schemaItem.value)
    .map(([key, value]) => {
      if (!defaultKeys.includes(key)) {
        return { key, value };
      }
    })
    .filter((item) => item) as TItem[];
};
const items = ref<TItem[]>(initItems());

const uniqueId = createUniqueId();
const handleAddItem = () => {
  const key = uniqueId('key_');
  items.value.push({ key, value: '' });
  Reflect.set(schemaItem.value, key, '');
};

const handleRemoveItem = (index: number, item: TItem) => {
  items.value.splice(index, 1);

  if (item.key) {
    // 移除对应属性
    Reflect.deleteProperty(schemaItem.value, item.key);
  }
};

const keyRule = [
  (value?: string) => !value || !defaultKeys.includes(value) || t('warn.ikn'),
];

let perItem: TItem;
const handleKeyChange = (isFocused: boolean, item: TItem) => {
  if (!item.key || defaultKeys.includes(item.key)) return;

  if (isFocused) {
    perItem = JSON.parse(JSON.stringify(item));
    return;
  }

  if (perItem.key === item.key) return;

  // perItem修改前  item  修改后
  if (Reflect.has(schemaItem.value, perItem.key)) {
    // 保留原来的值
    Reflect.set(
      schemaItem.value,
      item.key,
      Reflect.get(schemaItem.value, perItem.key)
    );
    Reflect.deleteProperty(schemaItem.value, perItem.key);
  }
};

const handleValueChange = (isFocused: boolean, item: TItem) => {
  if (isFocused) return;
  if (Reflect.has(schemaItem.value, item.key)) {
    schemaItem.value[item.key] = item.value;
  }
};
</script>

<style lang="scss" scoped></style>
