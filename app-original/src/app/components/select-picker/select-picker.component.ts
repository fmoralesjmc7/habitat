import {ApplicationRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { PickerController } from '@ionic/angular';

@Component({
  selector: 'app-select-picker',
  templateUrl: './select-picker.component.html',
  styleUrls: ['./select-picker.component.scss']
})
export class SelectPickerComponentCA implements OnInit {

  public picker: HTMLIonPickerElement;
  public placeholderPicker = 'Selecciona una opción';
  public isPlaceholder = true;
  @Input() public pickerOptions;
  @Output() public clickOption = new EventEmitter();

  constructor(private pickerController: PickerController,
              private ref: ApplicationRef) { }

  ngOnInit() {
    if (this.pickerOptions && this.pickerOptions.placeholder) {
      this.placeholderPicker = this.pickerOptions.placeholder;
    }
  }

  public async showPicker() {
    const options: any[] = [];
    this.pickerOptions.options.forEach((option) => {
      options.push({text: option.text, value: option.value});
    });
    this.picker = await this.pickerController.create({
      columns: [{
          name: 'options',
          options: options
      }],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Listo',
          handler: selected => this.changeOption(selected.options)
        }
      ]
    });
    await this.picker.present();
  }

  public changeOption(selectedOption) {
    this.placeholderPicker = selectedOption.text;
    this.clickOption.emit(selectedOption.value);
    this.isPlaceholder = false;
    this.ref.tick() //Se agrega para actualizar vista con datos modificados recientemente
  }

}
