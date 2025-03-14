import mitt from 'mitt';

export type TSchemaType =
  | 'string'
  | 'integer'
  | 'number'
  | 'object'
  | 'array'
  | 'boolean';

export type TParames = { key: string; parentKey?: string };

export type Events = {
  addNode: TParames;
  removeNode: TParames;
  typeChange: TParames & { type: TSchemaType };
  labelChange: TParames & { changeValue: string };
  onSetting: TParames;
};

const emitter = mitt<Events>(); // inferred as Emitter<Events>

export default emitter;
