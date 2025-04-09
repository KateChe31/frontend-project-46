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

  test('should compare files in plain format', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    const expectedPlain = `
  Property 'common.follow' was added with value: false
  Property 'common.setting2' was removed
  Property 'common.setting3' was updated. From true to null
  Property 'common.setting4' was added with value: 'blah blah'
  Property 'common.setting5' was added with value: [complex value]
  Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
  Property 'common.setting6.ops' was added with value: 'vops'
  Property 'group1.baz' was updated. From 'bas' to 'bars'
  Property 'group1.nest' was updated. From [complex value] to 'str'
  Property 'group2' was removed
  Property 'group3' was added with value: [complex value]
  `.trim();
    
    const data1 = parseFile(file1);
    const data2 = parseFile(file2);
    expect(genDiff(data1, data2, 'plain')).toEqual(expectedPlain);
  });
});
  