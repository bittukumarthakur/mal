const { MalType, MalNum, MalList, MalSymbol, MalVector, MalHashMap } = require('./types');

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

const readSeq = (reader, closingBracket) => {
  const ast = [];
  reader.next();

  while (reader.peek() !== closingBracket) {
    ast.push(readForm(reader));
  }

  reader.next();
  return ast;
};

const readVector = (reader) => {
  return readSeq(reader, ']');
};

const readList = (reader) => {
  return readSeq(reader, ')');
};

const readHashMap = (reader) => {
  return readSeq(reader, '}');
};

const readAtom = (reader) => {
  const value = reader.next();
  const isUndefined = !value;
  const isNumber = /\d/.test(value);

  switch (true) {
    case isUndefined:
      throw new Error('unbalanced');

    case isNumber:
      return new MalNum(parseInt(value));

    default:
      return new MalSymbol(value);
  }
};

const readForm = (reader) => {
  switch (true) {
    case reader.peek() === '(':
      return new MalList(readList(reader));

    case reader.peek() === '[':
      return new MalVector(readVector(reader));

    case reader.peek() === '{':
      return new MalHashMap(readHashMap(reader));

    default:
      return readAtom(reader);
  }
};

const readStr = (expString) => {
  const tokens = tokenize(expString);
  const reader = new Reader(tokens);

  return readForm(reader);
};

module.exports = { readStr };
