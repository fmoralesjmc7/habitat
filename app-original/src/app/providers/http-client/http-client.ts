import { HttpClient as Http, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class HttpClientUtil {
  private headers = new HttpHeaders();

  constructor(private http: Http) { }

  public delete(url, customHeaders?: HttpHeaders): Observable<any> {
    const header = customHeaders ? customHeaders : this.headers;
    return this.http.delete<any>(url, { headers: header  });
  }

  public get(url, params, customHeaders?: HttpHeaders): Observable<any> {
    const headers = customHeaders ? customHeaders : this.headers;
    return this.http.get<any>(url, { headers, params });
  }

  public post(url, data, customHeaders?: HttpHeaders): Observable<any> {
    const headers = customHeaders ? customHeaders : this.headers;
    return this.http.post<any>(url, data, { headers });
  }

  public put(url, data, customHeaders?: HttpHeaders): Observable<any> {
    const header = customHeaders ? customHeaders : this.headers;
    return this.http.put<any>(url, data, { headers: header });
  }
}
