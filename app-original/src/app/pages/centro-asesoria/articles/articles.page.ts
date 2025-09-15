import { Component, OnInit } from '@angular/core';
import { HeaderElements } from 'src/app/interfaces/header-elements'; 
import { articlesConstants } from './articles.constant'; 
import { ArticlesService } from 'src/app/services/api/restful/centro_asesoria/articles/articles.service';
import { Article, DataServiceArticle } from 'src/app/interfaces/article'; 
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ContextoAPP } from 'src/app/util/contexto-app'; 
import { TrazabilidadService, UtilService } from 'src/app/services';
import { ParametroTraza } from '../../../util/parametroTraza';
import { CONSTANTES_TRAZAS_CENTRO } from '../util/centro.asessoria';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['./articles.page.scss'],
})
export class ArticlesPage implements OnInit {

  public headerElements: HeaderElements = articlesConstants.headerElements;
  private principalArticles: Article[];
  private normalArticles: Article[];
  public principalArticlesInView: Article[];
  public normalArticlesInView: Article[];
  public loadingArticles = true;
  public rut: number;
  public dv: string;
  public servicioError:boolean = false;
  uuid: string;

  constructor(private articlesService: ArticlesService,
              private router: Router,
              private navCtrl: NavController,
              public contextoAPP:ContextoAPP,
              private readonly trazabilidadProvider: TrazabilidadService,
              public readonly utilService: UtilService) { 
    this.rut = this.contextoAPP.datosCliente.rut;
    this.dv = this.contextoAPP.datosCliente.dv;
  }

  async ngOnInit() {
    this.uuid = await this.utilService.getStorageUuid();
    this.principalArticles = await this.callToService(articlesConstants.dataPrincipalPosts);
    this.normalArticles = await this.callToService(articlesConstants.dataNormalPosts);
    
    // Si se ha realizado la marca de error de uno de los dos servicios , no se marca como exito.
    if(!this.servicioError){
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_EXITO.CODIGO_OPERACION);
    }
    
    this.resetArticlesInView();
    this.loadingArticles = false;
    await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_HOME.CODIGO_OPERACION);
  }

  public async callToService(data: DataServiceArticle) {
    const articlesResult = await this.articlesService.getArticles(data);
    if(articlesResult == null ){ // caso de error en servicio
      this.servicioError = true;
      await this.registrarTrazabilidad(CONSTANTES_TRAZAS_CENTRO.ARTICLES.CALL_SERVICE_ERROR.CODIGO_OPERACION);
    }
    return articlesResult
  }

  public getDate( date: string) {
    return new Date(date);
  }

  public filterArticles(searchTerm: string) {
    if (searchTerm.length === 0) {
      return this.resetArticlesInView();
    }
    this.principalArticlesInView = this.filter(this.principalArticles, searchTerm);
    this.normalArticlesInView = this.filter(this.normalArticles, searchTerm);
  }

  public filter(articles: Article[], searchTerm: string) {
    return articles.filter(article => {
      return article.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  public resetArticlesInView() {
    this.principalArticlesInView = this.principalArticles;
    this.normalArticlesInView = this.normalArticles;
  }

  public goTo(url: string) {
    if (url === 'home') {
      return this.navCtrl.pop();
    }
    this.navCtrl.navigateForward(url);
  }

  public goToArticle(article: Article, type: 'principal' | 'normal') {
    this.router.navigate(['article-detail'], {
      queryParams: {
        article: JSON.stringify(article),
        type
      }
    });
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
      case CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_EXITO.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_EXITO);
        break;
      case CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_HOME.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.ARTICLES.INIT_HOME);
        break;
      case CONSTANTES_TRAZAS_CENTRO.ARTICLES.CALL_SERVICE_ERROR.CODIGO_OPERACION:
        parametroTraza = this.contextoAPP.generarObjetoTraza(datosGenerales, CONSTANTES_TRAZAS_CENTRO.ARTICLES.CALL_SERVICE_ERROR);
        break;

    }

    this.trazabilidadProvider.registraTrazaUUID(parametroTraza, this.rut, this.dv).subscribe();
}

}
