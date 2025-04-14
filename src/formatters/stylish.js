import _ from 'lodash';

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(4 * depth);
    const lines = Object.entries(value).map(
      ([key, val]) => `${indent}  ${key}: ${formatValue(val, depth + 1)}`,
    );
    return `{\n${lines.join('\n')}\n${' '.repeat(4 * depth)}}`;
  }
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
};

const formatStylish = (diff, depth = 1) => {
  const indent = '    '.repeat(depth - 1);
  const lines = diff.flatMap((node) => {
    switch (node.type) {
      case 'added':
        return `${indent}  + ${node.key}: ${formatValue(node.value, depth + 1)}`;
      case 'removed':
        return `${indent}  - ${node.key}: ${formatValue(node.value, depth + 1)}`;
      case 'changed':
        return [
          `${indent}  - ${node.key}: ${formatValue(node.value1, depth + 1)}`,
          `${indent}  + ${node.key}: ${formatValue(node.value2, depth + 1)}`,
        ];
      case 'nested':
        return `${indent}    ${node.key}: ${formatStylish(node.children, depth + 1)}`;
      case 'unchanged':
        return `${indent}    ${node.key}: ${formatValue(node.value, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });
  return `{\n${lines.join('\n')}\n${indent}}`;
};

export default formatStylish;
