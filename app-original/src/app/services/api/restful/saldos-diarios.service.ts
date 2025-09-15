import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class SaldosDiariosService {
    constructor(
        private http: HttpClient,
        private navCtrl: NavController
    ) {}

    /**
     * Servicio encargado de obtener los saldos diarios del cliente.
     */
    obtenerSaldosDiarios(): Observable<any> {
        const url = `${environment.dominioSaldos}/saldosdiariosback/`;

        return this.http.get(url).pipe(
            map(response => {
                // Validar si la respuesta contiene un error aunque el status sea 200
                if (response && response['error'] === 'No encontrado') {
                    console.log('Respuesta con error "No encontrado", redirigiendo a ErrorGenericoPage');
                    // Redirigir a la pantalla de error genérico
                    this.redirigirAErrorGenerico();
                    // Lanzar un error para que sea capturado por el catchError
                    throw new Error('Datos no encontrados');
                }
                return response;
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error en servicio de saldos diarios:', error);
                
                // Verificar si es un error 404 con mensaje "No encontrado"
                if (error.status === 404) {
                    try {
                        if (error.error && error.error.error === 'No encontrado') {
                            console.log('Error 404: No encontrado, redirigiendo a ErrorGenericoPage');
                        }
                    } catch (e) {
                        console.error('Error al procesar la respuesta de error:', e);
                    }
                }
                
                // Redirigir a la pantalla de error genérico para cualquier tipo de error
                this.redirigirAErrorGenerico();
                return throwError(error);
            })
        );
    }

    /**
     * Método para redirigir a la pantalla de error genérico
     */
    private redirigirAErrorGenerico(): void {
        this.navCtrl.navigateRoot('ErrorGenericoPage', {
            queryParams: {
                data: 'evolucion-ahorros',
                timestamp: new Date().getTime()
            }
        });
    }
} 