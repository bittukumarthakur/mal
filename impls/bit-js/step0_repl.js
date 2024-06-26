const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const READ = (value) => value;
const EVAL = (value) => value;
const PRINT = (value) => value;

const repl = () =>
  rl.question('user> ', (expString) => {
    console.log(PRINT(EVAL(READ(expString))));
    repl();
  });

repl();
