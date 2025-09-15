import { Injectable } from "@angular/core";
import { GoogleMap } from "@capacitor/google-maps";
import { environment } from "src/environments/environment";

export interface MapaConfig {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

@Injectable({
  providedIn: "root",
})
export class MapaService {
  private googleMapInstance: GoogleMap | null = null; // Renombrado para claridad
  private currentMapId: string | null = null; // Sigue siendo útil para la lógica de identificación
  private mapHTMLElement: HTMLElement | null = null;
  private readonly apiKey: string = environment.keyGoogleMap;

  constructor() {
    if (!this.apiKey) {
      console.error(
        "[constructor] Google Maps API Key no está configurada en environment.ts o environment.prod.ts"
      );
    }
  }

  async createMap(
    mapId: string,
    element: HTMLElement,
    config: MapaConfig
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error("Google Maps API Key no configurada.");
    }
    if (!element) {
      throw new Error("Elemento HTML para el mapa no proporcionado.");
    }

    if (this.googleMapInstance) {
      await this.destroyMapInternal();
    }

    this.currentMapId = mapId;
    this.mapHTMLElement = element;

    try {
      this.googleMapInstance = await GoogleMap.create({
        id: this.currentMapId,
        element: this.mapHTMLElement,
        apiKey: this.apiKey,
        config: {
          width: this.mapHTMLElement.offsetWidth,
          height: this.mapHTMLElement.offsetHeight,
          x: this.mapHTMLElement.offsetLeft,
          y: this.mapHTMLElement.offsetTop,
          center: config.center,
          zoom: config.zoom,
        },
      });
    } catch (e) {
      this.googleMapInstance = null;
      this.currentMapId = null;
      throw e;
    }
  }

  async destroyMap(): Promise<void> {
    await this.destroyMapInternal();
  }

  private async destroyMapInternal(): Promise<void> {
    if (this.googleMapInstance) {
      try {
        await this.googleMapInstance.removeAllMapListeners();
        await this.googleMapInstance.destroy();
      } catch (e) {
        console.error(
          `[destroyMapInternal] Error al destruir la instancia del mapa con ID '${this.currentMapId}':`,
          e
        );
      } finally {
        this.googleMapInstance = null;
      }
    } else {
      // no requiere accion
    }
  }

  async toggleMyLocation(enable: boolean): Promise<void> {
    if (!this.googleMapInstance) {
      console.warn(
        "[toggleMyLocation] El mapa no ha sido creado. No se puede (des)habilitar la ubicación actual."
      );
      return;
    }
    try {
      await this.googleMapInstance.enableCurrentLocation(enable);
    } catch (e) {
      console.error(
        "[toggleMyLocation] Error al tratar de (des)habilitar ubicación.",
        e
      );
    }
  }

  async updateCameraPosition(
    lat: number,
    lng: number,
    zoom: number,
    angle: number = 30
  ): Promise<void> {
    if (!this.googleMapInstance) {
      console.warn(
        "[updateCameraPosition] El mapa no ha sido creado. No se puede actualizar la cámara."
      );
      return;
    }
    try {
      await this.googleMapInstance.setCamera({
        coordinate: { lat, lng },
        zoom,
        angle,
      });
    } catch (e) {
      console.error(
        `[updateCameraPosition] Error al actualizar la posicion camara lat: '${lat}', lng: '${lng}', zoom: '${zoom}' `,
        e
      );
    }
  }

  async addMarker(
    lat: number,
    lng: number,
    title: string
  ): Promise<string | undefined> {
    if (!this.googleMapInstance) {
      console.warn(
        "[addMarker] Mapa no inicializado. No se puede agregar marcador."
      );
      return undefined;
    }
    try {
      const markerId = await this.googleMapInstance.addMarker({
        coordinate: { lat, lng },
        title,
      });
      return markerId;
    } catch (e) {
      console.error(
        `[addMarker] Error al agregar marcador '${title}', lat: '${lat}', lng: '${lng}' `,
        e
      );
    }
  }
}
