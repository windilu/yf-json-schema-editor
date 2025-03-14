<template>
  <div class="w-full h-full">
    <div v-if="modelValue.type === 'object'">
      <div v-if="modelValue.properties">
        <SchemaItem
          v-model="modelValue"
          :label="label"
          :is-root="isRoot"
          :parent-label="parentLabel"
        >
          <div v-for="(item, key) in modelValue.properties" :key="key">
            <YFJsonSchemaEditorItem
              v-model="modelValue.properties[key]"
              :label="key"
              :parent-label="label"
            />
          </div>
        </SchemaItem>
      </div>
    </div>

    <div v-else-if="modelValue.type === 'array'">
      <SchemaItem
        v-model="modelValue"
        :label="label"
        :parent-label="parentLabel"
        :disabled="disabled"
      >
        <div v-if="isObject(modelValue.items)">
          <div
            v-if="
              modelValue.items.type === 'object' && modelValue.items.properties
            "
          >
            <div v-for="(item, key) in modelValue.items.properties" :key="key">
              <YFJsonSchemaEditorItem
                v-model="modelValue.items.properties[key]"
                :label="key"
                :parent-label="label"
              />
            </div>
          </div>

          <YFJsonSchemaEditorItem
            v-else
            v-model="modelValue.items"
            :parent-label="label"
            disabled
            :label="`schema_array_${label}_item`"
            :hide-remove-node-btn="true"
          />
        </div>

        <div v-else-if="isArray(modelValue.items)">
          <div v-for="(item, index) of modelValue.items" :key="index">
            <YFJsonSchemaEditorItem
              v-model="modelValue.items[index]"
              disabled
              :label="`schema_array_${label}_item_${index}`"
              :parent-label="label"
            />
          </div>
        </div>
      </SchemaItem>
    </div>

    <SchemaItem
      v-else
      v-model="modelValue"
      :label="label"
      :parent-label="parentLabel"
      :disabled="disabled"
      :hide-remove-node-btn="hideRemoveNodeBtn"
    />
  </div>
</template>

<script setup lang="ts">
import {} from 'vue';
import SchemaItem from './SchemaItem.vue';
import { isArray, isObject } from './../../utils';

const { label, isRoot, parentLabel, hideRemoveNodeBtn } = defineProps<{
  label?: any;
  isRoot?: boolean;
  parentLabel?: string;
  disabled?: boolean;
  hideRemoveNodeBtn?: boolean;
}>();

const modelValue = defineModel<Record<string, any>>({
  default: {},
});
</script>

<style lang="scss" scoped></style>
