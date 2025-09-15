import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SolicitudCuentaPlanAhorro {

    //JVARGAS REVISAR INICIALIZACIÓN
    //plan
    private _id_tipo_fondo: number = 0;
    private _nombre_tipo_fondo: string = '';
    private _id_regimen: number = 0;
    private _nombre_regimen: string = '';
    private _id_tipo_moneda: number = 0;
    private _nombre_tipo_moneda: string = '';
    private _montoSeleccionado: string = '';

    private _fondoSeleccionado = {
        id_tipo_fondo: this._id_tipo_fondo,
        nombre_tipo_fondo: this._nombre_tipo_fondo
    };

    private _regimenSeleccionado = {
        id_regimen: this._id_regimen,
        nombre_regimen: this._nombre_regimen
    };
    private _tipoSeleccionado = {
        id_tipo_moneda: this._id_tipo_moneda,
        nombre_tipo_moneda: this._nombre_tipo_moneda
    };

    private _primerDescuento: Date;
    private _fechaIndefinida: boolean = true;
    private _mesSeleccionado: number = 0;
    private _anioSeleccionado: number = 0;
    private _autorizacionEmpleador: boolean = false;

    //trabajo
    private _id_cargo: number = 0;
    private _nombre_cargo: string = '';

    private _cargoSeleccionado = {
        id_cargo: this._id_cargo,
        nombre_cargo: this._nombre_cargo
    };

    private _rentaImponible: string;

    //empleador
    private _id_mae_empleador: number = 0;
    private _razon_social: string = '';

    private _empleadorSeleccionado = {
        id_mae_empleador: this._id_mae_empleador,
        razon_social: this._razon_social
    };

    private _id_region: number = 0;
    private _nombre_region: string = '';
    private _id_comuna: number = 0;
    private _nombre_comuna: string = '';

    private _id_ciudad: string = '';
    private _nombre_ciudad: string = '';


    private _regionSeleccionada = {
        id_region: this._id_region,
        nombre_region: this._nombre_region
    };

    private _comunaSeleccionada = {
        id_comuna: this._id_comuna,
        nombre_comuna: this._nombre_comuna
    };

    private _ciudadSeleccionada = {
        id_ciudad: this._id_ciudad,
        nombre_ciudad: this._nombre_ciudad
    };

    private _calle: string;
    private _numero: string;
    private _oficina: string;
    private _correo: string;

    //Variables para envio
    private _rutEmpleador: string;
    private _dvEmpleador: string;
    private _idTipoTrabajador: string;
    private _codigoPostal: string;

    //Variables Step2
    private _aceptaMandato: boolean = true;
    private _declaraMandato: boolean = false;


    constructor() {
        //requerido
    }


    get id_tipo_fondo(): number {
        return this._id_tipo_fondo;
    }

    set id_tipo_fondo(value: number) {
        this._id_tipo_fondo = value;
    }

    get nombre_tipo_fondo(): string {
        return this._nombre_tipo_fondo;
    }

    set nombre_tipo_fondo(value: string) {
        this._nombre_tipo_fondo = value;
    }

    get fondoSeleccionado(): { nombre_tipo_fondo: string; id_tipo_fondo: number } {
        return this._fondoSeleccionado;
    }

    set fondoSeleccionado(value: { nombre_tipo_fondo: string; id_tipo_fondo: number }) {
        this._fondoSeleccionado = value;
    }

    get id_regimen(): number {
        return this._id_regimen;
    }

    set id_regimen(value: number) {
        this._id_regimen = value;
    }

    get nombre_regimen(): string {
        return this._nombre_regimen;
    }

    set nombre_regimen(value: string) {
        this._nombre_regimen = value;
    }

    get id_tipo_moneda(): number {
        return this._id_tipo_moneda;
    }

    set id_tipo_moneda(value: number) {
        this._id_tipo_moneda = value;
    }

    get nombre_tipo_moneda(): string {
        return this._nombre_tipo_moneda;
    }

    set nombre_tipo_moneda(value: string) {
        this._nombre_tipo_moneda = value;
    }

    get montoSeleccionado(): string {
        return this._montoSeleccionado;
    }

    set montoSeleccionado(value: string) {
        this._montoSeleccionado = value;
    }



    get regimenSeleccionado(): { nombre_regimen: string; id_regimen: number } {
        return this._regimenSeleccionado;
    }

    set regimenSeleccionado(value: { nombre_regimen: string; id_regimen: number }) {
        this._regimenSeleccionado = value;
    }

    get tipoSeleccionado(): { id_tipo_moneda: number; nombre_tipo_moneda: string } {
        return this._tipoSeleccionado;
    }

    set tipoSeleccionado(value: { id_tipo_moneda: number; nombre_tipo_moneda: string }) {
        this._tipoSeleccionado = value;
    }

    get primerDescuento(): Date {
        return this._primerDescuento;
    }

    set primerDescuento(value: Date) {
        this._primerDescuento = value;
    }

    get fechaIndefinida(): boolean {
        return this._fechaIndefinida;
    }

    set fechaIndefinida(value: boolean) {
        this._fechaIndefinida = value;
    }

    get mesSeleccionado(): number {
        return this._mesSeleccionado;
    }

    set mesSeleccionado(value: number) {
        this._mesSeleccionado = value;
    }

    get anioSeleccionado(): number {
        return this._anioSeleccionado;
    }

    set anioSeleccionado(value: number) {
        this._anioSeleccionado = value;
    }

    get autorizacionEmpleador(): boolean {
        return this._autorizacionEmpleador;
    }

    set autorizacionEmpleador(value: boolean) {
        this._autorizacionEmpleador = value;
    }

    get id_cargo(): number {
        return this._id_cargo;
    }

    set id_cargo(value: number) {
        this._id_cargo = value;
    }

    get nombre_cargo(): string {
        return this._nombre_cargo;
    }

    set nombre_cargo(value: string) {
        this._nombre_cargo = value;
    }

    get cargoSeleccionado(): { nombre_cargo: string; id_cargo: number } {
        return this._cargoSeleccionado;
    }

    set cargoSeleccionado(value: { nombre_cargo: string; id_cargo: number }) {
        this._cargoSeleccionado = value;
    }

    get rentaImponible(): string {
        return this._rentaImponible;
    }

    set rentaImponible(value: string) {
        this._rentaImponible = value;
    }

    get id_mae_empleador(): number {
        return this._id_mae_empleador;
    }

    set id_mae_empleador(value: number) {
        this._id_mae_empleador = value;
    }

    get razon_social(): string {
        return this._razon_social;
    }

    set razon_social(value: string) {
        this._razon_social = value;
    }

    get empleadorSeleccionado(): { razon_social: string; id_mae_empleador: number } {
        return this._empleadorSeleccionado;
    }

    set empleadorSeleccionado(value: { razon_social: string; id_mae_empleador: number }) {
        this._empleadorSeleccionado = value;
    }

    get id_region(): number {
        return this._id_region;
    }

    set id_region(value: number) {
        this._id_region = value;
    }

    get nombre_region(): string {
        return this._nombre_region;
    }

    set nombre_region(value: string) {
        this._nombre_region = value;
    }

    get id_comuna(): number {
        return this._id_comuna;
    }

    set id_comuna(value: number) {
        this._id_comuna = value;
    }

    get nombre_comuna(): string {
        return this._nombre_comuna;
    }

    set nombre_comuna(value: string) {
        this._nombre_comuna = value;
    }

    get regionSeleccionada(): { nombre_region: string; id_region: number } {
        return this._regionSeleccionada;
    }

    set regionSeleccionada(value: { nombre_region: string; id_region: number }) {
        this._regionSeleccionada = value;
    }

    get comunaSeleccionada(): { id_comuna: number; nombre_comuna: string } {
        return this._comunaSeleccionada;
    }

    set comunaSeleccionada(value: { id_comuna: number; nombre_comuna: string }) {
        this._comunaSeleccionada = value;
    }

    get calle(): string {
        return this._calle;
    }

    set calle(value: string) {
        this._calle = value;
    }

    get numero(): string {
        return this._numero;
    }

    set numero(value: string) {
        this._numero = value;
    }

    get oficina(): string {
        return this._oficina;
    }

    set oficina(value: string) {
        this._oficina = value;
    }

    get correo(): string {
        return this._correo;
    }

    set correo(value: string) {
        this._correo = value;
    }

    get aceptaMandato(): boolean {
        return this._aceptaMandato;
    }

    set aceptaMandato(value: boolean) {
        this._aceptaMandato = value;
    }

    get declaraMandato(): boolean {
        return this._declaraMandato;
    }

    set declaraMandato(value: boolean) {
        this._declaraMandato = value;
    }


    get rutEmpleador(): string {
        return this._rutEmpleador;
    }

    set rutEmpleador(value: string) {
        this._rutEmpleador = value;
    }

    get dvEmpleador(): string {
        return this._dvEmpleador;
    }

    set dvEmpleador(value: string) {
        this._dvEmpleador = value;
    }

    get idTipoTrabajador(): string {
        return this._idTipoTrabajador;
    }

    set idTipoTrabajador(value: string) {
        this._idTipoTrabajador = value;
    }


    get id_ciudad(): string {
        return this._id_ciudad;
    }

    set id_ciudad(value: string) {
        this._id_ciudad = value;
    }

    get nombre_ciudad(): string {
        return this._nombre_ciudad;
    }

    set nombre_ciudad(value: string) {
        this._nombre_ciudad = value;
    }

    get ciudadSeleccionada(): { nombre_ciudad: string; id_ciudad: string } {
        return this._ciudadSeleccionada;
    }

    set ciudadSeleccionada(value: { nombre_ciudad: string; id_ciudad: string }) {
        this._ciudadSeleccionada = value;
    }

    get codigoPostal(): string {
        return this._codigoPostal;
    }

    set codigoPostal(value: string) {
        this._codigoPostal = value;
    }
}