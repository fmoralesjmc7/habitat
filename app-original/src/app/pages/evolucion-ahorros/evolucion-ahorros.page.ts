import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ChartOptions, ChartType } from "chart.js";
import { SaldosDiariosService } from "src/app/services/api/restful/saldos-diarios.service";
import { ContextoAPP } from "src/app/util/contexto-app";
import { Preferences } from "@capacitor/preferences";

@Component({
  selector: "page-evolucion-ahorros",
  templateUrl: "evolucion-ahorros.page.html",
  styleUrls: ["./evolucion-ahorros.page.scss"],
})
export class EvolucionAhorrosPage implements OnInit {
  porcentajeVariacion = 1.3;
  chart: Chart | null = null;
  periodoSeleccionado = '1 año'; // Valor por defecto
  totalAhorrado = 0; // Valor por defecto para el total ahorrado
  cuentaSeleccionada = 'Todas las cuentas'; // Nueva propiedad para mantener la cuenta seleccionada
  indiceCuentaSeleccionada = 0; // Índice correspondiente en el array de valores
  
  // Propiedades para manejar los datos del servicio
  datosServicio: any = null; // Almacenará la respuesta del servicio
  cargandoDatos = false; // Estado de carga
  errorCarga = false; // Estado de error
  
  // Propiedad para controlar el valor del segment
  segmentValue = 12; // Por defecto en año (12 meses)
  
  // Constantes para el storage
  private readonly STORAGE_KEY_DATA = 'saldos-diarios-data';
  private readonly STORAGE_KEY_FECHA = 'saldos-diarios-ultima-sincronizacion';
  private readonly STORAGE_KEY_RUT = 'cliente-rut-saldos';
  private readonly HORAS_EXPIRACION = 6; // 6 horas
  
  // Propiedades para mostrar la fecha de actualización
  fechaActualizacion: string = '';
  
  rangoMes = [
    { id: 1, label: 'Mes' },
    { id: 3, label: '3 Meses' },
    { id: 6, label: '6 Meses' },
    { id: 12, label: 'Año' }
  ];

  variacion = {
    porcentaje: 0,
    valor: 0
  }
  cuentas = [
    {
      texto: "Todas las cuentas",
      valor: 'Todas las cuentas',
    }
  ];

  public lineChartData: any[] = [
    {
      label: '',
      data: [], // Inicializar vacío, se cargará en onSegmentChange o ngOnInit
      borderColor: '#b41f3c',
      backgroundColor: 'rgba(229, 169, 184, 0.2)',
      borderWidth: 2,
      steppedLine: false,
      fill: true,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.4,
      pointBackgroundColor: '#b41f3c',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 1
    }
  ];

  public lineChartLabels: string[] = []; // Inicializar vacío

  public lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false
      }
    },
    scales: {
      yAxes: [
        {
          position: 'right',
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 45000,
            stepSize: 9000,
            callback: function (value: number) {
              if (value >= 1000) {
                return '$' + (value / 1000) + 'K';
              }
              return '$' + value;
            }
          },
          gridLines: {
            drawBorder: false,
            color: 'rgba(200, 200, 200, 0.2)'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            lineWidth: 1,
            borderDash: [5, 5],
            color: 'rgba(200, 200, 200, 0.2)'
          },
          ticks: {
            maxTicksLimit: 6, 
            callback: function (value, index, values) {
              return values[index] || ''; 
            }
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#fff',
      titleFontColor: '#1cd0e4',
      bodyFontColor: '#000',
      borderColor: '#b4b4b4',
      borderWidth: 1,
      callbacks: {
        title: (tooltipItem) => {
          const label = (tooltipItem[0]?.xLabel as string) || '';
          const index = tooltipItem[0]?.index || 0;

          const { month, monthName } = this.getMonthFromLabel(label);
          const year = this.getYearFromData(label, month, monthName, index);

          const displayYear = year || new Date().getFullYear();

          return `${label} ${displayYear}`;
        },
        label: function (tooltipItem) {
          if (tooltipItem.yLabel !== undefined) {
            return `Variación: $${tooltipItem.yLabel.toLocaleString()}`;
          } else {
              return 'Sin datos'; // O cualquier mensaje que desees mostrar
          }   
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };
  public lineChartType: ChartType = 'line';

  // Mapa cuenta -> índice en tP (con base en cuentas activas 'p')
  private cuentaAIndiceTP: { [cuenta: string]: number } = {};

  constructor(
    private navCtrl: NavController,
    private saldosDiariosService: SaldosDiariosService,
    private contextoAPP: ContextoAPP
  ) {}

  ngOnInit() {
    // Al iniciar, validar y cargar los datos del saldo diario
    this.verificarYCargarDatos();
  }

  /**
   * Verifica si necesita llamar al servicio o puede usar datos almacenados
   */
  private async verificarYCargarDatos(): Promise<void> {
    try {
      const datosVigentes = await this.validarDatosVigentes();
      
      if (datosVigentes) {
        // Usar datos almacenados
        await this.cargarDatosDesdeStorage();
      } else {
        // Llamar al servicio
        await this.cargarDatosSaldosDiarios();
      }
    } catch (error) {
      console.error('Error al verificar y cargar datos:', error);
      await this.cargarDatosSaldosDiarios(); // Fallback: llamar al servicio
    }
  }



  /**
   * Carga los datos desde el storage local
   */
  private async cargarDatosDesdeStorage(): Promise<void> {
    try {
      const datosString = await Preferences.get({ key: this.STORAGE_KEY_DATA });
      const fechaString = await Preferences.get({ key: this.STORAGE_KEY_FECHA });
      
      if (datosString.value && fechaString.value) {
        this.datosServicio = JSON.parse(datosString.value);
        this.fechaActualizacion = this.formatearFechaActualizacion(new Date(fechaString.value));
        
        // Procesar datos como si vinieran del servicio
        this.procesarDatosServicio();
        
        console.log('Datos cargados desde storage');
      } else {
        throw new Error('No se encontraron datos en storage');
      }
    } catch (error) {
      console.error('Error al cargar datos desde storage:', error);
      await this.cargarDatosSaldosDiarios(); // Fallback: llamar al servicio
    }
  }



  /**
   * Formatea la fecha de actualización para mostrar en el HTML
   */
  private formatearFechaActualizacion(fecha: Date): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    
    // Formatear la hora
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    
    return `Actualizado al cierre del ${diaSemana} ${dia} de ${mes}, ${año}`;
  }

  /**
   * Llama al servicio de saldos diarios y guarda los datos
   */
  private async cargarDatosSaldosDiarios(): Promise<void> {
    try {
      this.cargandoDatos = true;
      this.errorCarga = false;
      
      const loading = await this.contextoAPP.mostrarLoading();
      
      this.saldosDiariosService.obtenerSaldosDiarios().subscribe({
        next: async (response) => {
          this.contextoAPP.ocultarLoading(loading);
          this.cargandoDatos = false;
          
          // Guardar datos en storage
          await this.guardarDatosEnStorage(response);
          
          // Procesar datos
          this.datosServicio = response;
          this.procesarDatosServicio();
          
          console.log('Datos del servicio cargados y guardados');
        },
        error: (error) => {
          this.contextoAPP.ocultarLoading(loading);
          this.cargandoDatos = false;
          this.errorCarga = true;
          console.error('Error al obtener saldos diarios:', error);
        }
      });
    } catch (error) {
      this.cargandoDatos = false;
      this.errorCarga = true;
      console.error('Error en cargarDatosSaldosDiarios:', error);
    }
  }

  /**
   * Fuerza una nueva sincronización de datos ignorando el tiempo transcurrido
   */
  async forzarSincronizacion() {
    console.log('Forzando sincronización de datos...');
    await this.cargarDatosSaldosDiarios();
  }

  recibeOpcionSelect(value) {
    console.log('Value:', value.detail.value);
    this.cuentaSeleccionada = value.detail.value;
    
    // Calcular el índice correspondiente a la cuenta seleccionada
    this.calcularIndiceCuentaSeleccionada();
    
    // Siempre regresar al período de año cuando se cambie de cuenta
    this.segmentValue = 12; // Establecer el valor del segment a año
    this.setPeriodoSeleccionado(12); // Actualizar el texto del período
    
    // Regenerar el gráfico con los datos de la cuenta seleccionada y período de año
    this.regenerarGraficoConCuentaAno();
  }

  /**
   * Calcula el índice correspondiente a la cuenta seleccionada
   * Prioriza el mapeo construido desde 'p' hacia 'tP'.
   */
  private calcularIndiceCuentaSeleccionada(): void {
    try {
      if (!this.datosServicio) {
        console.warn('No hay datos del servicio disponibles');
        this.indiceCuentaSeleccionada = 0;
        return;
      }

      // Usar el mapeo basado en 'p' -> índice en 'tP'
      const indiceMapeado = this.cuentaAIndiceTP[this.cuentaSeleccionada];
      if (typeof indiceMapeado === 'number') {
        this.indiceCuentaSeleccionada = indiceMapeado;
      } else if (this.datosServicio && Array.isArray(this.datosServicio.tP)) {
        // Fallback: buscar directo en tP si no está en el mapeo
        const index = this.datosServicio.tP.findIndex((cuenta: string) => cuenta === this.cuentaSeleccionada);
        this.indiceCuentaSeleccionada = index >= 0 ? index : 0;
      } else {
        this.indiceCuentaSeleccionada = 0;
      }
      
      console.log(`Cuenta seleccionada: ${this.cuentaSeleccionada}, Índice en tP: ${this.indiceCuentaSeleccionada}`);
      
      // Verificar datos de ejemplo para la cuenta seleccionada
      this.verificarDatosCuenta(this.indiceCuentaSeleccionada);
    } catch (error) {
      console.error('Error al calcular índice de cuenta:', error);
      this.indiceCuentaSeleccionada = 0;
    }
  }

  /**
   * Regenera el gráfico con la nueva cuenta seleccionada y período de año por defecto
   */
  private regenerarGraficoConCuentaAno(): void {
    console.log(`Regenerando gráfico con cuenta: ${this.cuentaSeleccionada} (índice: ${this.indiceCuentaSeleccionada}) para período de año`);
    
    // Simular el evento del segment para regenerar el gráfico con período de año (12 meses)
    const event = { detail: { value: 12 } };
    this.onSegmentChange(event);
  }

  /**
   * Método de utilidad para verificar los datos de una cuenta específica
   */
  private verificarDatosCuenta(indiceCuenta: number): void {
    try {
      if (!this.datosServicio) {
        console.warn('No hay datos del servicio para verificar');
        return;
      }
      
      if (this.datosServicio?.meses) {
        const primerMes = this.datosServicio.meses[0];
        const primerDia = Object.keys(primerMes.valores)[0];
        const valorEjemplo = primerMes.valores[primerDia][indiceCuenta];
        console.log(`Ejemplo de valor para índice ${indiceCuenta}: ${valorEjemplo}`);
      }
    } catch (error) {
      console.error('Error al verificar datos de cuenta:', error);
    }
  }

  recibeValorSegment(value) {
    console.log('Value:', value.detail.value);
  }

  volverAlHome() {
    this.navCtrl.navigateRoot("HomeClientePage");
  }

  private setPeriodoSeleccionado(value: number): void {
    const periodos = {
      1: '1 mes',
      3: '3 meses',
      6: '6 meses',
      12: '1 año'
    };
    this.periodoSeleccionado = periodos[value] || 'período seleccionado';
  }

  /**
   * Obtiene los índices (en tP) a utilizar para la cuenta seleccionada.
   * - Si la cuenta es 'TOTAL', retorna los índices de todas las cuentas activas en 'p' EXCEPTO 'TOTAL'.
   * - En otro caso, retorna solo el índice de la cuenta seleccionada.
   */
  private getIndicesSeleccionados(): number[] {
    if (this.cuentaSeleccionada === 'Todas las cuentas' || this.cuentaSeleccionada === 'TOTAL') {
      // Tomar todas las cuentas activas (p), excluir TOTAL y mapear a índice en tP
      const indices: number[] = [];
      if (this.datosServicio && Array.isArray(this.datosServicio.p)) {
        this.datosServicio.p.forEach((cuenta: string) => {
          if (cuenta !== 'TOTAL' && cuenta !== 'Todas las cuentas') {
            const idx = this.cuentaAIndiceTP[cuenta];
            if (typeof idx === 'number' && idx >= 0) {
              indices.push(idx);
            }
          }
        });
      }
      return indices;
    }
    // Caso normal: solo el índice de la cuenta seleccionada
    return [this.indiceCuentaSeleccionada];
  }

  /**
   * Agrega (suma) los valores para los índices seleccionados en un arreglo de valores por día.
   * Si el índice no existe, considera 0.
   */
  private agregarPorIndices(valoresDia: number[] | undefined, indices: number[]): number {
    if (!Array.isArray(valoresDia) || indices.length === 0) return 0;
    return indices.reduce((acc, idx) => acc + (typeof valoresDia[idx] === 'number' ? valoresDia[idx] : 0), 0);
  }

  private processDailyData(): void {
    if (!this.datosServicio) {
      console.error('No hay datos del servicio disponibles');
      this.updateChartData([], [], false);
      return;
    }

    if (!this.datosServicio?.meses) {
      console.error('Datos de meses no encontrados en processDailyData');
      this.updateChartData([], [], false);
      return;
    }

    // Ordenar meses por año y mes descendente para obtener el último disponible
    const mesesOrdenados = [...this.datosServicio.meses];
    mesesOrdenados.sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      return b.mes - a.mes;
    });

    const mesActual = mesesOrdenados[0];
    if (!mesActual) {
      console.error('No hay meses disponibles en los datos');
      this.updateChartData([], [], false);
      return;
    }

    // Buscar el mes anterior (mes - 1 con wrap de año)
    const mesAnteriorNumero = mesActual.mes === 1 ? 12 : mesActual.mes - 1;
    const anioAnteriorNumero = mesActual.mes === 1 ? mesActual.anio - 1 : mesActual.anio;
    const mesAnterior = this.datosServicio.meses.find(m => m.mes === mesAnteriorNumero && m.anio === anioAnteriorNumero);

    const indices = this.getIndicesSeleccionados();

    const diasMesActual = Object.keys(mesActual.valores);
    diasMesActual.sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)));
    
    let labels: string[] = [];
    let data: number[] = [];
    
    const ultimoDiaMesActual = parseInt(diasMesActual[0].substring(1));
    
    if (ultimoDiaMesActual < 30 && mesAnterior) {
      const diasNecesarios = 30 - ultimoDiaMesActual;
      
      const diasMesAnteriorKeys = Object.keys(mesAnterior.valores);
      diasMesAnteriorKeys.sort((a, b) => parseInt(b.substring(1)) - parseInt(a.substring(1)));
      const diasMesAnterior = diasMesAnteriorKeys.slice(0, diasNecesarios);
      
      diasMesAnterior.reverse();
      diasMesAnterior.forEach(dia => {
        labels.push(`${parseInt(dia.substring(1))}/${mesAnterior.mes}`);
        const valor = this.agregarPorIndices(mesAnterior.valores[dia], indices);
        data.push(valor);
      });
    }
    
    diasMesActual.reverse();
    diasMesActual.forEach(dia => {
      labels.push(`${parseInt(dia.substring(1))}/${mesActual.mes}`);
      const valor = this.agregarPorIndices(mesActual.valores[dia], indices);
      data.push(valor);
    });
    
    if (labels.length > 30) {
      labels = labels.slice(-30);
      data = data.slice(-30);
    }

    this.updateChartData(data, labels, true);
    this.calcularVariacion(data);
  }

  private processBiWeeklyAverageData(): void {
    if (!this.datosServicio) {
      console.error('No hay datos del servicio disponibles');
      this.updateChartData([], [], false);
      return;
    }

    if (!this.datosServicio?.meses) {
      console.error('Datos de meses no encontrados en processBiWeeklyAverageData');
      this.updateChartData([], [], false);
      return;
    }

    const indices = this.getIndicesSeleccionados();

    let allLabels: string[] = [];
    let allData: number[] = [];
    
    const mesesOrdenados = [...this.datosServicio.meses];
    mesesOrdenados.sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      return b.mes - a.mes;
    });
    
    const tresUltimosMeses = mesesOrdenados.slice(0, 3);
    tresUltimosMeses.reverse();
    
    tresUltimosMeses.forEach(mes => {
      const diasDelMes = Object.keys(mes.valores);
      if (!diasDelMes || diasDelMes.length === 0) return;
      const diasOrdenados = [...diasDelMes].sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));

      const nombresMeses = {
        1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
        7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
      };

      // Quincena 1: valor fijo del día 15 (o el mayor <= 15 disponible)
      const target1 = 15;
      const diasQ1 = diasOrdenados.filter(d => parseInt(d.substring(1)) <= target1);
      const diaQ1 = diasQ1.length > 0 ? diasQ1[diasQ1.length - 1] : undefined;
      if (diaQ1) {
        const valorQ1 = this.agregarPorIndices(mes.valores[diaQ1], indices);
        allData.push(valorQ1);
        allLabels.push(`${nombresMeses[mes.mes]} 1-15`);
      }

      // Quincena 2: valor fijo del último día del mes (máximo día disponible)
      const diaQ2 = diasOrdenados[diasOrdenados.length - 1];
      const maxDay = parseInt(diaQ2.substring(1));
      if (diaQ2 && maxDay > 15) {
        const valorQ2 = this.agregarPorIndices(mes.valores[diaQ2], indices);
        allData.push(valorQ2);
        allLabels.push(`${nombresMeses[mes.mes]} 16-${maxDay}`);
      }
    });
    
    this.updateChartData(allData, allLabels, true);
    this.calcularVariacion(allData);
  }

  private processMonthlyAverageData(numberOfMonths: number): void {
    if (!this.datosServicio) {
      console.error('No hay datos del servicio disponibles');
      this.updateChartData([], [], false);
      return;
    }

    if (!this.datosServicio?.meses) {
      console.error('Datos de meses no encontrados en processMonthlyAverageData');
      this.updateChartData([], [], false);
      return;
    }

    const indices = this.getIndicesSeleccionados();

    const allLabels: string[] = [];
    const allData: number[] = [];

    const mesesOrdenados = [...this.datosServicio.meses];
    mesesOrdenados.sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      return b.mes - a.mes;
    });

    const ultimosMeses = mesesOrdenados.slice(0, numberOfMonths);
    ultimosMeses.reverse();

    ultimosMeses.forEach(mes => {
      const diasDelMes = Object.keys(mes.valores);
      if (!diasDelMes || diasDelMes.length === 0) return;
      const diaUltimo = diasDelMes.sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)))[diasDelMes.length - 1];
      const valorMes = this.agregarPorIndices(mes.valores[diaUltimo], indices);
      
      allData.push(valorMes);
      
      const nombresMeses = {
        1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun',
        7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic'
      };
      allLabels.push(nombresMeses[mes.mes]);
    });
    
    this.updateChartData(allData, allLabels, true);
    this.calcularVariacion(allData);
  }

  onSegmentChange(event: any): void {
    const selectedValue = Number(event.detail.value);
    
    // Actualizar el valor del segment
    this.segmentValue = selectedValue;
    
    this.setPeriodoSeleccionado(selectedValue);
  
    switch (selectedValue) {
      case 1: 
        this.processDailyData();
        break;
      case 3:
        this.processBiWeeklyAverageData();
        break;
      case 6:
        this.processMonthlyAverageData(6);
        break;
      case 12:
        this.processMonthlyAverageData(12);
        break;
      default:
        console.log("Rango no reconocido");
        this.updateChartData([], [], false); // Gráfico vacío por defecto
    }
  }

  /**
   * Calcula la variación en base al conjunto de datos proporcionado
   * @param data Arreglo con los valores del período seleccionado
   */
  calcularVariacion(data: number[]): void {
    if (data.length < 2) {
      this.variacion = { porcentaje: 0, valor: 0 };
      this.totalAhorrado = 0;
      return;
    }


    const valorActual = data[data.length - 1];
    // Valor más antiguo (primero en el arreglo)
    const valorAntiguo = data[0];
    
    // Calcular la diferencia de valor 
    const variacionValor = valorActual - valorAntiguo;
    
    // Calcular el porcentaje de variación
    let variacionPorcentaje = 0;
    if (valorAntiguo !== 0) {
      variacionPorcentaje = parseFloat(((variacionValor / valorAntiguo) * 100).toFixed(1));
    }
    
    this.variacion = {
      porcentaje: variacionPorcentaje,
      valor: variacionValor
    };
    
    this.totalAhorrado = valorActual;
    
    console.log("DEBUG: Variación calculada:", this.variacion);
    console.log("DEBUG: Total ahorrado:", this.totalAhorrado);
  }

  updateChartData(data: number[], labels: string[], isMonthView: boolean = false): void {
    console.log("DEBUG: updateChartData - Entrando. isMonthView:", isMonthView);
    console.log("DEBUG: updateChartData - data recibida:", data);
    console.log("DEBUG: updateChartData - labels recibidas:", labels);

    let minTick: number;
    let maxTick: number;
    let stepTick: number;

    if (isMonthView && data.length > 0) {
      const dataMin = Math.min(...data);
      const dataMax = Math.max(...data);
      const range = dataMax - dataMin;
      const padding = range * 0.05; // 5% del rango como padding, puedes ajustar este porcentaje

      minTick = Math.floor(dataMin - padding);
      maxTick = Math.ceil(dataMax + padding);

      // Asegurar que minTick no sea negativo si los datos originales son todos positivos
      if (minTick < 0 && dataMin >= 0) minTick = 0;
      // Si el rango es cero (todos los puntos de datos son iguales), añadir un pequeño padding al min y max
      if (range === 0) {
        minTick = Math.floor(dataMin * 0.99); // 99% del valor, o dataMin - algun_valor_fijo
        maxTick = Math.ceil(dataMax * 1.01);   // 101% del valor, o dataMax + algun_valor_fijo
        if (minTick === maxTick) maxTick = minTick +1; //asegurar que no son iguales
      }

      stepTick = (maxTick - minTick) > 0 ? Math.ceil((maxTick - minTick) / 4) : (dataMax / 4 || 1000); 
      if (stepTick === 0 && maxTick > 0 && (maxTick - minTick > 0) ) stepTick = Math.ceil((maxTick - minTick) / 4);
      else if (stepTick === 0) stepTick = (maxTick || 1) / 4; // fallback para evitar 0
      if (stepTick === 0) stepTick = 1; // Último recurso

    } else if (data.length > 0) { // Lógica anterior para otros rangos
      minTick = 0;
      maxTick = Math.ceil(Math.max(...data));
      stepTick = maxTick > 0 ? Math.ceil(maxTick / 4) : 1000;
    } else { // No data
      minTick = 0;
      maxTick = 1000; // Un default para gráfico vacío
      stepTick = 250;
    }
  
    console.log("DEBUG: updateChartData - minTick calculado:", minTick);
    console.log("DEBUG: updateChartData - maxTick calculado:", maxTick);
    console.log("DEBUG: updateChartData - stepTick calculado:", stepTick);

    this.lineChartOptions = {
      ...this.lineChartOptions,
      scales: {
        ...this.lineChartOptions.scales,
        yAxes: [
          {
            ...(this.lineChartOptions.scales?.yAxes?.[0] || {}),
            position: 'right', // Aseguramos que la posición se mantenga
            ticks: {
              ...(this.lineChartOptions.scales?.yAxes?.[0]?.ticks || {}),
              beginAtZero: !isMonthView, // Solo comienza en cero si NO es la vista de mes
              min: minTick, 
              max: maxTick, 
              stepSize: stepTick, 
              callback: function (value: number) {
                if (value >= 1000000) {
                  return '$' + (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                  return '$' + Math.round(value / 1000) + 'K'; // Redondear para evitar decimales en K
                }
                return '$' + value;
              }
            }
          }
        ],
        xAxes: [
          {
            ...(this.lineChartOptions.scales?.xAxes?.[0] || {}),
            gridLines: {
              ...(this.lineChartOptions.scales?.xAxes?.[0]?.gridLines || {}),
              lineWidth: 1,
              borderDash: [5, 5]
            },
            ticks: {
              ...(this.lineChartOptions.scales?.xAxes?.[0]?.ticks || {}),
              maxTicksLimit: isMonthView ? 10 : 6, // Más ticks para la vista mensual si es necesario
              callback: function (value, index, values) {
                return values[index] || ''; 
              }
            }
          }
        ]
      }
    };
  
    this.lineChartData = [
      {
        ...this.lineChartData[0],
        data: data
      }
    ];
    this.lineChartLabels = labels;
  
    if (this.chart) {
      // Forzar la actualización completa de las opciones en la instancia del gráfico existente
      this.chart.options = this.lineChartOptions;
      this.chart.update();
    }
  }

  /**
   * Procesa los datos del servicio (ya sea desde la API o desde storage)
   */
  private procesarDatosServicio(): void {
    this.cargandoDatos = false;
    this.errorCarga = false;
    
    // Cargar las opciones del selector de cuentas con los datos
    this.cargarOpcionesCuentas();
    
    // Inicializar el índice de la cuenta seleccionada
    this.calcularIndiceCuentaSeleccionada();
    
    // Cargar el gráfico con la vista por defecto (año)
    const defaultSegment = { detail: { value: 12 } };
    this.onSegmentChange(defaultSegment);
  }

  /**
   * Carga las opciones del selector de cuentas desde el objeto "tP" de los datos del servicio
   * Filtra para mostrar solo las cuentas que también existan en el array "p"
   * y construye el mapeo cuenta -> índice en tP, ya que los valores d01..dn siguen el orden de tP
   */
  // Mapeo de siglas a nombres completos de cuentas
  private readonly NOMBRES_CUENTAS: { [key: string]: string } = {
    'TOTAL': 'Todas las cuentas',
    'Todas las cuentas': 'Todas las cuentas',
    'CCICO': 'Cuenta Obligatoria',
    'CAV': 'Cuenta 2',
    'CAI': 'Cuenta de Indemnización',
    'CCICV': 'Cuenta de APV',
    'CCIDC': 'Cuenta de Depósitos Convenidos',
    'CCIAV': 'Cuenta de Afiliado Voluntario',
    'CAPVC': 'Cuenta de APVC',
    'CAVCOVID': 'Cuenta CAV COVID'
  };

  cargarOpcionesCuentas() {
    try {
      if (!this.datosServicio) {
        console.warn('No hay datos del servicio para cargar cuentas');
        return;
      }
      
      // Verificar si existen ambos arrays tP y p
      if (this.datosServicio && Array.isArray(this.datosServicio.tP) && Array.isArray(this.datosServicio.p)) {
        // Limpiar estructuras
        this.cuentas = [];
        this.cuentaAIndiceTP = {};

        // 1) Tomar primero las cuentas activas desde 'p'
        // 2) Para cada una, buscar su índice real en 'tP' (que es el orden que siguen los valores d01..dn)
        this.datosServicio.p.forEach((cuentaActiva: string) => {
          const indiceEnTP = this.datosServicio.tP.indexOf(cuentaActiva);
          if (indiceEnTP >= 0) {
            // Obtener el nombre completo de la cuenta o usar la sigla si no existe en el mapeo
            const nombreCompleto = this.NOMBRES_CUENTAS[cuentaActiva] || cuentaActiva;
            
            // incluir en el selector respetando 'p'
            this.cuentas.push({ texto: nombreCompleto, valor: cuentaActiva });
            // mapear cuenta -> índice según tP
            this.cuentaAIndiceTP[cuentaActiva] = indiceEnTP;
          }
        });

        // Si la cuenta seleccionada actual no está en las activas, forzar la primera activa
        // Pero si es 'TOTAL', cambiar a 'Todas las cuentas'
        if (this.cuentaSeleccionada === 'TOTAL') {
          this.cuentaSeleccionada = 'Todas las cuentas';
        } else if (!this.cuentas.some(c => c.valor === this.cuentaSeleccionada)) {
          const primeraActiva = this.cuentas[0]?.valor;
          if (primeraActiva) {
            this.cuentaSeleccionada = primeraActiva;
          }
        }

        console.log('Mapeo cuenta -> índice tP:', this.cuentaAIndiceTP);
        console.log('Cuentas activas (p) presentes en tP:', this.cuentas);
      } else {
        console.warn('Arrays tP o p no encontrados o no son arrays válidos');
      }
    } catch (error) {
      console.error('Error al cargar opciones de cuentas:', error);
    }
  }

  private getMonthFromLabel(label: string): { month: number | null; monthName: string | null } {
    if (typeof label !== 'string') {
      return { month: null, monthName: null };
    }
  
    if (label.includes('/')) {
      const parts = label.split('/');
      if (parts.length > 1) {
        return { month: parseInt(parts[1], 10), monthName: null };
      }
    }
    
    const monthNames: { [key: string]: number } = {
      'Ene': 1, 'Feb': 2, 'Mar': 3, 'Abr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Ago': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dic': 12
    };
    const monthPart = label.split(' ')[0];
    if (monthPart in monthNames) {
      return { month: monthNames[monthPart], monthName: monthPart };
    }
  
    return { month: null, monthName: null };
  }
  
  private getYearFromData(label: string, month: number | null, monthName: string | null, index: number): number | null {
    if (month === null) {
      return null;
    }
  
    try {
      if (!this.datosServicio) {
        console.warn('No hay datos del servicio disponibles en getYearFromData');
        return null;
      }

      if (!this.datosServicio?.meses) {
        console.error('Datos de meses no encontrados en getYearFromData');
        return null;
      }
      
      const sortedMonths = [...this.datosServicio.meses];
      sortedMonths.sort((a: any, b: any) => (a.anio - b.anio) || (a.mes - b.mes));
  
      if (monthName !== null) { // Vistas de 3, 6 o 12 meses
        if (typeof label === 'string' && label.includes('-')) { // Vista de 3 meses
          const monthIndex = Math.floor(index / 2);
          const lastThreeMonths = sortedMonths.slice(-3);
          return monthIndex < lastThreeMonths.length ? lastThreeMonths[monthIndex].anio : null;
        } else { // Vistas de 6 o 12 meses
          const relevantMonths = sortedMonths.slice(-Math.min(12, sortedMonths.length));
          const monthInfo = relevantMonths.find((m: any) => m.mes === month);
          return monthInfo?.anio || null;
        }
      } else { // Vista mensual
        const monthInfo = this.datosServicio.meses.find((m: any) => m.mes === month);
        return monthInfo?.anio || null;
      }
    } catch (error) {
      console.error('Error al buscar el año:', error);
      return null;
    }
  }

  /**
   * Verifica si los datos almacenados están vigentes (menos de 6 horas y mismo usuario)
   */
  private async validarDatosVigentes(): Promise<boolean> {
    try {
      const fechaString = await Preferences.get({ key: this.STORAGE_KEY_FECHA });
      const rutAlmacenado = await Preferences.get({ key: this.STORAGE_KEY_RUT });
      
      if (!fechaString.value || !rutAlmacenado.value) {
        console.log('No hay datos almacenados previamente');
        return false;
      }

      // Verificar si el RUT coincide con el usuario actual
      const rutActual = this.contextoAPP.datosCliente.rut?.toString();
      if (rutAlmacenado.value !== rutActual) {
        console.log('RUT del usuario cambió, se necesita nueva sincronización');
        // Limpiar datos del usuario anterior
        await this.limpiarDatosAlmacenados();
        return false;
      }

      // Verificar tiempo transcurrido
      const fechaAlmacenada = new Date(fechaString.value);
      const ahora = new Date();
      const horasTranscurridas = (ahora.getTime() - fechaAlmacenada.getTime()) / (1000 * 60 * 60);
      
      if (horasTranscurridas >= this.HORAS_EXPIRACION) {
        console.log(`Han transcurrido ${horasTranscurridas.toFixed(2)} horas. Se necesita nueva sincronización`);
        return false;
      }

      console.log(`Datos vigentes. Han transcurrido ${horasTranscurridas.toFixed(2)} horas`);
      return true;
    } catch (error) {
      console.error('Error al validar datos vigentes:', error);
      return false;
    }
  }

  /**
   * Guarda los datos del servicio en el storage local junto con el RUT del usuario
   */
  private async guardarDatosEnStorage(datos: any): Promise<void> {
    try {
      const ahora = new Date();
      const rutActual = this.contextoAPP.datosCliente.rut?.toString();
      
      await Promise.all([
        Preferences.set({
          key: this.STORAGE_KEY_DATA,
          value: JSON.stringify(datos)
        }),
        Preferences.set({
          key: this.STORAGE_KEY_FECHA,
          value: ahora.toISOString()
        }),
        Preferences.set({
          key: this.STORAGE_KEY_RUT,
          value: rutActual || ''
        })
      ]);
      
      // Actualizar la fecha de actualización en la interfaz
      this.fechaActualizacion = this.formatearFechaActualizacion(ahora);
      
      console.log('Datos guardados en storage con éxito para el usuario:', rutActual);
    } catch (error) {
      console.error('Error al guardar datos en storage:', error);
    }
  }

  /**
   * Limpia todos los datos almacenados del usuario anterior
   */
  private async limpiarDatosAlmacenados(): Promise<void> {
    try {
      await Promise.all([
        Preferences.remove({ key: this.STORAGE_KEY_DATA }),
        Preferences.remove({ key: this.STORAGE_KEY_FECHA }),
        Preferences.remove({ key: this.STORAGE_KEY_RUT })
      ]);
      console.log('Datos del usuario anterior limpiados');
    } catch (error) {
      console.error('Error al limpiar datos almacenados:', error);
    }
  }
}