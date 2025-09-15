import { WebPlugin } from '@capacitor/core';

import type { AntiJailPlugin } from './definitions';

export class AntiJailWeb extends WebPlugin implements AntiJailPlugin {
  async validate(): Promise<{ status: boolean; detalle: string; }> {
    return {"status":true,"detalle":"OK"};
  };
}
