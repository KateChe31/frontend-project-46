import _ from 'lodash';

const buildIndent = (depth) => '    '.repeat(depth);

const stringify = (value, depth) => {
  if (!_.isPlainObject(value)) {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return String(value);
    return value;
  }

  const indent = buildIndent(depth + 1);
  const lines = Object.entries(value).map(
    ([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`
  );
  return `{\n${lines.join('\n')}\n${buildIndent(depth)}}`;
};

const formatStylish = (diff, depth = 0) => {
  const indent = buildIndent(depth);
  const lines = diff.map((node) => {
    const makeLine = (sign, key, value) => 
      `${indent}  ${sign} ${key}: ${stringify(value, depth + 1)}`;

    switch (node.type) {
      case 'added':
        return makeLine('+', node.key, node.value);
      case 'removed':
        return makeLine('-', node.key, node.value);
      case 'changed':
        return [
          makeLine('-', node.key, node.value1),
          makeLine('+', node.key, node.value2)
        ];
      case 'nested':
        return `${indent}    ${node.key}: {\n${formatStylish(node.children, depth + 1)}\n${indent}    }`;
      case 'unchanged':
        return `${indent}    ${node.key}: ${stringify(node.value, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return depth === 0 ? `{\n${lines.flat().join('\n')}\n}` : lines.flat().join('\n');
};

export default formatStylish;
