const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });
const READ = (value) => value
const EVAL = (value) => value
const PRINT = (value) => value

const repl = () => rl.question("user> ", (expStrig) => {
  console.log(PRINT(EVAL(READ(expStrig))));
  repl()
});

repl();