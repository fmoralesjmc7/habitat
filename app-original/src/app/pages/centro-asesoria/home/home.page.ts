import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { ArticlesService } from 'src/app/services/api/restful/centro_asesoria/articles/articles.service'; 
import { Article } from 'src/app/interfaces/article'; 
import { articlesConstants } from '../articles/articles.constant'; 
import { homeConstants } from './home.constant'; 
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { UtilService, TrazabilidadService } from 'src/app/services';
import { ClienteDatos } from '../../../services';
import { CONSTANTES_CONFIGURACION } from 'src/app/constants/constantes-centro-asesoria';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  readonly CONSTANTES_CA = CONSTANTES_CONFIGURACION;
  public articles: Article[];
  public headerElements: HeaderElements = homeConstants.headerElements;
  public slideOpts = homeConstants.slideOpts;
  public information = homeConstants.information;
  public esPensionado: boolean;
  public ocultarSimuladorPension: boolean;
  public rut: number;
  public dv: string;
  public edadUsuario:number;
  uuid:string;

  constructor(public contextoAPP:ContextoAPP,
              private navCtrl: NavController,
              private router: Router,
              private clienteDatos: ClienteDatos,
              private utilService: UtilService,
              private articlesService: ArticlesService,
              private trazabilidadProvider: TrazabilidadService) { 
              }

  async ngOnInit() {
    this.uuid = this.utilService.generarUuid();
    this.setearDatosUsuario();
    this.setArticles();
    this.validarEstadoSimuladorPension();
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.HOME.INIT.CODIGO_OPERACION);
  }

  /**
   * Valida el estado del boton simulador de pension 
   */
  public validarEstadoSimuladorPension(){
    if(this.esPensionado){
      this.ocultarSimuladorPension = true;
    }
    
    else if(this.information.gender === 'F' && this.edadUsuario > this.CONSTANTES_CA.maxAgeWomen){
      this.ocultarSimuladorPension = true;
    }

    else if(this.information.gender === 'M' && this.edadUsuario > this.CONSTANTES_CA.maxAgeMen){
      this.ocultarSimuladorPension = true;
    }
  }

  /**
   * Encargado de setear info usuario
   */
  public setearDatosUsuario(){
    this.information.gender = this.contextoAPP.datosCliente.sexo;
    this.information.name = this.contextoAPP.datosCliente.nombre + " " + this.contextoAPP.datosCliente.apellidoPaterno;

    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
    this.edadUsuario = this.contextoAPP.datosCliente.edad;
    this.clienteDatos.esPensionado.subscribe(esPensionado => {
      this.esPensionado = esPensionado;
    });
  }

  public async setArticles() {
    const numberArticlesHome = homeConstants.numberArticlesHome;
    this.articles = await this.articlesService.getArticles(articlesConstants.dataHomePosts);
    this.articles.sort((first, second) => {
      if (new Date(first.publishDate) > new Date(second.publishDate)) { return -1; }
      if (new Date(first.publishDate) < new Date(second.publishDate)) { return 1; }
      return 0;
    });
    if (this.articles.length > numberArticlesHome) {
      this.articles = this.articles.slice(0, numberArticlesHome);
    }
    if (this.articles.length === 1) { this.slideOpts.slidesPerView = 1; }

    if(this.articles == null ){ // caso de error en servicio
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.HOME.ERROR.CODIGO_OPERACION);
    } else {
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.HOME.EXITO.CODIGO_OPERACION);
    }
  }

  public goTo(url: string) {
    if(url === "noDisponible"){
      this.utilService.mostrarToast('Esta funcionalidad aún no se encuentra disponible. Pronto tendremos estas novedades para ti.');
      return;
    }
    if(url === "noDisponibleSimulador"){
      if(this.esPensionado){
        this.utilService.mostrarToast('No puedes utilizar el simulador ya que te encuentras pensionado, utiliza nuestras otras funcionalidades.');
      }else{
        this.utilService.mostrarToast('¡Pronto! Estamos trabajando en mejoras para darte un mejor servicio.');
      }
      return;
    }
    this.navCtrl.navigateForward(url);
  }

  public goToArticle(article: Article) {
    this.router.navigate(['article-detail'], {
      queryParams: {
        article: JSON.stringify(article),
        type: 'principal'
      }
    });
  }

  public goToHome() {
    this.navCtrl.navigateRoot('HomeClientePage');
  }

   /**
    * Metodo que registra la trazabilidad de de la app. Registrando data en los servicios de habitat
    * @param codigoOperacion 
    */
    async registrarTrazabilidad(codigoOperacion: number) {
      let parametroTraza: ParametroTraza = new ParametroTraza();
      const datosGenerales = {
          traza : CONSTANTES_TRAZAS_CENTRO,
          uuid : this.uuid,
          rut: this.rut,
          dv: this.dv,
      }

      switch (codigoOperacion) {
        case CONSTANTES_TRAZAS_CENTRO.HOME.INIT.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.HOME.INIT);
          break;
        case CONSTANTES_TRAZAS_CENTRO.HOME.ERROR.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.HOME.ERROR);
          break;
        case CONSTANTES_TRAZAS_CENTRO.HOME.EXITO.CODIGO_OPERACION:
          parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.HOME.EXITO);
          break;

      }

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
  }
}
