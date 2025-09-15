import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SeguridadService, UtilService} from '../services/';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class HttpRequestInterceptor implements HttpInterceptor {

    /**
     * Variable utilizada para almacenar el token obtenido desde el api login.
     */
    private token: string;
    private tokenAws: string;
    private dominioAws : string;

    constructor(private service: SeguridadService, private utilService: UtilService) {
        this.service.emitter.subscribe((data: string) => {
            this.token = 'Bearer ' + data
        });
    }

    /**
     * Metodo que intercepta todas las llamadas http y detemina si estos requieren o no seguridad.
     * @param request {HttpRequest}
     * @param next {HttpHandler}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const domain = new URL(request.url).hostname;
        this.dominioAws = environment.dominioAws;

        this.tokenAws = sessionStorage.getItem('access_token')!;

        let customReq = request.clone({
            headers: request.headers
        });

        // Verificar si el dominio es uno de los dominios AWS 
        const isAwsDomain = domain === this.dominioAws;

        if (!isAwsDomain) { // Si no es un dominio AWS
            customReq = customReq.clone({
                headers: customReq.headers
                    .set('Accept', 'application/json')
                    .set('Content-Type', 'application/json')
            });
        }

        if (!this.token && !isAwsDomain) {
            return next.handle(customReq);
        } else if (this.isSeguridadRequerida(request) && !isAwsDomain) {
            customReq = customReq.clone({
                headers: customReq.headers.set('Authorization', this.token)
            });
            return next.handle(customReq);
        } else if (isAwsDomain && this.tokenAws) {
            customReq = customReq.clone({
                headers: customReq.headers.set('Authorization', "Bearer " + this.tokenAws)
            });
            return next.handle(customReq);
        } else {
            return next.handle(request);
        }
    }

    /**
     * Metodo que determina si la url a consultar necesita token para acceder.
     * @param request {HttpRequest}
     */
    private isSeguridadRequerida(request: HttpRequest<any>): boolean {
        let uris: RegExp[] = this.service.URIS_SEGURAS;
        let url = request.url;
        for (let index = 0; index < uris.length; index++) {
            const uri = uris[index];
            if (uri.test(url)) {
                return true;
            }
        }
        return false;
    }
}