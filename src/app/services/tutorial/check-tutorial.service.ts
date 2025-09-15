import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class CheckTutorial implements CanLoad {
  constructor(private router: Router) {}

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    const res = await Preferences.get({ key: 'muestra-tutorial' });
    if (res.value === 'no') {
      this.router.navigateByUrl('/home', { replaceUrl: true });
      return false;
    }
    return true;
  }
}

