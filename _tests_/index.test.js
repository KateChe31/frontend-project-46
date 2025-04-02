import { readFileSync } from 'fs';
import { resolve } from 'path';
import genDiff from '../src/index.js';

const getFixturePath = (filename) => resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

describe('genDiff', () => {
  test('should compare flat JSON files', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    
    const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
    
    expect(genDiff(file1, file2)).toEqual(expected);
  });
});
