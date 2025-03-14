<template>
  <v-card elevation="0">
    <v-card-text class="space-y-4">
      <OutlinedContainer :label="t('noun.basicAttributes')" style="padding: 0">
        <v-container class="max-h-[30vh] overflow-y-scroll">
          <v-row>
            <v-col v-for="item of defaultKeys" :key="item.key" cols="6">
              <v-combobox
                v-if="item.key === 'required'"
                v-model="item.value as string[]"
                :items="Object.keys(source.properties)"
                :label="item.key"
                variant="outlined"
                multiple
                @update:model-value="() => handleComboboxChange(item)"
              />

              <v-combobox
                v-else-if="
                  item.key === 'allOf' ||
                  item.key === 'anyOf' ||
                  item.key === 'oneOf'
                "
                v-model="item.value as any"
                :label="item.key"
                multiple
                variant="outlined"
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

              <v-checkbox
                v-else-if="item.key === 'additionalProperties'"
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
  'properties',
  'required',
  'additionalProperties',
  'patternProperties',
  'dependencies',
  'minProperties',
  'maxProperties',
  'title',
  'description',
  'examples',
  'allOf',
  'oneOf',
  'not',
];

const initDefaultKeys = () => {
  const data = [
    {
      key: 'required',
      value: [],
      description: '列出必需的属性名，缺少这些属性会导致验证失败。',
      example: '["name", "age"]',
    },
    {
      key: 'additionalProperties',
      value: false,
      description:
        '定义是否允许未在 properties 中列出的额外属性，默认为 true。',
      example: 'false',
    },
    {
      key: 'patternProperties',
      value: '',
      description: '定义属性名模式和相应的模式验证，使用正则表达式匹配属性名。',
      example: '{ "^S_": { "type": "string" } }',
    },
    {
      key: 'dependencies',
      value: '',
      description:
        '定义属性之间的依赖关系，指明某个属性存在时其他属性也必须存在。',
      example: '{ "age": ["name"] }',
    },
    {
      key: 'minProperties',
      value: '',
      rules: [
        (value: any) => !value || /^\d+$/.test(value) || t('warn.vmniWarn'),
      ],
      description: '定义对象最少能够包含的属性数量，少于该数量则验证失败。',
      example: '1',
    },
    {
      key: 'maxProperties',
      value: '',
      rules: [
        (value: any) => !value || /^\d+$/.test(value) || t('warn.vmniWarn'),
      ],
      description: '定义对象最多能够包含的属性数量，多于该数量则验证失败。',
      example: '3',
    },
    {
      key: 'title',
      value: '',
      description: '为对象提供一个标题，通常用于描述类型的名称。',
      example: '"User Data"',
    },
    {
      key: 'description',
      value: '',
      description: '为对象提供描述，通常用来详细解释该对象的用途。',
      example: '"A JSON schema object representing user data."',
    },
    {
      key: 'examples',
      value: '',
      description: '提供一个或多个有效对象的示例，用于帮助理解对象结构。',
      example: '[{ "name": "Alice", "age": 30 }]',
    },
    {
      key: 'allOf',
      value: '',
      description: '定义对象必须同时符合所有的子模式，可以组合多个 schema。',
      example:
        '[{ "type": "object", "properties": { "name": { "type": "string" }}}, { "type": "object", "properties": { "age": { "type": "integer" }} }]',
    },
    {
      key: 'anyOf',
      value: '',
      description:
        '定义对象必须符合至少一个子模式，可以是多个 schema 中的任意一个。',
      example:
        '[{ "type": "object", "properties": { "admin": { "type": "boolean" }}}, { "type": "object", "properties": { "user": { "type": "boolean" }} }]',
    },
    {
      key: 'oneOf',
      value: '',
      description: '定义对象必须符合其中恰好一个子模式。',
      example:
        '[{ "type": "object", "properties": { "email": { "type": "string" }}}, { "type": "object", "properties": { "phone": { "type": "string" }} }]',
    },
    {
      key: 'not',
      value: '',
      description: '定义对象不能符合的模式，提供一种排除的方式。',
      example:
        '{ "not": { "type": "object", "properties": { "password": { "type": "string", "minLength": 1 }} }}',
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
    if (key === 'minProperties' || key === 'maxProperties') {
      if (!validationNonNegativeInteger(value)) return;
      else {
        schemaItem.value[key] = parseInt(value, 10);
        return;
      }
    }

    schemaItem.value[key] = value;
  }
};

// 修改对象中必需的属性名
const handleComboboxChange = (item: any) => {
  schemaItem.value.required = item.value;
};

const handleCheck = (value: any) => {
  schemaItem.value.additionalProperties = value;
};

const handleEnumInputChange = (isFocused: boolean, item: any) => {
  if (!isFocused) {
    // 移除空值和空格符
    schemaItem.value[item.key] = (item.value as string[]).filter(
      (item) => item && !/ /g.test(item)
    );
  }
};

const handleSubmit = () => {
  emits('submit', JSON.parse(JSON.stringify(schemaItem)));
};
</script>

<style lang="scss" scoped></style>
