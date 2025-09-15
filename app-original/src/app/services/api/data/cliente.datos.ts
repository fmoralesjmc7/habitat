import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClienteDatos {

  // JVARGAS Revisar asignacion de nulos
  public nombre = new BehaviorSubject<string>('');
  public apellidoPaterno = new BehaviorSubject<string>('');
  public apellidoMaterno = new BehaviorSubject<string>('');
  public esCliente = new BehaviorSubject<boolean>(false);
  public email = new BehaviorSubject<string>('');
  public rut = new BehaviorSubject<number>(0);
  public dv = new BehaviorSubject<string>('');
  public apodo = new BehaviorSubject<string>('');
  public sexo = new BehaviorSubject<string>('');
  public fechaAfiliacion = new BehaviorSubject<string>('');
  public fechaIncorporacion = new BehaviorSubject<string>('');
  public idPersona = new BehaviorSubject<number>(0);
  public edad = new BehaviorSubject<number>(0);
  public esPensionado = new BehaviorSubject<boolean>(false);
  public poseeConsultor = new BehaviorSubject<string>('');
  public huellaActiva = new BehaviorSubject<boolean>(false);
  public loginHibrido = new BehaviorSubject<boolean>(false);
  public telefonoCelular = new BehaviorSubject<string>('');

  constructor() {
    //requerido
  }

  public setNombre(nombre: string) {
    this.nombre.next(nombre);
  }

  public setApellidoPaterno(apellidoPaterno: string) {
    this.apellidoPaterno.next(apellidoPaterno);
  }

  public setApellidoMaterno(apellidoMaterno: string) {
    this.apellidoMaterno.next(apellidoMaterno);
  }

  public setEsCliente(esCliente: boolean) {
    this.esCliente.next(esCliente);
  }

  public setEmail(email: string) {
    this.email.next(email);
  }

  public setRut(rut: number) {
    this.rut.next(rut);
  }

  public setDv(dv: string) {
    this.dv.next(dv);
  }

  public setApodo(apodo: string) {
    this.apodo.next(apodo);
  }

  public setSexo(sexo: string) {
    this.sexo.next(sexo);
  }

  public setFechaAfiliacion(fechaAfiliacion: string) {
    this.fechaAfiliacion.next(fechaAfiliacion);
  }

  public setFechaIncorporacion(fechaIncorporacion: string) {
    this.fechaIncorporacion.next(fechaIncorporacion);
  }

  public setIdPersona(idPersona: number) {
    this.idPersona.next(idPersona);
  }

  public setEdad(edad: number) {
    this.edad.next(edad);
  }

  public setEsPensionado(esPensionado: boolean) {
    this.esPensionado.next(esPensionado);
  }

  public setPoseeConsultor(poseeConsultor: string) {
    this.poseeConsultor.next(poseeConsultor);
  }

  public setHuellaActiva(huellaActiva: boolean) {
    this.huellaActiva.next(huellaActiva);
  }

  public setTelefonoCelular(telefonoCelular: string){
    this.telefonoCelular.next(telefonoCelular);
  }

  public limpiarDatos() {
    this.nombre.next('');
    this.apellidoPaterno.next('');
    this.apellidoMaterno.next('');
    this.esCliente.next(false);
    this.email.next('');
    this.rut.next(0);
    this.dv.next('');
    this.apodo.next('');
    this.sexo.next('');
    this.fechaAfiliacion.next('');
    this.fechaIncorporacion.next('');
    this.idPersona.next(0);
    this.edad.next(0);
    this.esPensionado.next(false);
    this.poseeConsultor.next('');
    this.huellaActiva.next(false);
    this.loginHibrido.next(false);
    this.telefonoCelular.next('');
  }
}