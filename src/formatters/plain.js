const formatValue = (value) => {
  if (typeof value === 'object' && value !== null) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return String(value);
};

const buildPlainLines = (diff, parentPath = '') => {
  return diff.flatMap((node) => {
    const currentPath = parentPath ? `${parentPath}.${node.key}` : node.key;
    
    switch (node.type) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${formatValue(node.value)}`;
      case 'removed':
        return `Property '${currentPath}' was removed`;
      case 'changed':
        return `Property '${currentPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`;
      case 'nested':
        return buildPlainLines(node.children, currentPath);
      case 'unchanged':
        return [];
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }).join('\n');
};

export default (diff) => buildPlainLines(diff);
