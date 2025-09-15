import { ElementRef, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ResizeTecladoClass {

    /**
     * Boton a agregar margen
     */
    boton: ElementRef;

    /**
     * Renderer
     */
    private readonly renderer: Renderer2;

    constructor(private readonly platform: Platform,
        private readonly rendererFactory: RendererFactory2) {
        
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    /**
     * Se agrega listener a teclado y boton de referencia
     * 
     * @param boton a agregar listener
     */
    agregarBoton(boton: ElementRef): void {
        this.boton = boton;

        if (this.platform.is('android')) {
            Keyboard.addListener('keyboardDidShow', info => {
                this.resizePantalla(`${info.keyboardHeight.toString()}px`);
            });

            Keyboard.addListener('keyboardDidHide', () => {
                this.resizePantalla('inherit');
            });
        }
    }

    /**
     * Metodo encargado de agrandar el modal cuando se habre el teclado.
     */
    resizePantalla(margen: string): void {
        this.renderer.setStyle(this.boton.nativeElement, 'margin-bottom', margen);
    }
}
