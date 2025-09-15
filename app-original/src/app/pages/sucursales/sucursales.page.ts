import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { Geolocation, Position } from "@capacitor/geolocation";
import {
  AlertController,
  IonContent,
  NavController,
  Platform,
} from "@ionic/angular";
import { MapaConfig, MapaService } from "src/app/services/mapa/mapa.service";
import {
  SucursalesService,
  SucursalPage,
} from "src/app/services/sucursales/sucursal.service";
import { SucursalService, UtilService } from "../../services";

export class Region {
  id: number;
  nombre: string;
}

@Component({
  selector: "page-sucursales",
  templateUrl: "sucursales.page.html",
  styleUrls: ["./sucursales.page.scss"],
})
export class SucursalesPage implements OnDestroy {
  @ViewChild("map")
  private mapContainerElementRef: ElementRef<HTMLElement>;
  private readonly MAP_ID: string = "mapa-sucursales-id";
  private defaultMapaConfig: MapaConfig = {
    center: { lat: -33.4250417, lng: -70.6140801 },
    zoom: 12,
  };

  ID_SUCURSAL_REAL = 3; // ID 3 : SUCURSAL REAL NO! VIRTUAL.
  localizacion: Position;
  zonaSeleted: any;
  regiones: any[];
  sucursales: any[];
  sucursalMasCerca: any;
  sucursalSelected: any;
  sucursalPorRegion: any[];
  serviciosSucursal: any[];
  infoServSucursalIsOpen: boolean = false;
  zonaNorte: Region[] = [
    { id: 15, nombre: "R. de Arica y Parinacota" },
    { id: 1, nombre: "R. de Tarapacá" },
    { id: 2, nombre: "R. de Antofagasta" },
    { id: 3, nombre: "R. de Atacama" },
    { id: 4, nombre: "R. de Coquimbo" },
  ];
  zonaCentro: Region[] = [
    { id: 5, nombre: "R. de Valparaíso" },
    { id: 13, nombre: "R. Metropolitana de Santiago" },
    { id: 6, nombre: "R. del Libertador General Bernardo O'Higgins" },
    { id: 7, nombre: "R. del Maule" },
    { id: 16, nombre: "R. de Ñuble" },
  ];
  zonaSur: Region[] = [
    { id: 8, nombre: "R. del Biobio" },
    { id: 9, nombre: "R. de La Araucanía" },
    { id: 10, nombre: "R. de Los Lagos" },
    { id: 11, nombre: "R. de Aysén del General Carlos Ibáñez del Campo" },
    { id: 12, nombre: "R. de Magallanes y de la Antártica Chilena" },
    { id: 14, nombre: "R. de Los Rios" },
  ];

  selectOptionsRegiones: any = {
    header: "Selecciona tu Región",
  };

  @ViewChild(IonContent) content: IonContent;

  serviciosSucursalesMap: any;
  responseSucursales: any;
  gmsAvailable: boolean = true;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private serviceSucursal: SucursalService,
    private sucursalesService: SucursalesService,
    private utilService: UtilService,
    private platform: Platform,
    private mapaService: MapaService
  ) {
    this.sucursalesService
      .suscribeEliminarMapa()
      .subscribe(async (sucursalPage) => {
        if (
          sucursalPage.sucursalCurrentPage &&
          !sucursalPage.eliminarMapa
        ) {
          this.content.scrollToTop(400);
        }
      });
  }

  ngOnDestroy(): void {
    this.mapaService.destroyMap();
  }

  async declaracionUbicacion() {
    const alert = await this.alertCtrl.create({
      header: "Usar tu ubicación",
      message:
        "Habitat App quiere acceder a tu ubicación para mostrarte las sucursales más cercanas, incluso cuando la app está en segundo plano.",
      backdropDismiss: false,
      buttons: [
        {
          text: "Denegar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            this.localizacion = undefined!;
          },
        },
        {
          text: "Aceptar",
          handler: async () => {
            this.localizacion = await this.loadLocation();
          },
        },
      ],
    });

    await alert.present();
  }

  async ionViewDidEnter() {
    // Se validan servicios de google solo para android
    if (this.platform.is("android")) {
      const storeOK = await this.utilService.validarStore();
      this.gmsAvailable = storeOK ? true : false;
    }

    this.declaracionUbicacion();
    // Se valida si se cuenta con servicios de google para usar mapa
    if (this.gmsAvailable) {
      await this.loadMap();
    }

    this.serviciosSucursalesMap = await this.loadServicios();
    this.responseSucursales = await this.loadSucursales();

    if (this.responseSucursales) {
      this.sucursales = new Array();
      const responseSucursales = Array.from(this.responseSucursales);
      let distanciaMenor: number;

      responseSucursales.forEach((element: any) => {
        const serviciosSucursal = new Array();

        if (
          this.serviciosSucursalesMap &&
          this.serviciosSucursalesMap.size > 0
        ) {
          const serv = Array.from(element.servicios);
          serv.forEach((idServicio: any) => {
            serviciosSucursal.push({
              id: idServicio,
              nombre: this.serviciosSucursalesMap.get(idServicio),
            });
          });
        }

        let sucursales = Array.from(element.acf.sucursales);
        // Filtramos el listado de sucursales reales
        sucursales = sucursales.filter((sucursal: any) => {
          if (sucursal.entidad == this.ID_SUCURSAL_REAL) {
            return sucursal;
          }
        });

        sucursales.forEach((sucursal: any) => {
          sucursal.servicios = serviciosSucursal;
          if (sucursal.latitud && sucursal.longitud) {
            this.sucursales.push(sucursal);
            if (this.localizacion) {
              const distancia = this.calculateDistance(
                this.localizacion.coords.latitude,
                sucursal.latitud,
                this.localizacion.coords.longitude,
                sucursal.longitud
              );
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
          this.mapaService.addMarker(
            parseFloat(this.sucursalMasCerca.latitud),
            parseFloat(this.sucursalMasCerca.longitud),
            this.sucursalMasCerca.nombre
          );
        }
      }
    }
    if (this.gmsAvailable) {
      if (this.localizacion) {
        this.mapaService.toggleMyLocation(true);
        this.mapaService.updateCameraPosition(
          this.localizacion.coords.latitude,
          this.localizacion.coords.longitude,
          13
        );
      } else {
        this.mapaService.addMarker(
          this.defaultMapaConfig.center.lat,
          this.defaultMapaConfig.center.lng,
          "HABITAT"
        );

        this.mapaService.updateCameraPosition(
          this.defaultMapaConfig.center.lat,
          this.defaultMapaConfig.center.lng,
          15
        );
      }
    }

    if (this.sucursalSelected) {
      this.showMap(this.sucursalSelected);
    }
  }

  loadLocation(): Promise<Position> {
    const promesa: Promise<Position> = new Promise((resolve) => {
      Geolocation.requestPermissions()
        .then(async () => {
          const currentPosition = await Geolocation.getCurrentPosition();
          if (currentPosition) {
            this.localizacion = currentPosition;
            resolve(this.localizacion);
          } else {
            resolve(undefined!);
          }
        })
        .catch((error) => {
          console.error("[loadLocation] Error al obtener la posicion ", error);
          resolve(undefined!);
        });
    });
    return promesa;
  }

  async loadMap() {
    const promesa = new Promise(async (resolve) => {
      await this.crearMapa();
      resolve(true);
    });
    return promesa;
  }

  loadSucursales() {
    const promesa = new Promise((resolve, reject) => {
      this.serviceSucursal.obtenerSucursales().subscribe(
        (response: any) => {
          resolve(response);
        },
        (error: any) => {
          console.error(JSON.stringify(error));
          reject();
        }
      );
    });
    return promesa;
  }

  loadServicios() {
    const promesa = new Promise((resolve, reject) => {
      this.serviceSucursal.obtenerServicios().subscribe(
        (response: any) => {
          const serviciosSucursalesMap = new Map();
          if (response) {
            const resp = Array.from(response);
            resp.forEach((element: any) => {
              serviciosSucursalesMap.set(element.id, element.name);
            });
          }
          resolve(serviciosSucursalesMap);
        },
        (error: any) => {
          console.error(JSON.stringify(error));
          reject();
        }
      );
    });

    return promesa;
  }

  seleccionZona(value: string) {
    this.zonaSeleted = value;
    switch (value) {
      case "N":
        this.regiones = this.zonaNorte;
        break;
      case "C":
        this.regiones = this.zonaCentro;
        break;
      case "S":
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
      this.showMap(this.sucursalPorRegion[0]);
    } else {
      this.showMap(null);
    }
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
    const a =
      0.5 -
      c((lat1 - lat2) * p) / 2 +
      (c(lat2 * p) * c(lat1 * p) * (1 - c((long1 - long2) * p))) / 2;
    const dis = 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    return dis;
  }

  closeModal() {
    this.infoServSucursalIsOpen = false;
    this.eventoEliminaMapa();
  }

  eventoEliminaMapa() {
    let sucursalPage: SucursalPage = {
      eliminarMapa: false,
      sucursalCurrentPage: true,
    };
    this.sucursalesService.eventoEliminarMapa(sucursalPage);
  }

  async crearMapa() {
    if (!this.existMapContainer()) {
      return;
    }
    try {
      let initialMapaConfig: MapaConfig;

      if (this.localizacion) {
        initialMapaConfig = {
          center: {
            lat: this.localizacion.coords.latitude,
            lng: this.localizacion.coords.longitude,
          },
          zoom: 13,
        };
      } else {
        initialMapaConfig = this.defaultMapaConfig;
      }

      await this.mapaService.createMap(
        this.MAP_ID,
        this.mapContainerElementRef.nativeElement,
        initialMapaConfig
      );
    } catch (e) {
      console.error("Error al intentar crear el mapa:", e);
    }
  }

  showMap(sucursal: any) {
    this.sucursalSelected = sucursal;

    if (!this.existMapContainer()) {
      return;
    }
    if (sucursal) {
      const lat = parseFloat(sucursal.latitud);
      const lng = parseFloat(sucursal.longitud);
      const zoom = 17;

      if (this.gmsAvailable) {
        this.mapaService.addMarker(lat, lng, sucursal.nombre);
        this.mapaService.updateCameraPosition(lat, lng, zoom);
      }
    }
    setTimeout(() => {
      this.content.scrollToTop(400);
    }, 350);
  }

  private existMapContainer() {
    if (!this.mapContainerElementRef?.nativeElement) {
      console.error(
        "El elemento contenedor del mapa no está disponible en el DOM."
      );
      return false;
    }
    return true;
  }
}
