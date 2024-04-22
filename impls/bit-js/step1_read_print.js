const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { readStr } = require('./reader');
const { prStr } = require('./printer');

const rl = readline.createInterface({ input, output });
const READ = (value) => readStr(value);
const EVAL = (value) => value;
const PRINT = (values) => prStr(values);

const repl = () =>
  rl.question('user> ', (expString) => {
    try {
      PRINT(EVAL(READ(expString)));
    } catch (error) {
      console.log(error);
    }

    repl();
  });

repl();
