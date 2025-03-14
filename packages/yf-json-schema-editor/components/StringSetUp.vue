<template>
  <v-card elevation="0">
    <v-card-text class="space-y-4">
      <OutlinedContainer :label="t('noun.basicAttributes')" style="padding: 0">
        <v-container>
          <v-row>
            <v-col v-for="item of defaultKeys" :key="item.key" cols="6">
              <v-select
                v-if="item.key == 'format'"
                v-model="item.value"
                :items="formats"
                label="format"
                :item-props="formatProps"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="handleSelectChange"
              >
                <template #append-inner>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-icon v-bind="props" icon="mdi-help-circle-outline" />
                    </template>

                    {{ item.description }}
                  </v-tooltip>
                </template>
              </v-select>

              <v-combobox
                v-else-if="item.key === 'enum'"
                v-model="item.value as any"
                :label="item.key"
                multiple
                variant="outlined"
                hide-details
                density="compact"
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

      <OutlinedContainer :label="t('noun.customProperties')">
        <CustomProperties v-model="schemaItem" :default-keys="dKeys" />
      </OutlinedContainer>

      <OutlinedContainer :label="t('noun.preview')">
        <div class="max-h-[240px] overflow-scroll">
          <VueJsonPretty :data="schemaItem" />
        </div>
      </OutlinedContainer>
    </v-card-text>

    <v-card-actions class="flex justify-end">
      <v-btn @click="handleSubmit">
        {{ t('noun.submit') }}
      </v-btn>

      <v-btn @click="() => emits('close')">
        {{ t('noun.cancel') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import CustomProperties from './CustomProperties.vue';
import { t } from './../../plugins/i18n';
import { validationNonNegativeInteger } from './../../utils';
import OutlinedContainer from './OutlinedContainer.vue';

const { source } = defineProps<{ source: Record<string, any> }>();
const emits = defineEmits(['close', 'submit']);

// 最终操作数据
const schemaItem = ref(JSON.parse(JSON.stringify(source)));

// 基础设置数据
const dKeys = [
  'type',
  'minLength',
  'maxLength',
  'pattern',
  'const',
  'format',
  'enum',
];

const initDefaultKeys = () => {
  const data = [
    {
      key: 'minLength',
      value: '',
      description: '定义字符串的最小长度，必须为非负整数。',
      rules: [
        (value: any) =>
          !value || validationNonNegativeInteger(value) || t('warn.vmniWarn'),
      ],
    },
    {
      key: 'maxLength',
      value: '',
      description: '定义字符串的最大长度，必须为非负整数。',
      rules: [
        (value: any) => !value || /^\d+$/.test(value) || t('warn.vmniWarn'),
      ],
    },
    {
      key: 'pattern',
      value: '',
      description: '使用正则表达式定义字符串的模式: ^[a-zA-Z0-9]+$',
    },
    {
      key: 'const',
      value: '',
      description: '定义一个常量值，表示字符串必须等于此值。',
    },
    {
      key: 'format',
      value: '',
      description: '用于指定字符串的格式，例如日期、电子邮件等。',
    },
    {
      key: 'enum',
      value: [],
      description: '表示字符串必须是列出的某个值之一, 输入值后回车键确认',
      rules: [
        (value: string) =>
          !value ||
          value.split(' ').every((item) => /^\d+$/.test(item)) ||
          '只能输入数字',
      ],
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

// 选择器基础数据
const formats = [
  { key: 'date-time', example: '2023-10-01T14:48:00Z' },
  { key: 'date', example: '2023-10-01' },
  { key: 'time', example: '14:48:00' },
  { key: 'email', example: 'example@example.com' },
  { key: 'hostname', example: 'www.example.com' },
  { key: 'ipv4', example: '192.168.1.1' },
  { key: 'ipv6', example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334' },
  { key: 'uri', example: 'https://www.example.com' },
  { key: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
];
const formatProps = (item: { key: string; example: string }) => {
  return {
    title: item.key,
    subtitle: item.example,
  };
};

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

const handleSelectChange = (value: any) => {
  if (!value) Reflect.deleteProperty(schemaItem.value, 'format');
  else schemaItem.value.format = value.key;
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
