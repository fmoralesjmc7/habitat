import { registerPlugin } from '@capacitor/core';

import type { AntiJailPlugin } from './definitions';

const AntiJail = registerPlugin<AntiJailPlugin>('AntiJail', {
  web: () => import('./web').then(m => new m.AntiJailWeb()),
});

export * from './definitions';
export { AntiJail };
