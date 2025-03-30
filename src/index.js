const genDiff = (data1, data2) => {
    const keys = new Set([...Object.keys(data1), ...Object.keys(data2)]);
    const diffLines = [];
  
    keys.forEach(key => {
      if (!(key in data1)) {
        diffLines.push(`+ ${key}: ${data2[key]}`);
      } else if (!(key in data2)) {
        diffLines.push(`- ${key}: ${data1[key]}`);
      } else if (data1[key] !== data2[key]) {
        diffLines.push(`- ${key}: ${data1[key]}`);
        diffLines.push(`+ ${key}: ${data2[key]}`);
      } else {
        diffLines.push(`  ${key}: ${data1[key]}`);
      }
    });
  
    return diffLines.join('\n');
  };
  
  export default genDiff;
  