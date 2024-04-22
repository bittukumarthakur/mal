const { MalType, MalNum, MalList, MalSymbol } = require('./types');

class Reader {
  #tokens;
  #position;
  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  next() {
    this.#position++;
    return this.#tokens[this.#position - 1];
  }

  peek() {
    return this.#tokens[this.#position];
  }
}

const tokenize = (expString) =>
  expString
    .replaceAll(',', ' ')
    .match(/[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g)
    .slice(0, -1)
    .map((value) => value.trim());

const readList = (reader) => {
  const list = [];
  reader.next();

  while (reader.peek() !== ')') {
    list.push(readForm(reader));
  }

  reader.next();
  return list;
};

const readAtom = (reader) => {
  const value = reader.next();
  const isUndefined = !value;
  if (isUndefined) {
    throw new Error('unbalanced');
  }

  const regexNumber = new RegExp('/d');
  if (/\d/.test(value)) {
    return new MalNum(value);
  }

  return new MalSymbol(value);
};

const readForm = (reader) => {
  const isLeftParam = reader.peek() === '(';

  if (isLeftParam) {
    return new MalList(readList(reader));
  }

  return readAtom(reader);
};

const readStr = (expString) => {
  const tokens = tokenize(expString);
    const reader = new Reader(tokens);

  return readForm(reader);
};

module.exports = { readStr };
