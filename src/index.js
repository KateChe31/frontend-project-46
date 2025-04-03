import _ from 'lodash';

const genDiff = (data1, data2) => {
  const keys = _.sortBy(_.union(Object.keys(data1), Object.keys(data2)));

  const diffLines = keys.flatMap((key) => {
    const hasInFirst = _.has(data1, key);
    const hasInSecond = _.has(data2, key);

    if (!hasInSecond) {
      return `  - ${key}: ${data1[key]}`;
    }
    if (!hasInFirst) {
      return `  + ${key}: ${data2[key]}`;
    }
    if (data1[key] !== data2[key]) {
      return [
        `  - ${key}: ${data1[key]}`,
        `  + ${key}: ${data2[key]}`,
      ];
    }
    return `    ${key}: ${data1[key]}`;
  });

  return `{\n${diffLines.join('\n')}\n}`;
};

export default genDiff;
