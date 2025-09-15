import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SeguridadService } from '../services/api/restful/seguridad.service';
import { UtilService } from '../services/util/util.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpRequestInterceptor implements HttpInterceptor {
  private token: string = '';
  private tokenAws: string = '';
  private dominioAws: string = '';

  constructor(private service: SeguridadService, private utilService: UtilService) {
    this.service.emitter.subscribe((data: string) => {
      this.token = 'Bearer ' + data;
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlStr = request.url;
    let domain = '';
    try { domain = new URL(urlStr).hostname; } catch { /* relative URL */ }
    this.dominioAws = environment.dominioAws;
    this.tokenAws = sessionStorage.getItem('access_token') || '';

    let customReq = request.clone({ headers: request.headers });
    const isAwsDomain = domain === this.dominioAws;

    if (!isAwsDomain) {
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
        headers: customReq.headers.set('Authorization', 'Bearer ' + this.tokenAws)
      });
      return next.handle(customReq);
    } else {
      return next.handle(request);
    }
  }

  private isSeguridadRequerida(request: HttpRequest<any>): boolean {
    const uris: RegExp[] = this.service.URIS_SEGURAS;
    const url = request.url;
    for (let index = 0; index < uris.length; index++) {
      const uri = uris[index];
      if (uri.test(url)) return true;
    }
    return false;
  }
}

