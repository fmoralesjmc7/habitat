import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class UtilService {
  setStorageData(key: string, value: string, isSecure: boolean): void {
    // Phase 2 minimal: only Preferences (non-secure)
    Preferences.set({ key, value });
  }

  async getStorageData(key: string, isSecure: boolean): Promise<string> {
    const value = (await Preferences.get({ key })).value;
    return value ?? '';
  }
}

