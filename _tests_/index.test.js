import { resolve } from 'path';
import genDiff from '../src/index.js';

const getFixturePath = (filename) => resolve(__dirname, '..', '__fixtures__', filename);

describe('genDiff', () => {
  const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

  test('should compare flat JSON files', () => {
    const file1 = getFixturePath('file1.json');
    const file2 = getFixturePath('file2.json');
    expect(genDiff(file1, file2)).toEqual(expected);
  });

  test('should compare flat YAML files', () => {
    const file1 = getFixturePath('file1.yml');
    const file2 = getFixturePath('file2.yml');
    expect(genDiff(file1, file2)).toEqual(expected);
  });
});
