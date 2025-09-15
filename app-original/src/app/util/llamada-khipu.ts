import { Injectable } from '@angular/core';
import {
  DepositoDirectoService,
  UtilService,
  TrazabilidadService
} from '../services/';
import { ContextoAPP } from './contexto-app';
import { ParametroTraza } from './parametroTraza';
import {
  TRAZAS_DEP_DIRECTO,
  CONST_GENERALES_TRAZA,
  CONST_TRAZA_KHIPU
} from 'src/app/util/constantesTraza';

@Injectable({
  providedIn: 'root'
})
export class LlamadaKhipu {
  readonly CONSTANTES_TRAZA = TRAZAS_DEP_DIRECTO;
  readonly CONSTANTES_TRAZA_GENERAL = CONST_GENERALES_TRAZA;
  TIPO_CUENTA_APV = 'APV';

  constructor(
    private depDirService: DepositoDirectoService,
    private contextoAPP: ContextoAPP,
    private utilService: UtilService,
    private readonly trazabilidadService: TrazabilidadService
  ) {}

  /**
   * Función que procesa y envia data a servicios para poder generar una transacción a través de Khipu
   */
  async preLlamadaKhipuNew(depDir, transaccion, transaccionNew, name, rut, dv, parametroTraza) {
    return new Promise((resolve, reject) => {
      this.generarTransaccionNew(depDir, transaccionNew, rut, dv)
        .then(async (data: any[]) => {
          depDir = data['depDir'];

          await this.registrarTrazabilidad(depDir, 1, rut, dv);
          this.obtenerTransaccion(depDir.nroTransaccion, rut, dv).then(
            async (response: any) => {
              transaccion = response.transaccion;
              await this.registrarTrazabilidad(depDir, 2, rut, dv);
              this.depDirService
                .obtenerPagoKhipu(
                  data['subject'],
                  depDir,
                  parseInt(depDir.nroTransaccion),
                  name,
                  rut,
                  dv
                )
                .subscribe(
                  (responseKhipu: any) => {
                    if (responseKhipu) {
                      this.actualizarTransaccion(transaccion, rut, dv)
                        .then(async (data) => {
                          resolve({
                            success: true,
                            response: responseKhipu,
                            depositoDirecto: depDir,
                            from: 'actualizarTransaccion'
                          });
                        })
                        .catch(async (error: any) => {
                          reject({
                            success: false,
                            response: error,
                            from: 'actualizarTransaccion'
                          });
                        });
                    } else {
                      reject({
                        success: false,
                        response: responseKhipu,
                        from: 'obtenerPaymentIdKhipu'
                      });
                    }
                  },
                  async (error) => {
                    reject({
                      success: false,
                      response: error,
                      from: 'obtenerPaymentIdKhipu'
                    });
                  }
                );
            },
            (error: any) => {
              reject({
                success: false,
                response: error,
                from: 'obtenerTransaccion'
              });
            }
          );
        })
        .catch(async (error: any) => {
          this.trazabilidadService
            .registraTrazaUUID(parametroTraza, rut, dv)
            .subscribe();
          reject({
            success: false,
            response: error,
            from: 'generarTransaccion'
          });
        });
    });
  }

  /**
   * Función que procesa y envia data a servicios para poder generar una transacción a través de Khipu
   */
  async preLlamadaKhipu(depDir, transaccion, name, rut, dv, parametroTraza) {
    return new Promise((resolve, reject) => {
      this.generarTransaccion(depDir, transaccion, rut, dv)
        .then(async (data: any[]) => {
          depDir = data['depDir'];

          await this.registrarTrazabilidad(depDir, 1, rut, dv);
          this.obtenerTransaccion(depDir.nroTransaccion, rut, dv).then(
            async (response: any) => {
              transaccion = response.transaccion;
              await this.registrarTrazabilidad(depDir, 2, rut, dv);
              this.depDirService
                .obtenerPagoKhipu(
                  data['subject'],
                  depDir,
                  parseInt(depDir.nroTransaccion),
                  name,
                  rut,
                  dv
                )
                .subscribe(
                  (responseKhipu: any) => {
                    if (responseKhipu) {
                      this.actualizarTransaccion(transaccion, rut, dv)
                        .then(async (data) => {
                          resolve({
                            success: true,
                            response: responseKhipu,
                            depositoDirecto: depDir,
                            from: 'actualizarTransaccion'
                          });
                        })
                        .catch(async (error: any) => {
                          reject({
                            success: false,
                            response: error,
                            from: 'actualizarTransaccion'
                          });
                        });
                    } else {
                      reject({
                        success: false,
                        response: responseKhipu,
                        from: 'obtenerPaymentIdKhipu'
                      });
                    }
                  },
                  async (error) => {
                    reject({
                      success: false,
                      response: error,
                      from: 'obtenerPaymentIdKhipu'
                    });
                  }
                );
            },
            (error: any) => {
              reject({
                success: false,
                response: error,
                from: 'obtenerTransaccion'
              });
            }
          );
        })
        .catch(async (error: any) => {
          this.trazabilidadService
            .registraTrazaUUID(parametroTraza, rut, dv)
            .subscribe();
          reject({
            success: false,
            response: error,
            from: 'generarTransaccion'
          });
        });
    });
  }

  /**
   * Se crea transacción inicial
   * @param depDir
   * @param transaccion
   * @param rut
   * @param dv
   */
  async generarTransaccion(depDir, transaccion, rut, dv) {
    return new Promise((resolve, reject) => {
      this.depDirService.generarTransaccion(transaccion, rut, dv).subscribe(
        async (response: any) => {
          if (response && response.estado == 'OK') {
            depDir = {
              ...depDir,
              rutCliente: rut,
              dvCliente: dv,
              nroTransaccion: response.nroTransaccion
            };
            this.utilService.setLogEvent('event_habitat', {
              option: 'Paso_1_Deposito_Directo'
            });

            resolve({
              depDir: depDir,
              subject: 'Abono Directo'
            });
          } else {
            reject({
              success: false,
              response: 'Error en generarTransaccion'
            });
          }
        },
        async (error) => {
          reject({
            success: false,
            response: error
          });
        }
      );
    });
  }

  /**
   * Se crea transacción inicial
   * @param depDir
   * @param transaccion
   * @param rut
   * @param dv
   */
  async generarTransaccionNew(depDir, transaccion, rut, dv) {
    return new Promise((resolve, reject) => {
      this.depDirService.generarTransaccionNew(transaccion).subscribe(
        async (response: any) => {
          if (response) {
            depDir = {
              ...depDir,
              rutCliente: rut,
              dvCliente: dv,
              nroTransaccion: response.numeroTransaccion
            };
            this.utilService.setLogEvent('event_habitat', {
              option: 'Paso_1_Deposito_Directo'
            });

            resolve({
              depDir: depDir,
              subject: 'Abono Directo'
            });
          } else {
            reject({
              success: false,
              response: 'Error en generarTransaccion'
            });
          }
        },
        async (error) => {
          reject({
            success: false,
            response: error
          });
        }
      );
    });
  }

  /**
   * Retorna transaccion actualizada
   * @param nroTransaccion
   * @param rut
   * @param dv
   */
  async obtenerTransaccion(nroTransaccion, rut, dv) {
    return new Promise((resolve, reject) => {
      this.depDirService.obtenerTransaccion(nroTransaccion, rut, dv).subscribe(
        (response: any) => {
          if (response && response.estado == 'OK') {
            resolve({
              transaccion: response.transaccion
            });
          } else {
            reject({
              success: false,
              response: 'Error en obtenerTransaccion'
            });
          }
        },
        (error: any) => {
          reject({
            success: false,
            response: error
          });
        }
      );
    });
  }

  /**
   * Actualiza transacción con estado actual antes de enviarse a servicio khenshin (khipu)
   * @param transaccion
   * @param rut
   * @param dv
   */
  async actualizarTransaccion(transaccion, rut, dv) {
    return new Promise((resolve, reject) => {
      const updateTransaccion: any = {
        transaccion: transaccion
      };
      updateTransaccion.transaccion.estado = {
        descripcion: 'Transaccion enviada a entidad financiera.',
        idEstado: 2
      };
      updateTransaccion.transaccion.banco.activo = 'true';

      this.depDirService
        .actualizarTransaccion(updateTransaccion, rut, dv)
        .subscribe(
          (response: any) => {
            if (response && response.estado == 'OK') {
              resolve(true);
            } else {
              reject('Error en actualizarTransaccion');
            }
          },
          async (error: any) => {
            reject(error);
          }
        );
    });
  }

  /**
   * Envia datos para registrar trazabilidad dependiendo del paso en que se encuentre el proceso
   * @param depDir
   * @param type
   * @param rut
   * @param dv
   */
  async registrarTrazabilidad(depDir, type, rut, dv) {
    let parametroTraza: ParametroTraza = new ParametroTraza();
    const datosGenerales = {
      traza: CONST_TRAZA_KHIPU,
      uuid: await this.utilService.getStorageUuid(),
      rut: rut,
      dv: dv
    };

    if (this.TIPO_CUENTA_APV == depDir.codigoCta) {
      if (type === 1) {
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONST_TRAZA_KHIPU.COD_APV_PASO_2_INICIO
        );
      } else if (type === 2) {
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONST_TRAZA_KHIPU.COD_APV_PASO_2_INICIO_KIPHU
        );
      }
    } else {
      if (type === 1) {
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONST_TRAZA_KHIPU.COD_CAV_PASO_2_INICIO
        );
      } else if (type === 2) {
        parametroTraza = this.contextoAPP.generarObjetoTraza(
          datosGenerales,
          CONST_TRAZA_KHIPU.COD_CAV_PASO_2_INICIO_KIPHU
        );
      }
    }

    this.trazabilidadService
      .registraTrazaUUID(parametroTraza, rut, dv)
      .subscribe();
  }
}
