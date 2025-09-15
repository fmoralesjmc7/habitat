import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {

    constructor(
        private nav: NavController
    ) {}

    canLoad(): Promise<boolean> {
        return Preferences.get({ key : 'muestra-tutorial' }).then(res => {
            if (res.value === 'no') {
                this.nav.navigateRoot('SigninPage');
                return false;
            } else {
                return true;
            }
        });
    }
}
