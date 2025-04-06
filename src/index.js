import _ from 'lodash';

const buildDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));
  
  return keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    
    if (!_.has(data2, key)) {
      return { key, type: 'removed', value: value1 };
    }
    if (!_.has(data1, key)) {
      return { key, type: 'added', value: value2 };
    }
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return { key, type: 'nested', children: buildDiff(value1, value2) };
    }
    if (!_.isEqual(value1, value2)) {
      return {
        key,
        type: 'changed',
        value1,
        value2,
      };
    }
    return { key, type: 'unchanged', value: value1 };
  });
};

const formatStylish = (diff, depth = 1) => {
  const indent = ' '.repeat(4 * depth - 2);
  const lines = diff.flatMap((node) => {
    switch (node.type) {
      case 'added':
        return `${indent}+ ${node.key}: ${formatValue(node.value, depth)}`;
      case 'removed':
        return `${indent}- ${node.key}: ${formatValue(node.value, depth)}`;
      case 'changed':
        return [
          `${indent}- ${node.key}: ${formatValue(node.value1, depth)}`,
          `${indent}+ ${node.key}: ${formatValue(node.value2, depth)}`,
        ];
      case 'nested':
        return `${indent}  ${node.key}: ${formatStylish(node.children, depth + 1)}`;
      case 'unchanged':
        return `${indent}  ${node.key}: ${formatValue(node.value, depth)}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return `{\n${lines.join('\n')}\n${' '.repeat(4 * (depth - 1))}}`;
};

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(4 * depth);
    const lines = Object.entries(value).map(
      ([key, val]) => `${indent}  ${key}: ${formatValue(val, depth + 1)}`
    );
    return `{\n${lines.join('\n')}\n${' '.repeat(4 * depth)}}`;
  }
  return value;
};

const genDiff = (data1, data2, format = 'stylish') => {
  const diff = buildDiff(data1, data2);
  
  switch (format) {
    case 'stylish':
      return formatStylish(diff);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
};

export default genDiff;
