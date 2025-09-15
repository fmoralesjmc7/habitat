import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, IonContent, Platform } from '@ionic/angular';
import { SucursalService, UtilService } from 'src/app/services';
import { SucursalesService, SucursalPage } from 'src/app/services/sucursales/sucursal.service';

export class Region {
  id: number;
  nombre: string;
};

@Component({
  selector: 'page-sucursales',
  templateUrl: 'sucursales.page.html',
  styleUrls: ['./sucursales.page.scss']
})
export class SucursalesPage {
  ID_SUCURSAL_REAL = 3; // ID 3 : SUCURSAL REAL NO! VIRTUAL.
  localizacion: any;
  positionDefault: any = {
    lat: -33.4250417,
    lng: -70.6140801
  };
  zonaSeleted: any;
  regiones: any[];
  sucursales: any[];
  sucursalMasCerca: any;
  sucursalSelected: any;
  sucursalPorRegion: any[];
  serviciosSucursal: any[];
  infoServSucursalIsOpen: boolean = false;
  zonaNorte: Region[] = [
    { id: 15, nombre: 'R. de Arica y Parinacota' },
    { id: 1, nombre: 'R. de Tarapacá' },
    { id: 2, nombre: 'R. de Antofagasta' },
    { id: 3, nombre: 'R. de Atacama' },
    { id: 4, nombre: 'R. de Coquimbo' }
  ];
  zonaCentro: Region[] = [
    { id: 5, nombre: 'R. de Valparaíso' },
    { id: 13, nombre: 'R. Metropolitana de Santiago' },
    { id: 6, nombre: 'R. del Libertador General Bernardo O\'Higgins' },
    { id: 7, nombre: 'R. del Maule' },
    { id: 16, nombre: 'R. de Ñuble' }
  ];
  zonaSur: Region[] = [
    { id: 8, nombre: 'R. del Biobio' },
    { id: 9, nombre: 'R. de La Araucanía' },
    { id: 10, nombre: 'R. de Los Lagos' },
    { id: 11, nombre: 'R. de Aysén del General Carlos Ibáñez del Campo' },
    { id: 12, nombre: 'R. de Magallanes y de la Antártica Chilena' },
    { id: 14, nombre: 'R. de Los Rios' }
  ];

  selectOptionsRegiones: any = {
    header: 'Selecciona tu Región'
  };

  @ViewChild(IonContent) content: IonContent;
  @ViewChild('map') mapView: ElementRef;

  mapServicios: any;
  responseSucursales: any
  gmsAvailable: boolean = true;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private serviceSucursal: SucursalService,
    private sucursalesService: SucursalesService,
    private utilService: UtilService,
    private platform: Platform
  ) {
    this.sucursalesService.suscribeEliminarMapa().subscribe(async sucursalPage => {
      if (sucursalPage.eliminarMapa) {
        // Se destruye el mapa temporalmente
      } else if (sucursalPage.sucursalCurrentPage && !sucursalPage.eliminarMapa) {
        // Se reinicia el componente para crear mapa nuevamente
        this.content.scrollToTop(400);
      }
    });
  }

  ionViewDidLeave() {
  }

  async declaracionUbicacion() {
    const alert = await this.alertCtrl.create({
      header: 'Usar tu ubicación',
      message: 'Habitat App quiere acceder a tu ubicación para mostrarte las sucursales más cercanas, incluso cuando la app está en segundo plano.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Denegar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.localizacion = undefined!
          }
        }, {
          text: 'Aceptar',
          handler: async () => {
            this.localizacion = await this.loadLocation();
          }
        }
      ]
    });

    await alert.present();
  }

  async ionViewDidEnter() {
    // Se validan servicios de google solo para android
    if (this.platform.is('android')) {
    }

    await this.declaracionUbicacion()
    // Se valida si se cuenta con servicios de google para usar mapa
    if (this.gmsAvailable) {
      await this.loadMap();
    }

    this.mapServicios = await this.loadServicios();
    this.responseSucursales = await this.loadSucursales();

    if (this.responseSucursales) {
      this.sucursales = new Array();
      const responseSucursales = Array.from(this.responseSucursales);
      let distanciaMenor: number;

      responseSucursales.forEach((element: any) => {

        const serviciosSucursal = new Array();

        if (this.mapServicios && this.mapServicios.size > 0) {
          const serv = Array.from(element.servicios);
          serv.forEach((idServicio: any) => {
            serviciosSucursal.push({ id: idServicio, nombre: this.mapServicios.get(idServicio) });
          });
        }

        let suc = Array.from(element.acf.sucursales);
        // Filtramos el listado de sucursales reales
        suc = suc.filter((sucursal: any) => {
          if (sucursal.entidad == this.ID_SUCURSAL_REAL) {
            return sucursal;
          }
        });

        suc.forEach((sucursal: any) => {
          sucursal.servicios = serviciosSucursal;
          if (sucursal.latitud && sucursal.longitud) {
            this.sucursales.push(sucursal);

            if (this.localizacion) {
              const distancia = this.calculateDistance(
                this.localizacion.coords.latitude,
                sucursal.latitud,
                this.localizacion.coords.longitude,
                sucursal.longitud);
              if (distanciaMenor) {
                if (distancia < distanciaMenor) {
                  distanciaMenor = distancia;
                  this.sucursalMasCerca = sucursal;
                }
              } else {
                distanciaMenor = distancia;
                this.sucursalMasCerca = sucursal;
              }
            }
          }
        });
      });

      if (!this.sucursalSelected && distanciaMenor! && distanciaMenor < 20) {
        this.sucursalPorRegion = new Array();
        this.sucursalPorRegion.push(this.sucursalMasCerca);
        this.sucursalSelected = this.sucursalMasCerca.nombre;

        if (this.gmsAvailable) {

        }
      }
    }

    if (this.localizacion) {

      const position = {
        target: {
          lat: this.localizacion.coords.latitude,
          lng: this.localizacion.coords.longitude,
        },
        zoom: 13,
        tilt: 30
      };
      if (this.gmsAvailable) {
      }
    } else {

      const position = {
        target: {
          lat: parseFloat(this.positionDefault.lat),
          lng: parseFloat(this.positionDefault.lng)
        },
        zoom: 15,
        tilt: 30
      };

      if (this.gmsAvailable) {
      }
    }

    if (this.sucursalSelected) {
      this.showMap(this.sucursalSelected);
    }
  }

  loadLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(undefined!);
    });
  }

  loadMap() {
    return new Promise(async (resolve, reject) => {
      const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
      let latitud = this.positionDefault.lat;
      let longitud = this.positionDefault.lng;
      let zoomDefault = 12;

      if (this.localizacion) {
        latitud = this.localizacion.coords.latitude;
        longitud = this.localizacion.coords.longitude;
        zoomDefault = 13;
      }

      resolve(true);
    });
  }

  loadSucursales() {
    return new Promise((resolve, reject) => {
      this.serviceSucursal.obtenerSucursales().subscribe((response: any) => {
        resolve(response);
      }, (error: any) => {
        console.error(JSON.stringify(error));
        reject();
      });
    });
  }

  loadServicios() {
    return new Promise((resolve, reject) => {
      this.serviceSucursal.obtenerServicios().subscribe((response: any) => {
        const mapServicios = new Map();
        if (response) {
          const resp = Array.from(response);
          resp.forEach((element: any) => {
            mapServicios.set(element.id, element.name);
          });
        }
        resolve(mapServicios);
      }, (error: any) => {
        console.error(JSON.stringify(error));
        reject();
      });
    });
  }

  seleccionZona(value: string) {
    this.zonaSeleted = value;
    switch (value) {
      case 'N':
        this.regiones = this.zonaNorte;
        break;
      case 'C':
        this.regiones = this.zonaCentro;
        break;
      case 'S':
        this.regiones = this.zonaSur;
        break;
      default:
        this.regiones = null!;
        break;
    }
  }

  onChangeRegiones(value: any) {
    this.sucursalPorRegion = this.sucursales.filter((sucursal: any) => {
      if (sucursal.region == value.detail.value) {
        return sucursal;
      }
    });

    if (this.sucursalPorRegion) {
      const suc = this.sucursalPorRegion[0];
      this.showMap(suc);
    }

    this.mostrarMapa();
  }

  showMap(sucursal: any) {
    this.sucursalSelected = sucursal;

    if (sucursal) {
      const position = {
        target: {
          lat: parseFloat(sucursal.latitud),
          lng: parseFloat(sucursal.longitud)
        },
        zoom: 17,
        tilt: 30
      };
    }

    setTimeout(() => {
      this.content.scrollToTop(400);
    }, 350);
  }

  showServicios(value: any) {
    this.infoServSucursalIsOpen = true;
    if (value) {
      this.serviciosSucursal = Array.from(value);
    } else {
      this.serviciosSucursal = undefined!;
    }
  }

  calculateDistance(lat1: number, lat2: number, long1: number, long2: number) {
    const p = Math.PI / 180; // 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    const dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return dis;
  }

  closeModal() {
    this.infoServSucursalIsOpen = false;
    this.mostrarMapa();
  }

  ocultarMapa() {
  }

  mostrarMapa() {
    let sucursalPage: SucursalPage = {
      eliminarMapa: false,
      sucursalCurrentPage: true
    }

    this.sucursalesService.eventoEliminarMapa(sucursalPage);
  }
}
