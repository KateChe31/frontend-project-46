import stylish from './stylish.js';
import plain from './plain.js';

const formatters = {
  stylish,
  plain,
};

export default (format) => {
  if (!formatters[format]) {
    throw new Error(`Unknown format: ${format}`);
  }
  return formatters[format];
};
