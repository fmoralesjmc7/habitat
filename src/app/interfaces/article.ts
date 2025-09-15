export interface Article {
  title: string;
  subtitle: string;
  paragraphs: Array<Paragraph>;
  mainImageUrl: any;
  publishDate: string;
  slug: string;
  readingTime: number;
}

export interface Paragraph {
  subtitle: string;
  imageUrl: any;
  text: string;
}

export interface DataServiceArticle {
  key: 'en_home' | 'tipo_contenido' | 'buscar_por' | 'categoria';
  value: string;
  compare?: string;
}
