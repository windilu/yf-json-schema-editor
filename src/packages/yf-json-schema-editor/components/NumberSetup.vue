<template>
  <v-card elevation="0">
    <v-card-text class="space-y-4">
      <OutlinedContainer :label="$t('noun.basicAttributes')" style="padding: 0">
        <v-container>
          <v-row>
            <v-col v-for="item of defaultKeys" :key="item.key" cols="6">
              <v-checkbox
                v-if="
                  item.key === 'exclusiveMinimum' ||
                  item.key === 'exclusiveMaximum'
                "
                v-model="item.value"
                hide-details
                density="compact"
                @update:model-value="(value: any) => handleCheck(value, item.key)"
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

              <v-combobox
                v-else-if="item.key === 'enum'"
                v-model="item.value as any"
                :label="item.key"
                multiple
                variant="outlined"
                density="compact"
                :rules="item.rules"
                @update:focused="
                  (isFocused) => handleEnumInputChange(isFocused, item)
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
              </v-combobox>

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
                <template #prepend-inner />
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
import { validationNonNegativeInteger, validationInteger } from '@/utils';
import { t } from '@/plugins/i18n';
import OutlinedContainer from './OutlinedContainer.vue';

const { source } = defineProps<{ source: Record<string, any> }>();
const emits = defineEmits(['close', 'submit']);

// 最终操作数据
const schemaItem = ref(JSON.parse(JSON.stringify(source)));

// 基础设置数据
const dKeys = [
  'type',
  'minimum',
  'maximum',
  'exclusiveMinimum',
  'exclusiveMaximum',
  'multipleOf',
  'enum',
  'const',
];
const initDefaultKeys = () => {
  const data = [
    {
      key: 'minimum',
      value: '',
      description: '定义整数的最小值，可以是负数、零或正数。',
      example: '0',
      rules: [
        (value: any) => !value || validationInteger(value) || t('warn.vmiWarn'),
      ],
    },
    {
      key: 'maximum',
      value: '',
      description: '定义整数的最大值，可以是负数、零或正数。',
      example: '100',
      rules: [
        (value: any) => !value || validationInteger(value) || t('warn.vmiWarn'),
      ],
    },

    {
      key: 'multipleOf',
      value: '',
      description: '定义整数必须是指定值的倍数。',
      example: '5',
      rules: [
        (value: any) =>
          !value || validationNonNegativeInteger(value) || t('warn.vmniWarn'),
      ],
    },
    {
      key: 'enum',
      value: '',
      description: '表示整数必须是列出的某个值之一,值之间用空格隔开',
      example: '[1, 2, 3]',
      rules: [
        (value: string[]) =>
          !value ||
          value.every((item) => validationInteger(item)) ||
          t('warn.vmiWarn'),
      ],
    },
    {
      key: 'const',
      value: '',
      description: '定义一个常量值，表示整数必须等于此值。',
      example: '42',
      rules: [
        (value: any) =>
          !value || validationNonNegativeInteger(value) || t('warn.vmiWarn'),
      ],
    },
    {
      key: 'exclusiveMinimum',
      value: '',
      description: '布尔值，指示 minimum 是否是排除的。',
      example: 'true',
      rules: [],
    },
    {
      key: 'exclusiveMaximum',
      description: '布尔值，指示 maximum 是否是排除的。',
      example: 'false',
      rules: [],
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
  if (!isFocused) {
    const { key, value } = item;
    // 值为空移除该属性
    if (!value) {
      Reflect.deleteProperty(schemaItem.value, key);
    }

    schemaItem.value[key] = value;
  }
};

const handleCheck = (value: boolean, key: string) => {
  schemaItem.value[key] = value;
};

const handleEnumInputChange = (isFocused: boolean, item: any) => {
  if (!isFocused) {
    // 移除空值和空格符
    schemaItem.value.enum = (item.value as string[]).filter(
      (item) => item && !/ /g.test(item)
    );
  }
};

const handleSubmit = () => {
  emits('submit', JSON.parse(JSON.stringify(schemaItem)));
};
</script>

<style lang="scss" scoped></style>
