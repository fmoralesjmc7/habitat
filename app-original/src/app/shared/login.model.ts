/**
 * Modelo estado Login
 */
export class LoginStateModel {
    dato1: DatosUser;
    dato2: DatosAutenticacions;
}

/**
 * Interface con datos usuario servicio oauth
 */
export class DatosUser {
    nombre: string;
    email: string;
    role: string;

    constructor(objetoOauth:any) {
        this.nombre = objetoOauth.given_name;
        this.email = objetoOauth.email;
        this.role = objetoOauth.role;
    }
}

/**
 * Interface con datos de autenticacion servicio oauth
 */
export class DatosAutenticacions {
    public access_token: string;
    public access_token_expiration: number;

    constructor(access_token:string, access_token_expiration:number) {
        this.access_token = access_token;
        this.access_token_expiration = access_token_expiration;
    }
}