import { Component, Input, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { ClienteDatos } from "../../../../../src/app/services";

@Component({
  selector: "certificados-listado-certificados",
  templateUrl: "./listado-certificados.component.html",
  styleUrls: ["./listado-certificados.component.scss"],
})
export class ListadoCertificadosComponent implements AfterViewInit {
  /**
   * listado de certificados completa
   */
  @Input() public listaTipoCertificado: any[] = [];

  /**
   * listado de certificados generales
   */
  generales: any[] = [];

  /**
   * listado de certificados saldos
   */
  saldos: any[] = [];

  /**
   * listado de certificados cotizaciones
   */
  cotizaciones: any[] = [];

  /**
   * listado de certificados cartolas
   */
  cartolas: any[] = [];

  /**
   * listado de certificados pensionados
   */
  pensionados: any[] = [];

  /**
   * flag para usuario pensionado
   */
  esPensionado = false;

  @Output() public selectCertificado = new EventEmitter();

  constructor(private readonly clienteDatos: ClienteDatos) {}

  async ngOnInit() {
    this.clienteDatos.esPensionado.subscribe((esPensionado) => {
      this.esPensionado = esPensionado;
    });
    this.generales = await this.buscarCertificados("GENERAL");
    this.saldos = await this.buscarCertificados("SALDOS");
    this.cotizaciones = await this.buscarCertificados("COTI");
    this.pensionados = await this.buscarCertificados("PENSIONADO");
    this.cartolas = await this.buscarCertificados("CARTOLAS");
  }

  ngAfterViewInit() {
    this.setupAccordionListeners();
  }

  /**
   * Configurar listeners para detectar cuando los acordeones se abren/cierran
   */
  setupAccordionListeners() {
    setTimeout(() => {
      const accordionGroup = document.querySelector('ion-accordion-group');
      if (accordionGroup) {
        accordionGroup.addEventListener('ionChange', (event: any) => {
          const allAccordions = document.querySelectorAll('ion-accordion');
          allAccordions.forEach(accordion => {
            accordion.classList.remove('header-with-border');
          });
          
          const openValue = event.detail.value;
          if (openValue) {
            const openAccordion = document.querySelector(`ion-accordion[value="${openValue}"]`);
            if (openAccordion) {
              openAccordion.classList.add('header-with-border');
            }
          }
        });
      }
    }, 500);
  }

  /**
   * Encargado de buscar los certificados por tipo
   * @param tipo de certificado
   */
  buscarCertificados(tipo) {
    const data: any = [];

    if (!this.listaTipoCertificado || this.listaTipoCertificado.length === 0) {
      return [];
    }

    for (const item of this.listaTipoCertificado) {
      const categoria = item._categoriaAcordion || item.categoriaAcordion;
      if (categoria === tipo) {
        data.push(item);
      }
    }
    return data;
  }

  /**
   * Encargado de devolver el certificado seleccionado
   * @param certificado selecionado
   */
  seleccionarCertificado(certificado) {
    this.selectCertificado.emit(certificado);
  }
}
