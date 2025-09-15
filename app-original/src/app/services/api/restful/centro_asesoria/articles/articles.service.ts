import { Injectable } from '@angular/core';
import { ENV } from 'src/environments/environment';
import { Article, DataServiceArticle, Paragraph } from 'src/app/interfaces/article';
import { HttpClientUtil } from 'src/app/providers/http-client/http-client';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  public baseURL: string;
  public urlHabitat: string;

  constructor(private readonly http: HttpClientUtil) {
    this.baseURL = ENV.base_url;
    this.urlHabitat = ENV.base_url_habitat;
  }

  /**
  * Gets Articles
  * @param key {string} The key to search. Can be en_home | tipo_contenido | buscar_por | categoria
  * @param value {string} The value to search.
  * @param compare {string} The compare string to search.
  * @returns An array of articles
  */
  public getArticles(data: DataServiceArticle): Promise<Article[]> {
    const params = {
      'filter[meta_key]': data.key,
      'filter[meta_value]': data.value,
    };
    if (data.compare) {
      params['filter[meta_value]'] = data.compare;
    }
    return this.http.get(`${this.baseURL}/api/v1/centroasesoria/articulos`, params)
    .toPromise()
    .then((response) => {
      if (response.error) { return null; }
      return this.generateArticles(response);
    }) as Promise<Article[]>;
  }

  private generateArticles(response: any): Array<Article> {
    return response.map((articleResponse) => this.generateArticle(articleResponse));
  }

  private generateArticle(articleResponse): Article {
    const date = articleResponse.acf.fecha_de_publicacion;
    const publishDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6)}`;
    const article: Article = {
      title: articleResponse.title.rendered,
      subtitle: articleResponse.acf.bajada,
      mainImageUrl: this.generateUrlImage(articleResponse.acf.imagen_principal),
      publishDate,
      paragraphs: this.generateParagraphs(articleResponse.acf.parrafos),
      slug: articleResponse.slug,
      readingTime: +articleResponse.acf.tiempo_de_lectura
    };
    return article;
  }

  private generateParagraphs(paragraphsResponse): Array<Paragraph> {
    return paragraphsResponse.map((paragraphResponse) => {
      return {
        text: paragraphResponse.parrafo,
        subtitle: paragraphResponse.sub_titulo,
        imageUrl: this.generateUrlImage(paragraphResponse.imagen)
      } as Paragraph;
    });
  }

  private generateUrlImage(url) {
    if (typeof url === 'string') {
      return this.urlHabitat + url;
    }
    return null;
  }
}
