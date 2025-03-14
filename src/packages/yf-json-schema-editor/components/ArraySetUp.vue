<template>
  <v-card elevation="0">
    <v-card-text class="space-y-4">
      <OutlinedContainer :label="$t('noun.basicAttributes')" style="padding: 0">
        <v-container>
          <v-row>
            <v-col v-for="item of defaultKeys" :key="item.key" cols="6">
              <v-checkbox
                v-if="item.key === 'uniqueItems'"
                v-model="item.value"
                hide-details
                density="compact"
                @update:model-value="handleCheck"
              >
                <template #label>
                  <span class="mr-4">{{ item.key }}</span>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-help-circle-outline" />
                    </template>

                    {{ item.description }}
                  </v-tooltip>
                </template>
              </v-checkbox>

              <v-text-field
                v-else
                v-model="item.value"
                :label="item.key"
                variant="outlined"
                :rules="item.rules || []"
                @update:focused="
                  (isFocused) => handleValueChange(isFocused, item)
                "
              >
                <template #append-inner>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-help-circle-outline" />
                    </template>

                    {{ item.description }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </OutlinedContainer>

      <OutlinedContainer :label="$t('noun.customProperties')">
        <CustomProperties v-model="schemaItem" :default-keys="dKeys" />
      </OutlinedContainer>

      <OutlinedContainer :label="$t('noun.preview')">
        <div class="max-h-[240px] overflow-scroll">
          <VueJsonPretty :data="schemaItem" />
        </div>
      </OutlinedContainer>
    </v-card-text>

    <v-card-actions class="flex justify-end">
      <v-btn @click="handleSubmit">
        {{ $t('noun.submit') }}
      </v-btn>

      <v-btn @click="() => emits('close')">
        {{ $t('noun.cancel') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import CustomProperties from './CustomProperties.vue';
import { t } from '@/plugins/i18n';
import { validationNonNegativeInteger } from '@/utils';
import OutlinedContainer from './OutlinedContainer.vue';

const { source } = defineProps<{ source: Record<string, any> }>();
const emits = defineEmits(['close', 'submit']);

// 最终操作数据
const schemaItem = ref(JSON.parse(JSON.stringify(source)));

// 基础设置数据
const dKeys = [
  'type',
  'items',
  'minItems',
  'maxItems',
  'uniqueItems',
  'required',
];

const initDefaultKeys = () => {
  const data = [
    {
      key: 'minItems',
      value: '',
      description: '定义数组中必须至少包含的元素数量。',
      rules: [
        (value: any) =>
          !value || validationNonNegativeInteger(value) || t('warn.vmniWarn'),
      ],
    },
    {
      key: 'maxItems',
      value: '',
      description: '定义数组中最多可以包含的元素数量。',
      rules: [
        (value: any) =>
          !value || validationNonNegativeInteger(value) || t('warn.vmniWarn'),
      ],
    },
    {
      key: 'uniqueItems',
      value: false,
      description: '数组中的所有元素必须是唯一的,不能有重复值。',
    },
  ];
  Object.keys(source).forEach((key) =>
    data.forEach((item) => {
      if (item.key === key) {
        item.value = source[key];
      }
    })
  );

  return data;
};
const defaultKeys = ref(initDefaultKeys());

const handleValueChange = (isFocused: boolean, item: any) => {
  const { key, value } = item;
  if (!isFocused) {
    // 值为空移除该属性
    if (!value) {
      Reflect.deleteProperty(schemaItem.value, key);
    }

    // 规则不符合则忽略
    if (key === 'minLength' || key === 'maxLength') {
      if (!validationNonNegativeInteger(value)) return;
      else {
        schemaItem.value[key] = parseInt(value, 10);
        return;
      }
    }

    schemaItem.value[key] = value;
  }
};

const handleCheck = (value: any) => {
  schemaItem.value.uniqueItems = value;
};

const handleSubmit = () => {
  emits('submit', JSON.parse(JSON.stringify(schemaItem)));
};
</script>

<style lang="scss" scoped></style>
