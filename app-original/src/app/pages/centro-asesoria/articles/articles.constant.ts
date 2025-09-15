import { HeaderElements } from "src/app/interfaces/header-elements"; 
import { DataServiceArticle } from "src/app/interfaces/article"; 

export const articlesConstants = {
  headerElements: {
    iconLeft: 'icon-back',
    title: 'Artículos de interés'
  } as HeaderElements,
  dataHomePosts: {
    key: 'en_home',
    value: '1'
  } as DataServiceArticle,
  dataNormalPosts: {
    key: 'tipo_contenido',
    value: 'normal'
  } as DataServiceArticle,
  dataPrincipalPosts: {
    key: 'tipo_contenido',
    value: 'destacado'
  } as DataServiceArticle,
};
