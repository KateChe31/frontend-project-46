#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'path';
import parseFile from '../parsers.js';
import genDiff from '../src/index.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    try {
      const absolutePath1 = resolve(process.cwd(), filepath1);
      const absolutePath2 = resolve(process.cwd(), filepath2);

      const data1 = parseFile(absolutePath1);
      const data2 = parseFile(absolutePath2);

      const diff = genDiff(data1, data2);
      console.log(diff);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
