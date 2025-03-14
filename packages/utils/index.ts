// 校验非负整数
export const validationNonNegativeInteger = (value: string) => {
  return /^\d+$/.test(value);
};

// 校验整数
export const validationInteger = (value: string) => {
  return /^[+-]?\d+$/.test(value);
};

export const isObject = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Object]';
};

export const isNumber = (value: any) => {
  return typeof value === 'number';
};

export const isBoolean = (value: any) => {
  return typeof value === 'boolean';
};

export const isString = (value: any) => {
  return Object.prototype.toString.call(value) === '[object String]';
};

export const isArray = (value: any) => {
  return Array.isArray(value);
};

export const isInteger = (value: any) => {
  return Number.isInteger(value);
};

export const isNullObject = (value: any) => {
  return !value || (isObject(value) && Object.keys(value).length === 0);
};

/**
 * 生成按顺序不重复的整数
 * @returns
 */
export const createUniqueId = () => {
  let idCounter = 0;

  return (prefix = '') => {
    idCounter++;
    return `${prefix}${idCounter}`;
  };
};
