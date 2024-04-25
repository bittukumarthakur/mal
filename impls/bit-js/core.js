const { prStr } = require('./printer');
const { MalNum, MalBoolean, MalList, MalNil, MalString } = require('./types');
const { isEqual } = require('lodash');

const coreFn = {
  '+': (a, b) => new MalNum(a.value + b.value),
  '-': (a, b) => new MalNum(a.value - b.value),
  '*': (a, b) => new MalNum(a.value * b.value),
  '/': (a, b) => new MalNum(a.value / b.value),
  '=': (a, b) => new MalBoolean(isEqual(a.value, b.value)),
  '>': (a, b) => new MalBoolean(a.value > b.value),
  '<': (a, b) => new MalBoolean(a.value < b.value),
  '>=': (a, b) => new MalBoolean(a.value >= b.value),
  '<=': (a, b) => new MalBoolean(a.value <= b.value),
  count: (list) => new MalNum(list.value.length),
  list: (...list) => new MalList(list),
  'empty?': (list) => new MalBoolean(list.value.length === 0),
  'list?': (list) => new MalBoolean(list instanceof MalList),
  not: (a) => new MalBoolean(a.value === false || a.value === 'nil'),
  str: (...string) => {
    const line = string.map((a) => a.value).join(' ');
    return new MalString(`"${line}"`);
  },
  prn: (...list) => {
    prStr(...list);
    return new MalNil();
  },
};

module.exports = { coreFn };
