<template>
  <div class="mb-4">
    <DefineTemplate>
      <div class="flex space-x-2 items-center mb-2" @click.stop="">
        <v-card-item v-if="isRoot">
          <template #prepend>
            <v-card-title>
              <v-icon icon="mdi-file-tree" />
              {{ t('noun.jsrn') }}
            </v-card-title>
          </template>
        </v-card-item>

        <div v-else class="flex space-x-2">
          <div class="pt-3">
            <!-- 标记数组类型 -->
            <v-icon
              v-if="isArray(item.items) && item.type === 'array'"
              icon="mdi-dots-vertical"
            />

            <v-icon
              v-else-if="
                isObject(item.items) &&
                item.type === 'array' &&
                item.items.type === 'object'
              "
              icon="mdi-code-braces"
            />

            <v-icon
              v-else-if="
                isObject(item.items) &&
                item.type === 'array' &&
                item.items.type !== 'object'
              "
              icon="mdi-circle-medium"
            />
          </div>

          <v-select
            v-model="type"
            hide-details
            :label="t('noun.type')"
            width="120"
            :items="propertyTypes"
            density="compact"
            :disabled="isRoot"
            @update:model-value="handleTypeChange"
          />

          <v-text-field
            v-model="fieldValue"
            class="w-64"
            label="Label"
            hide-details
            :disabled="disabled"
            @update:focused="handleLabelChange"
          />
        </div>

        <div class="flex space-x-2">
          <v-tooltip
            v-if="isShowAddNodeBtn"
            location="top center"
            :text="t('noun.addChildNode')"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                elevation="0"
                density="compact"
                icon="mdi-plus-circle-outline"
                @click="handleAddChildNode"
              />
            </template>
          </v-tooltip>

          <v-tooltip
            v-if="!isRoot && !hideRemoveNodeBtn"
            location="top center"
            :text="t('noun.deleteNode')"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                elevation="0"
                density="compact"
                icon="mdi-close-circle-outline"
                @click="handleRemoveChildNode"
              />
            </template>
          </v-tooltip>

          <v-tooltip location="top center" :text="t('noun.setUp')">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                elevation="0"
                density="compact"
                icon="mdi-cog-outline"
                @click="handleSetting"
              />
            </template>
          </v-tooltip>
        </div>
      </div>
    </DefineTemplate>

    <v-expansion-panels
      v-if="item.type === 'object' || item.type === 'array'"
      v-model="panel"
    >
      <v-expansion-panel elevation="0">
        <v-expansion-panel-title class="p-0">
          <ReuseTemplate />
        </v-expansion-panel-title>

        <v-divider v-if="isRoot" />

        <v-expansion-panel-text>
          <slot />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <ReuseTemplate v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import emitter, { TSchemaType } from './../../plugins/mitt';
import { isArray, isObject } from './../../utils';
import { t } from './../../plugins/i18n';

const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

const { label, parentLabel, isRoot, disabled, hideRemoveNodeBtn } =
  defineProps<{
    label?: any;
    isRoot?: boolean;
    parentLabel?: string;
    disabled?: boolean;
    hideRemoveNodeBtn?: boolean;
  }>();

const item = defineModel<any>();

const isShowAddNodeBtn = computed(() => {
  if (item.value.type === 'object') return true;
  else if (item.value.type === 'array' && item.value.items.type === 'object') {
    return true;
  } else if (item.value.type === 'array' && isArray(item.value.items)) {
    return true;
  } else {
    return false;
  }
});

const panel = ref(isRoot ? [0] : []);
const fieldValue = ref(label);

const type = ref(item.value.type);

const propertyTypes: TSchemaType[] = [
  'string',
  'integer',
  'number',
  'object',
  'array',
  'boolean',
];

const handleAddChildNode = () => {
  emitter.emit('addNode', { key: label, parentKey: parentLabel });
};

const handleRemoveChildNode = () => {
  emitter.emit('removeNode', { key: label, parentKey: parentLabel });
};

const handleTypeChange = (type: TSchemaType) => {
  emitter.emit('typeChange', { key: label, parentKey: parentLabel, type });
};

const handleLabelChange = (isFocus: boolean) => {
  if (!isFocus) {
    if (!fieldValue.value) {
      // fieldValue.value不能为空
      fieldValue.value = label;
      return;
    }

    emitter.emit('labelChange', {
      key: label,
      parentKey: parentLabel,
      changeValue: fieldValue.value,
    });
  }
};

const handleSetting = () => {
  emitter.emit('onSetting', { key: label, parentKey: parentLabel });
};
</script>

<style lang="scss" scoped></style>
