import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Certificado {

    private _tipo: string;
    private _codigoTipoCertificado: string;
    private _que_es : string;
    private _para_que_sirve: string;
    private _codigoCategoriaCertificado: string;
    private _categoriaAcordion: string;
    private _descripcionAcordion: string;
    private _descripcionTitulo: string;
    private _descripcionModal: string;

    constructor() {
        //requerido
    }



    get tipo(): string {
        return this._tipo;
    }

    set tipo(value: string) {
        this._tipo = value;
    }

    get codigoTipoCertificado(): string {
        return this._codigoTipoCertificado;
    }

    set codigoTipoCertificado(value: string) {
        this._codigoTipoCertificado = value;
    }

    get que_es(): string {
        return this._que_es;
    }

    set que_es(value: string) {
        this._que_es = value;
    }

    get para_que_sirve(): string {
        return this._para_que_sirve;
    }

    set para_que_sirve(value: string) {
        this._para_que_sirve = value;
    }

    get codigoCategoriaCertificado(): string {
        return this._codigoCategoriaCertificado;
    }

    set codigoCategoriaCertificado(value: string) {
        this._codigoCategoriaCertificado = value;
    }

    get categoriaAcordion(): string {
        return this._categoriaAcordion;
    }

    set categoriaAcordion(value: string) {
        this._categoriaAcordion = value;
    }
    
    get descripcionAcordion(): string {
        return this._descripcionAcordion;
    }

    set descripcionAcordion(value: string) {
        this._descripcionAcordion = value;
    }

    get descripcionTitulo(): string {
        return this._descripcionTitulo;
    }

    set descripcionTitulo(value: string) {
        this._descripcionTitulo = value;
    }

    get descripcionModal(): string{
        return this._descripcionModal;
    }

    set descripcionModal(value: string) {
        this._descripcionModal = value;
    }
}