import { extname } from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

const parseJson = (content) => JSON.parse(content);
const parseYaml = (content) => yaml.load(content);

const parsers = {
  '.json': parseJson,
  '.yaml': parseYaml,
  '.yml': parseYaml,
};

const parseFile = (filepath) => {
  const ext = extname(filepath).toLowerCase();
  const parse = parsers[ext];

  if (!parse) {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  const content = fs.readFileSync(filepath, 'utf-8');
  return parse(content);
};

export default parseFile;
