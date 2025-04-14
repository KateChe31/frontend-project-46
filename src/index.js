import { resolve } from 'path';
import parseFile from './parsers.js';
import getFormatter from './formatters/index.js';
import buildDiff from './buildDiff.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const absolutePath1 = resolve(process.cwd(), filepath1);
  const absolutePath2 = resolve(process.cwd(), filepath2);

  const data1 = parseFile(absolutePath1);
  const data2 = parseFile(absolutePath2);

  const diff = buildDiff(data1, data2);
  const format = getFormatter(formatName);
  return format(diff);
};

export default genDiff;
