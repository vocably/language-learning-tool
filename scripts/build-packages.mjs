import 'zx/globals';
import { rootDir } from './helpers/dirs.mjs';

cd(rootDir);

const packages = [
  'jest',
  'sulna',
  'node-sulna',
  'model',
  'model-operations',
  'srs',
  'webpack',
  'crud',
  'api',
  'analyze',
  'extension-stay-alive',
  'extension-messages',
  'extension-service-worker',
  'extension-content-ui',
  'extension-content-script',
];

for (let packageName of packages) {
  console.log(`Building ${packageName}...`);
  await $`npm --prefix ./packages/${packageName} run build`;
}
