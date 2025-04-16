import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getFixturePath = (filename) => resolve(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => readFileSync(getFixturePath(filename), 'utf-8');

describe('genDiff', () => {
  const expectedStylish = readFile('expected-stylish.txt').trim();
  const expectedPlain = readFile('expected-plain.txt').trim();
  const expectedJson = readFile('expected-json.txt').trim();

  describe('Stylish format', () => {
    test('should compare nested JSON files', () => {
      const file1 = getFixturePath('file1.json');
      const file2 = getFixturePath('file2.json');
      expect(genDiff(file1, file2)).toEqual(expectedStylish);
    });

    test('should compare nested YAML files', () => {
      const file1 = getFixturePath('file1.yml');
      const file2 = getFixturePath('file2.yml');
      expect(genDiff(file1, file2)).toEqual(expectedStylish);
    });
  });

  describe('Plain format', () => {
    test('should compare files in plain format', () => {
      const file1 = getFixturePath('file1.json');
      const file2 = getFixturePath('file2.json');
      expect(genDiff(file1, file2, 'plain')).toEqual(expectedPlain);
    });

    test('should work with YAML files in plain format', () => {
      const file1 = getFixturePath('file1.yml');
      const file2 = getFixturePath('file2.yml');
      expect(genDiff(file1, file2, 'plain')).toEqual(expectedPlain);
    });
  });

  describe('JSON format', () => {
    test('should format diff as valid JSON', () => {
      const file1 = getFixturePath('file1.json');
      const file2 = getFixturePath('file2.json');
      const result = genDiff(file1, file2, 'json');

      expect(() => JSON.parse(result)).not.toThrow();
      expect(result).toEqual(expectedJson);
    });

    test('should contain all diff information in JSON', () => {
      const file1 = getFixturePath('file1.json');
      const file2 = getFixturePath('file2.json');
      const result = JSON.parse(genDiff(file1, file2, 'json'));

      expect(result).toBeInstanceOf(Array);

      const commonNode = result.find((node) => node.key === 'common');
      expect(commonNode.type).toBe('nested');
      expect(commonNode.children).toContainEqual({
        key: 'follow',
        type: 'added',
        value: false,
      });

      expect(commonNode.children).toContainEqual({
        key: 'setting3',
        type: 'changed',
        oldValue: true,
        newValue: null,
      });

      const setting6Node = commonNode.children.find((child) => child.key === 'setting6');
      expect(setting6Node.children).toContainEqual({
        key: 'ops',
        type: 'added',
        value: 'vops',
      });
    });

    test('should work with YAML files in JSON format', () => {
      const file1 = getFixturePath('file1.yml');
      const file2 = getFixturePath('file2.yml');
      const result = genDiff(file1, file2, 'json');

      expect(() => JSON.parse(result)).not.toThrow();
      const parsed = JSON.parse(result);
      expect(parsed).toBeInstanceOf(Array);
    });
  });

  test('debug yaml parsing', () => {
    const yamlContent = readFileSync(getFixturePath('file1.yml'), 'utf-8');
    expect(yamlContent).toContain('common');
    expect(yamlContent).toContain('group1');
  });
});
