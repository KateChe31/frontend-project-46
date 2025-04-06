import { readFileSync } from 'fs';
import { resolve } from 'path';
import genDiff from '../src/index.js';
import parseFile from '../parsers.js';

const getFixturePath = (filename) => resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

describe('genDiff', () => {
  const expectedStylish = readFile('expected-stylish.txt').trim();

  test('should compare nested JSON files', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const data1 = parseFile(file1);
    const data2 = parseFile(file2);
    expect(genDiff(data1, data2)).toEqual(expectedStylish);
  });

  test('should compare nested YAML files', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');
    const data1 = parseFile(file1);
    const data2 = parseFile(file2);
    expect(genDiff(data1, data2)).toEqual(expectedStylish);
  });
});

  