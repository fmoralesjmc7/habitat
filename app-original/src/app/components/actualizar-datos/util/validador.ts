import { Injectable } from '@angular/core';
import { DatosActualizarUsuario } from '../../../../../src/app/pages/actualizar-datos/util/datos.actualizar.usuario';
import { CONSTANTES_ACTUALIZAR_DATOS } from '../../../../../src/app/pages/actualizar-datos/util/datos.constantes';
import { UtilService } from '../../../../../src/app/services';

@Injectable({
    providedIn: 'root'
})
/**
 * Clase utilizada para validar datos de usuario.
 */
export class ValidadorActualizarDatos {

    /**
     * Datos usuario
     */
    datosUsuario: DatosActualizarUsuario;

    /**
     * Constantes de la aplicación
     */
    readonly CONSTANTES = CONSTANTES_ACTUALIZAR_DATOS;

    /**
     * Codigo para validar sin dato de residencia (190)
     */
    codigoSinInformacionPais = this.CONSTANTES.ID_COD_PAIS_SIN_RECIDENCIA;

    /**
     * Codigo para validar sin dato de ciudad (303)
     */
    codigoSinInformacionCiudad = this.CONSTANTES.ID_COD_SIN_CIUDAD;

    /**
     * Codigo dato vacío (this.datoVacio)
     */
    datoVacio = this.CONSTANTES.TIPO_SUSC_VACIA;

    constructor(datosUsuario: DatosActualizarUsuario,
        public utilService: UtilService) {
        this.datosUsuario = datosUsuario;
    }

    /**
     * Metodo encargado de validar correo Particular
     * 
     * @returns true si es Invalido, false si es valido
     */
    validadorCorreoParticular(): boolean {
        let correoInvalido = false;

        // Se valida si el correo esta vacío
        if (this.datosUsuario.correoParticular.correo === "" || !this.datosUsuario.correoParticular.correo) {
            correoInvalido = true;
        }

        // Validaciones de correo si el usuario ingresa texto.
        if (!correoInvalido && !this.validarRegexEmail(this.datosUsuario.correoParticular.correo as string)) {
            correoInvalido = true;
        }

        return correoInvalido;
    }

    /**
     * Metodo encargado de validar correo Comercial
     * 
     * @returns true si es Invalido, false si es valido
     */
    validadorCorreoComercial(): boolean {
        let correoInvalido = false;

        // Se valida que exista correo si marco suscripción correo comercial
        if (this.datosUsuario.esSuscripcionCorreoComercial && (this.datosUsuario.correoComercial.correo === "" || !this.datosUsuario.correoComercial.correo)) {
            correoInvalido = true;
        }

        // Se valida el correo en caso de que este ingresado en el campo
        if (this.datosUsuario.correoComercial.correo && this.datosUsuario.correoComercial.correo !== "") {
            if (!this.validarRegexEmail(this.datosUsuario.correoComercial.correo as string)) {
                correoInvalido = true;
            }
        }

        return correoInvalido;
    }

    /**
     * Metodo encargado de validar codigo de area telefono
     * 
     * @param telefono a validar
     * @param listadoCodigosArea para validar que exista
     * @returns true si es Invalido, false si es valido
     */
    validadorCodigoArea(telefono: any, listadoCodigosArea: any): boolean {
        let codigoAreaInvalido = false;

        if ((telefono.numero_telefono && telefono.numero_telefono !== "")) {
            if (!telefono.codigo_area || telefono.codigo_area === "") {
                codigoAreaInvalido = true;
            } else {
                //Se valida que el codigo de area se encuentre en el arreglo
                const encuentraCodArea = listadoCodigosArea.find(x => x.codigo === telefono.codigo_area);

                if (encuentraCodArea === null || encuentraCodArea === undefined) {
                    codigoAreaInvalido = true;
                }
            }
        }

        return codigoAreaInvalido;
    }

    /**
     * Metodo encargado de validar telefono
     * 
     * @telefono a validar
     * @returns true si es Invalido, false si es valido
     */
    validadorTelefono(telefono: any): boolean {
        let telefonoInvalido = false;

        if (telefono.numero_telefono && telefono.numero_telefono !== "") {
            if (telefono.numero_telefono.length < this.CONSTANTES.MIN_NUMERO_TELEFONO
                || telefono.numero_telefono.length > this.CONSTANTES.MAX_NUMERO_TELEFONO) {
                telefonoInvalido = true;
            }
        }

        return telefonoInvalido;
    }

    /**
     * Metodo encargado de validar celular
     * 
     * @returns true si es Invalido, false si es valido
     */
    validadorCelular(): boolean {
        let celularInvalido = false;

        if (!this.datosUsuario.celularUsuario.numero_telefono ||
            this.datosUsuario.celularUsuario.numero_telefono.length < this.CONSTANTES.DIGITOS_NUMERO_CELULAR ||
            this.datosUsuario.celularUsuario.numero_telefono.length > this.CONSTANTES.DIGITOS_NUMERO_CELULAR) {
            celularInvalido = true;
        }

        return celularInvalido;
    }

    /**
     * Valida calle ingresada 
     * 
     * @param direccionSeleccionada 
     * @returns true calle Invalida, false calle Valida
     */
    validarCalle(direccionSeleccionada: any): boolean {
        let calleInvalida = false;

        if (!direccionSeleccionada.calle || direccionSeleccionada.calle === "") {
            calleInvalida = true;
        }

        return calleInvalida;
    }

    /**
     * Valida numero de la dirección
     * 
     * @param direccionSeleccionada 
     * @returns true numero Invalido, false numero valido.
     */
    validarNumero(direccionSeleccionada: any): boolean {
        let numeroInvalida = false;

        if (!direccionSeleccionada.numero || direccionSeleccionada.numero === "") {
            numeroInvalida = true;
        }

        return numeroInvalida;
    }

    /**
     * Valida nacionalidad
     * 
     * @param nacionalidadSeleccionada por el usuario
     * @param listadoNacionalidad a validar
     * @returns true si es Invalida, false si es valida
     */
    validarNacionalidad(nacionalidadSeleccionada: any, listadoNacionalidad: any): boolean {
        let nacionalidadInvalida = false;

        if (!nacionalidadSeleccionada || nacionalidadSeleccionada === this.datoVacio || nacionalidadSeleccionada === this.codigoSinInformacionPais) {
            nacionalidadInvalida = true;
        } else {
            const encuentraNacionalidad = listadoNacionalidad.find(x => x.id_nacionalidad === nacionalidadSeleccionada);

            if (encuentraNacionalidad === null || encuentraNacionalidad === undefined) {
                nacionalidadInvalida = true;
            }
        }

        return nacionalidadInvalida;
    }

    /**
     * Valida Región
     * 
     * @param direccionSeleccionada por el usuario
     * @param listadoRegiones a validar
     * @returns true si es Invalida, false si es valida
     */
    validarRegion(direccionSeleccionada: any, listadoRegiones: any): boolean {
        let regionInvalida = false;

        if (!direccionSeleccionada.id_region || direccionSeleccionada.id_region === this.datoVacio) {
            regionInvalida = true;
        } else {
            const encuentraRegion = listadoRegiones.find(x => x.id_region === direccionSeleccionada.id_region);

            if (!encuentraRegion) {
                regionInvalida = true;
            }
        }

        return regionInvalida;
    }

    /**
     * Valida ciudad
     * 
     * @param direccionSeleccionada por el usuario
     * @param listadoCiudades ciudades
     * @returns true si es Invalida, false si es valida
     */
    validarCiudad(direccionSeleccionada: any, listadoCiudades: any): boolean {
        let ciudadInvalida = false;

        if (!direccionSeleccionada.id_ciudad || direccionSeleccionada.id_ciudad === this.datoVacio
            || direccionSeleccionada.id_ciudad === this.codigoSinInformacionCiudad) {
            ciudadInvalida = true;
        } else {
            const encuentraCiudad = listadoCiudades.find(x => x.id_ciudad === direccionSeleccionada.id_ciudad);

            if (!encuentraCiudad) {
                ciudadInvalida = true;
            }
        }

        return ciudadInvalida;
    }

    /**
     * Valida comuna.
     * 
     * @param direccionSeleccionada por el usuario
     * @param listadoRegiones a validar
     * @returns true si es Invalida, false si es valida
     */
    validarComuna(direccionSeleccionada: any, listadoRegiones: any): boolean {
        let comunaInvalida = false;

        if (!direccionSeleccionada.id_comuna || direccionSeleccionada.id_comuna === this.datoVacio) {
            comunaInvalida = true;
        } else {
            const encuentraComuna = listadoRegiones.find(x => x.id_comuna === direccionSeleccionada.id_comuna);

            if (!encuentraComuna) {
                comunaInvalida = true;
            }
        }

        return comunaInvalida;
    }

    /**
     * Valida formato de correo.
     * 
     * @param email a validar
     * @param desde donde viene el dato
     * @param tipo de correo
     * @returns 
     */
    validarRegexEmail(email: string): boolean {
        const expReg = this.CONSTANTES.regexCorreo;
        return expReg.test(email);
    }

}
