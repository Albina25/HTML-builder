const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdin, stdout } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const emitter = new EventEmitter();
emitter.on('start', () => console.log('Привет! Введите текст'));
emitter.emit('start');

const rl = readline.createInterface({ 
  input: stdin, 
});

process.on('SIGINT', () => {
  process.exit();
});

rl.on('line', (input) => {
  if (input ==='exit') {
    rl.close();
    process.exit();
  } else {
    output.write(input + '\n');
  }
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('Удачи! Пока!');
  } else {
    stderr.write(`Что-то пошло не так. Программа завершилась с кодом ${code}`);
  }
});