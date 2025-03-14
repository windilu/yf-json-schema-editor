<template>
  <div>
    <v-container fluid class="max-h-screen">
      <v-row class="h-full">
        <v-col cols="8">
          <YFJsonSchemaEditorItem v-model="schema" is-root />
        </v-col>

        <v-col cols="4">
          <div class="w-full overflow-scroll">
            <VueJsonPretty :data="schema" />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="dialog" class="w-3/5">
      <v-card :title="t('noun.setting')">
        <StringSetUp
          v-if="setUpSchemaItem.type === 'string'"
          :source="setUpSchemaItem"
          @close="dialog = false"
          @submit="handleSetUpSubmit"
        />

        <IntegerSetUp
          v-else-if="setUpSchemaItem.type === 'integer'"
          :source="setUpSchemaItem"
          @close="dialog = false"
          @submit="handleSetUpSubmit"
        />

        <ObjectSetUp
          v-else-if="setUpSchemaItem.type === 'object'"
          :source="setUpSchemaItem"
          @close="dialog = false"
          @submit="handleSetUpSubmit"
        />

        <ArraySetUp
          v-else-if="setUpSchemaItem.type === 'array'"
          :source="setUpSchemaItem"
          @close="dialog = false"
          @submit="handleSetUpSubmit"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watchEffect } from 'vue';
import YFJsonSchemaEditorItem from './components/YFJsonSchemaEditorItem.vue';
import emitter, { TParames } from '../plugins/mitt';
import { t } from '../plugins/i18n';
import { isObject, isArray, createUniqueId } from './../utils';
import StringSetUp from './components/StringSetUp.vue';
import IntegerSetUp from './components/IntegerSetUp.vue';
import ObjectSetUp from './components/ObjectSetUp.vue';
import ArraySetUp from './components/ArraySetUp.vue';
import VueJsonPretty from 'vue-json-pretty';

const schema = defineModel<Record<string, any>>();
watchEffect(() => {
  // 初始化schema 防止用户输入非对象
  if (
    !schema.value ||
    !isObject(schema.value) ||
    !Object.keys(schema.value).length
  ) {
    schema.value = {
      type: 'object',
      title: 'Root',
      properties: {},
    };
  }
});

const dialog = ref(false);

// 注意： 如果有两个key相同时会出错  找时间解决
const findTarget = (
  callback: (obj: Record<string, any>) => void,
  targetKey?: string,
  parentKey?: string
) => {
  const search = (obj: Record<string, any>) => {
    if (!isObject(obj) || obj === null) {
      return;
    }

    if (!targetKey) return callback(obj);

    // 遍历对象的每个键
    for (let key in obj) {
      if (key === targetKey) {
        callback(obj[key]); // 找到目标键
        return;
      }

      if (key === parentKey) {
        callback(obj[key]);

        return;
      }

      // 检查属性类型
      if (Array.isArray(obj[key])) {
        // 如果是数组，遍历数组中的每个元素
        obj[key].forEach((item) => search(item));
      } else {
        // 递归搜索嵌套对象
        search(obj[key]);
      }
    }
  };

  search(schema.value!);
};

// 事件总线处理节点的增删改操作
type TArrType = 'arr_1' | 'arr_2' | 'arr_3';
const checkArraySchemaItemsType = (obj: Record<string, any>): TArrType => {
  // arr_1 单一类型数组  数组子项是对象
  // arr_2 单一类型数组  数组子项是普通类型
  // arr_3 多类型数组
  if (isObject(obj.items)) {
    if (obj.items.type === 'object') return 'arr_1';
    else return 'arr_2';
  }

  if (isArray(obj.items)) {
    return 'arr_3';
  }

  return 'arr_2';
};

const uniqueId = createUniqueId();

// 增加子节点
emitter.on('addNode', (e) => {
  findTarget((obj) => {
    if (obj.type === 'object') {
      obj.properties[uniqueId('item_')] = {
        type: 'string',
      };
      return;
    }

    if (obj.type === 'array') {
      // 对象数据
      if (isObject(obj.items) && obj.items.type === 'object') {
        obj.items.properties[uniqueId('item_')] = {
          type: 'string',
        };

        return;
      }

      // 多类型数据
      if (isArray(obj.items)) {
        obj.items.push({ type: 'string' });
      }
    }
  }, e.key);
});

// 移除子节点
emitter.on('removeNode', (e) => {
  findTarget((obj) => {
    if (obj.type === 'object') {
      Reflect.deleteProperty(obj.properties, e.key);
      return;
    }

    if (obj.type === 'array') {
      switch (checkArraySchemaItemsType(obj)) {
        case 'arr_1':
          Reflect.deleteProperty(obj.items.properties, e.key);
          break;
        case 'arr_3':
          //arr_3 -> e.key  => 'schema_array_${label}_item_${index}'
          const index = e.key.split('_')[4];
          obj.items.splice(index, 1);
          break;
      }

      return;
    }
  }, e.parentKey);
});

const handleChagneType = (obj: any, e: any) => {
  // obj.type 源数据类型
  if (obj.type === 'object' || obj.type === 'array') {
    Object.keys(obj).forEach((key) => {
      if (key !== 'type') Reflect.deleteProperty(obj, key);
    });
  }

  // e.type 要修改的数据类型
  if (e.type === 'object') {
    obj.properties = {};
  }
  if (e.type === 'array') {
    obj.items = { type: 'string' };
  }

  // 修改数据类型值
  obj.type = e.type;
};
// 修改数据类型
emitter.on('typeChange', (e) => {
  // 多类型数组的子节点 key => {parentKey}_item_{index}
  const isArrayItem = e.key.split('_').length === 5;
  // 单一类型数组子节点 key => {parentKey}_item
  const isArrayAlone = e.key.split('_').length === 4;

  findTarget(
    (obj) => {
      if (isArrayItem) {
        // 处理多类型数组的子节点的类型转换
        handleChagneType(obj.items[e.key.split('_')[4]], e);
      } else if (isArrayAlone) {
        handleChagneType(obj.items, e);
      } else {
        handleChagneType(obj, e);
      }
    },
    e.key,
    isArrayItem || isArrayAlone ? e.parentKey : undefined // 查询多类型数组子节点的父节点
  );
});

// 修改数据的键{a: 1} => {b: 1}
const renameKey = (
  obj: Record<string, any>,
  oldKey: string,
  newKey: string
) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      key === oldKey ? [newKey, value] : [key, value]
    )
  );
};
emitter.on('labelChange', (e) => {
  findTarget((obj) => {
    if (obj.type === 'object') {
      obj.properties = renameKey(obj.properties, e.key, e.changeValue);
    } else if (obj.type === 'array') {
      //  修改对象数据中对象的key
      if (obj.items.type === 'object') {
        obj.items.properties = renameKey(
          obj.items.properties,
          e.key,
          e.changeValue
        );
      }
    }
  }, e.parentKey);
});

onBeforeUnmount(() => {
  emitter.off('addNode');
  emitter.off('removeNode');
  emitter.off('typeChange');
  emitter.off('labelChange');
  emitter.off('onSetting');
});

// 设置弹窗相关操作
const setUpSchemaItem = ref<Record<string, any>>({});
const targetSettingKey = ref<TParames>();

// 监听弹窗开启事件
emitter.on('onSetting', (e) => {
  targetSettingKey.value = e;

  findTarget((obj) => {
    setUpSchemaItem.value = obj;
  }, e.key);

  dialog.value = true;
});
const handleSetUpSubmit = (result: Record<string, any>) => {
  if (!targetSettingKey.value) return;

  findTarget((parentObj) => {
    parentObj.properties[targetSettingKey.value!.key] = result;
  }, targetSettingKey.value.parentKey);

  dialog.value = false;
};
</script>

<style lang="scss" scoped>
pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 20px;
  border-radius: 5px;
  white-space: pre-wrap; /* 允许换行 */
  word-wrap: break-word; /* 处理长单词的换行 */
  overflow: auto; /* 允许滚动 */
}
.key {
  color: #61afef; /* 键的颜色 */
}
.string {
  color: #98c379; /* 字符串的颜色 */
}
.number {
  color: #d19a66; /* 数字的颜色 */
}
.boolean {
  color: #c678dd; /* 布尔值的颜色 */
}
.null {
  color: #56b6c2; /* null 的颜色 */
}
</style>
