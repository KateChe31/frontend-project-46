const formatJson = (diff) => {
  const formatNode = (node) => {
    const { key, type } = node;
    const base = { key, type };

    switch (type) {
      case 'added':
        return { ...base, value: node.value };
      case 'removed':
        return { ...base, value: node.value };
      case 'changed':
        return { ...base, oldValue: node.value1, newValue: node.value2 };
      case 'nested':
        return { ...base, children: node.children.map(formatNode) };
      case 'unchanged':
        return { ...base, value: node.value };
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  return JSON.stringify(diff.map(formatNode), null, 2);
};

export default formatJson;
