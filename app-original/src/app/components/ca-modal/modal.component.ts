import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponentCA implements OnInit {

  constructor(public modalController: ModalController,
              public navParams: NavParams) { }

  ngOnInit() {
    //requerido
  }

  public closeModal() {
    this.modalController.dismiss();
  }

}
