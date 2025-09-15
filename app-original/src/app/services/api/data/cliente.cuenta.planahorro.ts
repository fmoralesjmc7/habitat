import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CuentaPlanAhorro {

    private _id: number;
    private _nombre:string;
    private _estado: string;
    private _indefinido: boolean;
    private _expandible:boolean = false;
    private _ahorro:string;
    private _fechaInicio:string;
    private _fechaTermino:string;
    private _fondoDestino:string;
    private _regimen:string;
    private _tipo: string;
    private _tipo_moneda: string;
    private _empleador = {
        nombre: '',
        rut:''
    };


    constructor() {
        //requerido
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get nombre(): string {
        return this._nombre;
    }

    set nombre(value: string) {
        this._nombre = value;
    }

    get expandible(): boolean {
        return this._expandible;
    }

    set expandible(value: boolean) {
        this._expandible = value;
    }

    get ahorro(): string {
        return this._ahorro;
    }

    set ahorro(value: string) {
        this._ahorro = value;
    }

    get fechaInicio(): string {
        return this._fechaInicio;
    }

    set fechaInicio(value: string) {
        this._fechaInicio = value;
    }

    get fechaTermino(): string {
        return this._fechaTermino;
    }

    set fechaTermino(value: string) {
        this._fechaTermino = value;
    }

    get fondoDestino(): string {
        return this._fondoDestino;
    }

    set fondoDestino(value: string) {
        this._fondoDestino = value;
    }

    get regimen(): string {
        return this._regimen;
    }

    set regimen(value: string) {
        this._regimen = value;
    }


    get estado(): string {
        return this._estado;
    }

    set estado(value: string) {
        this._estado = value;
    }

    get empleador(): { rut: string; nombre: string } {
        return this._empleador;
    }

    set empleador(value: { rut: string; nombre: string }) {
        this._empleador = value;
    }


    get indefinido(): boolean {
        return this._indefinido;
    }

    set indefinido(value: boolean) {
        this._indefinido = value;
    }


    get tipo(): string {
        return this._tipo;
    }

    set tipo(value: string) {
        this._tipo = value;
    }


    get tipo_moneda(): string {
        return this._tipo_moneda;
    }

    set tipo_moneda(value: string) {
        this._tipo_moneda = value;
    }
}