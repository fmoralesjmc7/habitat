import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-exito-desuscripcion',
  templateUrl: './exito-desuscripcion.page.html',
  styleUrls: ['./exito-desuscripcion.page.scss']
})
export class ExitoDesuscripcionPage implements OnInit {

  @Output() cerrarModal: EventEmitter<void> = new EventEmitter();

  constructor() { 
    //requerido
  }

  ngOnInit(): void {
    //requerido
  }

  onCerrarModal(): void {
    this.cerrarModal.emit();
  }

}
