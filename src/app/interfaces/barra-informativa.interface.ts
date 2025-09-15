/**
 * Interface servicio barra informativa response.
 *
 * Representa la respuesta del servicio que provee la información
 * para el despliegue de la barra informativa administrable desde wordpress.
 */

export interface BarraInformativaInterface {
    titulo: string,
    subtitulo: string,
    titulo_boton: string,
    url: string,
    app: string,
    encendido: boolean
}
