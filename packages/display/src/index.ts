import baseManifest from '@tailor-cms/ce-single-choice-manifest';
import type { ElementManifest } from '@tailor-cms/ce-single-choice-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
