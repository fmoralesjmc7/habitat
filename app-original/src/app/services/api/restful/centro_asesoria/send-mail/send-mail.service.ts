import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';
import { DataIndivideo } from 'src/app/interfaces/dataIndivideo';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {
  public baseURL: string;

  constructor(private readonly http: HttpClientUtil) {
    this.baseURL = ENV.base_url;
  }

  public sendMail(data: DataIndivideo, maxAgeMen: number, maxAgeWomen: number, fechaCorreo:string, nombreUsuario:string) {
    const html = this.generateHtml(data, maxAgeMen, maxAgeWomen);
    const params = {
      'sendComprobanteTransaccion': {
        'anexos': {
          'archivo': '',
          'nombre': ''
        },
        'copia': '',
        'digito': '',
        'fechaHora': fechaCorreo,
        'firma': {
          "cargoPersona": "AFP Habitat",
          "nombrePersona": "Servicio al Cliente"
        },
        'keyFrom': 'serviciosinternet@afphabitat.cl',
        'nombreCompleto': nombreUsuario,
        'numeroSolicitud': ' ',
        'rut': '-',
        'textoLibre': html,
        'tipoOperacion': 'Simulaci&#243;n de Pensi&#243;n',
        "titulo": "Simulaci&oacute;n de Pensi&oacute;n Centro de Asesor&iacute;a",
        'to': data.email.toLocaleLowerCase()
      }
    };
    return this.http.post(`${this.baseURL}/api/v1/mail/publico`, params, undefined)
      .toPromise()
        .then(() => {
          return true;
        });
  }

  public registerSimulation(data: DataIndivideo) {
    const  params = {
      'tipo_accion': 'SIM-PENSION',
      'aplicacion': 'APP-CDA',
      'email': data.email,
      'nombre': data.email,
      'edad': data.edad,
      'sexo': data.sexo.toUpperCase(),
      'edad_pension': data.sexo.toUpperCase() === 'F' ? 60 : 65,
      'renta': data.ingresoBrutoMensual,
      'saldo_actual': data.saldoActualEnAhorro,
      'monto_ahorro': data.valorApv ? data.valorApv : 0,
      'tiempo_ahorro': 0,
      'otros': ''
    };
    return this.http.get(`${this.baseURL}/api/v1/registra/simulacion`, params, undefined)
        .toPromise()
        .then(() => { });
  }

  private generateHtml(data: DataIndivideo, maxAgeMen: number, maxAgeWomen: number) {
    const formatter = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    });
    const amountToEvaluate: number = data.valorApv > 0 ? data.pensionEstimada12MesesAnosExtraConApv : data.pensionEstimada12MesesAnosExtra;
    const maxAge: number = data.sexo === 'm' ? maxAgeMen : maxAgeWomen;
    const extraYears: number = data.sexo === 'm' ? 2 : 3;
    const EstPen = formatter.format(data.pensionEstimada);
    const EstPen12Months = formatter.format(data.pensionEstimada12Meses);
    const EstPen12MonthsExtYear = formatter.format(data.pensionEstimada12MesesAnosExtra);
    const diffPension = formatter.format(amountToEvaluate - data.pensionEstimada);
    const goal = formatter.format(data.metaPension);
    const apvValue = formatter.format(data.valorApv);
    const diffGoal = formatter.format(data.metaPension - amountToEvaluate);
    const EstPen12MonthsWApv = formatter.format(data.pensionEstimada12MesesConApv);
    const EstPen12MonthsExtYearWApv  = formatter.format(data.pensionEstimada12MesesAnosExtraConApv);

    let htmlBase = '';
    if (!data.mejorarPension) { // Casos que no quiere mejorar pension
      // tslint:disable-next-line:max-line-length
      htmlBase = `<p style="font-family: serif;color:#666666;text-align: justify;"> A continuación, te enviamos los resultados de la simulación de pensión que acabas de realizar y las alternativas que tienes para mejorarla:<br><br> Edad actual: ${data.edad} años. <br> Edad legal de jubilación: ${maxAge} años. <br> Años para mejorar tu pensión: ${maxAge - data.edad}. <br><br> <strong style="font-size:1.4em;color:#2f5496;">Proyección de Pensión: ${EstPen} </strong><br><br> Dados tus resultados, estarías conforme con tu proyección de pensión <strong>¡Felicitaciones!</strong><br> Sin embargo, ¡tu pensión podría mejorar!<br> {{dynamicText}} </p> <p style="font-family: serif;color:#666666;text-align: justify;"> Adicionalmente, te aconsejamos ahorrar en <strong style="color:#666666;">Cuenta 2</strong>. Este producto voluntario te ayudará a cumplir todos tus proyectos de corto y mediano plazo, con la misma rentabilidad de los multifondos y a un bajo costo.<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión.<br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br> <span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
      if (data.densidad < 12) { // Caso 1
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol><li style="color:#666666;"><strong>Si ahorras los 12 meses del año,</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu <strong>pensión estimada mensual aumentaría a este monto: ${EstPen12Months}.</strong></li><li style="color:#666666;"><strong>Si postergas tu jubilación en ${extraYears} años más, tu nueva estimación de pensión mensual sería de: ${EstPen12MonthsExtYear}</strong> lo que significa que tu estimación inicial aumentaría en <strong>${diffPension}.</strong></li></ol>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      } else { // Caso 2
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `En tu caso, que cotizas todos los meses del año. <ul> <li style="color:#666666;"><strong>Si postergas tu jubilación en ${extraYears} años más, tu nueva estimación de pensión mensual sería de: ${EstPen12MonthsExtYear}</strong> lo que significa que tu estimación inicial aumentaría en <strong>${diffPension}</strong></li> </ul>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
    } else { // Casos que quiere mejorar pension
      // tslint:disable-next-line:max-line-length
      htmlBase = `<p style="font-family: serif;color:#666666;text-align: justify;"> A continuación, te enviamos los resultados de la simulación de pensión que acabas de realizar y las alternativas que tienes para mejorarla:<br><br> Edad actual: ${data.edad} años. <br> Edad legal de jubilación: ${maxAge} años. <br> Años para mejorar tu pensión: ${maxAge - data.edad} <br><br> <strong style="font-size:1.4em;color:#2f5496;">Proyección de Pensión: ${EstPen} </strong><br> <strong style="font-size:1.4em;color:#666666;">Meta de Pensión: ${goal} </strong><br><br> Existen 3 factores claves para mejorar tu pensión:<br></p> <ul> <li style="color:#666666;">La cantidad de meses que ahorras cada año,</li> <li style="color:#666666;">El monto de ahorro voluntario que puedes hacer.</li> <li style="color:#666666;">Tu edad de jubilación.</li> </ul> {{dynamicText}}`;
      if (data.densidad < 12 && data.valorApv > 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 3A Con APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Si además ahorras ${apvValue} mensualmente en un APV</strong>, tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;">Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad < 12 && data.valorApv === 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 3B Sin APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong> </li> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong>.</li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad === 12 && data.valorApv > 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 4A Con APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta:${goal}<br> <ol> <li style="color:#666666;">- <strong>Si ahorras ${apvValue} mensualmente en un APV</strong>, tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad === 12 && data.valorApv === 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 4B Sin APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta:${goal}<br> <ol> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong>.</li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltaría ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad < 12 && data.valorApv > 0
          && amountToEvaluate < data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 6A Con APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Si además ahorras ${apvValue} mensualmente en un APV</strong>, tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;">Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión.<br><br> Ingresa a <strong style="color:#666666;">www<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>afphabitat<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>cl</strong>, sección Pensiones e infórmate sobre el beneficio <strong style="color:#666666;">Aporte Previsional Solidario</strong> que entrega el Estado para mejorar las pensiones que sean iguales o inferiores a la Pensión Máxima Solidaria (PMAS).<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad < 12 && data.valorApv === 0
          && amountToEvaluate < data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 6B Sin APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión.<br><br> Ingresa a <strong style="color:#666666;">www<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>afphabitat<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>cl</strong>, sección Pensiones e infórmate sobre el beneficio <strong style="color:#666666;">Aporte Previsional Solidario</strong> que entrega el Estado para mejorar las pensiones que sean iguales o inferiores a la Pensión Máxima Solidaria (PMAS).<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
        // tslint:disable-next-line:max-line-length
      }
      if (data.densidad === 12 && data.valorApv > 0
          && amountToEvaluate < data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 7A Con APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta: ${goal}<br> <ol> <li style="color:#666666;">- <strong>Si ahorras ${apvValue} mensualmente en un APV</strong>, tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltarían ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Ingresa a <strong style="color:#666666;">www<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>afphabitat<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>cl</strong>, sección Pensiones e infórmate sobre el beneficio <strong style="color:#666666;">Aporte Previsional Solidario</strong> que entrega el Estado para mejorar las pensiones que sean iguales o inferiores a la Pensión Máxima Solidaria (PMAS).<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad === 12 && data.valorApv === 0
          && amountToEvaluate < data.pensionMaximaSolidaria
          && amountToEvaluate < data.metaPension) { // Caso 7B Sin APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta: ${goal}<br> <ol> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong>.</li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas, <strong style="color:#666666;">te faltaría ${diffGoal}</strong> para alcanzar tu meta de pensión. <br><br> Ingresa a <strong style="color:#666666;">www<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>afphabitat<span style="font-size:0px"> </span>.<span style="font-size:0px"> </span>cl</strong>, sección Pensiones e infórmate sobre el beneficio <strong style="color:#666666;">Aporte Previsional Solidario</strong> que entrega el Estado para mejorar las pensiones que sean iguales o inferiores a la Pensión Máxima Solidaria (PMAS).<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad < 12 && data.valorApv > 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate > data.metaPension) { // Caso 8A Con APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Si además ahorras ${apvValue} mensualmente en un APV</strong>, tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas de ahorro adicional, podrías alcanzar la meta de pensión que te fijaste.<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión.<br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad < 12 && data.valorApv === 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate > data.metaPension) { // Caso 8B Sin APV y Densidad < 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<ol> <li style="color:#666666;">- <strong>Si ahorras los 12 meses del año</strong> la misma cantidad actual en tu cuenta obligatoria, hasta tu edad legal de jubilación, tu pensión estimada sería de <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong>.</li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas de ahorro adicional, podrías alcanzar la meta de pensión que te fijaste.<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión. <br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad === 12 && data.valorApv > 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate > data.metaPension) { // Caso 9A Con APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta: ${goal}<br> <ol> <li style="color:#666666;">- <strong>Si ahorras ${apvValue} mensualmente en un APV,</strong> tu nueva estimación de pensión aumentaría a <strong>${EstPen12MonthsWApv}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYearWApv}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas de ahorro adicional, podrías alcanzar la meta de pensión que te fijaste.<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión.<br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
      if (data.densidad === 12 && data.valorApv === 0
          && amountToEvaluate > data.pensionMaximaSolidaria
          && amountToEvaluate > data.metaPension) { // Caso 9B Sin APV y Densidad = 12
        // tslint:disable-next-line:max-line-length
        const htmlToInsert = `<p style="font-family: serif;color:#666666;text-align: justify;"> En tu caso, que cotizas todos los meses, te aconsejamos ahorrar en un producto voluntario y así acercarte a tu meta de: ${goal}<br> <ol> <li style="color:#666666;">- Dado que no ingresaste un ahorro voluntario, tu estimación de pensión seguirá siendo <strong>${EstPen12Months}</strong></li> <li style="color:#666666;">- <strong>Por último, si postergas tu edad legal de jubilación ${extraYears} años</strong>, tu nueva estimación de pensión mensual sería de: <strong>${EstPen12MonthsExtYear}</strong></li> </ol> <p style="font-family: serif;color:#666666;text-align: justify;"> Realizando estas medidas de ahorro adicional, podrías alcanzar la meta de pensión que te fijaste.<br><br> Porque es tu futuro, es importante que te preocupes hoy por tus ahorros y tu pensión.<br><br> Recuerda que puedes <strong style="color:#666666;">volver a simular tu pensión</strong> las veces que quieras o si necesitas mayor asesoría, puedes contactarnos a través de alguno de nuestros canales de atención. <br><br><br><span style="color:#c00000;font-family:lucida, sans-serif;font-size: 1.1em;">AFP HABITAT, juntos mejoramos tu futuro.</span><br><br></p>`;
        htmlBase = htmlBase.replace('{{dynamicText}}', htmlToInsert);
      }
    }
    htmlBase = this.correctWords(htmlBase);
    return htmlBase;
  }

  private correctWords(htmlBase: string) {
    return htmlBase.replace(/([áéíóúÁÉÍÓÚñÑ¡¿])/g, function(i) {
      return '&#' + i.charCodeAt(0) + ';';
    });
  }
}
