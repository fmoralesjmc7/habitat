import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AES256 } from '@awesome-cordova-plugins/aes-256/ngx';
import { FileOpener } from '@capacitor-community/file-opener';;
import { of } from 'rxjs';

import { ArticleDetailPage } from './article-detail.page';

describe('ArticleDetailPage', () => {
  let component: ArticleDetailPage;
  let fixture: ComponentFixture<ArticleDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleDetailPage ],
      providers: [ 
        AES256, 
        FileOpener, 
        UrlSerializer, 
        HttpClient, 
        HttpHandler, 
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                article: '{\"title\":\"Reseña de Mercado – Semana del 13 al 20 de mayo del 2022\",\"subtitle\":\"\",\"mainImageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/Banner_App_13al20demayo.jpg\",\"publishDate\":\"2022-05-30\",\"paragraphs\":[{\"text\":\"La información financiera de la semana entregó matices positivos, actuando como soporte en los activos de riesgo.\\r\\n\\r\\nEn USA, la producción industrial aumentó 1,1%, superando ampliamente las expectativas (0,5%), mientras que en la publicación semanal de cifras de mercado laboral se reportaron 218.000 solicitudes de desempleo, por sobre las expectativas (200.000 esperadas) y se reportó nuevamente una caída en las solicitudes continuas, que alcanzaron los 1,32 millones de registros (1,34 previos). \\r\\n\\r\\nA su vez, el Banco Popular de China (Banco Central) anunció como medida de estímulo una reducción en su tasa de referencia a 5 años plazo en 15 puntos base, llegando a 4,45%, en línea con la contracción de la actividad a raíz de los cierres sanitarios.\\r\\n\\r\\nDurante la semana, la principal temática en el mercado financiero fue el aumento en la probabilidad de recesión en la economía norteamericana hacia 2023.\\r\\nEste cambio en la visión de los analistas se reflejó en el mercado de renta fija, observándose caídas en las tasas de interés referenciales y retornos acotados en los activos de renta variable. Las materias primas siguen mostrando un comportamiento diferenciado, manteniéndose la presión en el precio del gas natural, superando nuevamente los 8 dólares por MM BTU (8,08 al cierre del viernes) y manteniendo precios estables en el petróleo, con el Brent europeo cerrando a 112,55 dólares por barril.\\r\\n\\r\\nEn cuanto al tipo de cambio, durante la semana se observó una depreciación del dólar en términos amplios, principalmente contra las monedas emergentes, llevando al tipo de cambio local hasta los $842,38 pesos por dólar ($867,93 al viernes anterior). \\r\\n\\r\\nA nivel local, este efecto de caídas en las tasas de interés y la leve recuperación en la renta variable impactó positivamente a los activos nacionales, observándose alzas en el índice IPSA (lideradas por las acciones de SQM-B) y una tendencia a la baja en las tasas de interés, tanto en los instrumentos emitidos en UF, como en pesos.\\r\\n\\r\\nImpacto en Rentabilidades\\r\\n\\r\\nDada la evolución, las rentabilidades están altamente determinadas por la exposición geográfica: los fondos más riesgosos cierran el periodo con leves pérdidas, asociadas a la apreciación del tipo de cambio frente a la mayor estabilidad en los índices de renta variable. Por otro lado, en los fondos más conservadores la rentabilidad es positiva, dada su mayor concentración de activos nacionales, especialmente en renta fija, con las ganancias de capital ante la caída en las tasas de interés locales.\\r\\n\",\"subtitle\":\"\",\"imageUrl\":null},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/01_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/02_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/03_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/04_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/05_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/06_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/07_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/08_13al20demayo2022.png\"},{\"text\":\"\",\"subtitle\":\"\",\"imageUrl\":\"https://wwwdev.afphabitat.cl/wp-content/uploads/2022/05/09_13al20demayo2022.png\"}],\"slug\":\"resena-mercado-semana-del-13-al-20-mayo-del-2022\",\"readingTime\":3}',
                type: ''
              }
            }
          },
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
