import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './services/tutorial/check-tutorial.service';

const routes: Routes = [
  { path: '', redirectTo: 'tutorial', pathMatch: 'full' },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then( m => m.TutorialPageModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'SigninPage',
    loadChildren: () => import('./pages/login/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'HomeClientePage',
    loadChildren: () => import('./pages/home/home-cliente/home-cliente.module').then( m => m.HomeClientePageModule)
  },
  {
    path: 'ActivacionHuellaPage',
    loadChildren: () => import('./pages/login/activacion-huella/activacion-huella.module').then( m => m.ActivacionHuellaPageModule)
  },
  {
    path: 'HomeClienteDetalleCarruselPage',
    loadChildren: () => import('./pages/home/home-cliente-detalle-carrusel/home-cliente-detalle-carrusel.module').then( m => m.HomeClienteDetalleCarruselPageModule)
  },
  {
    path: 'HomeClienteDetalleSimplePage',
    loadChildren: () => import('./pages/home/home-cliente-detalle-simple/home-cliente-detalle-simple.module').then( m => m.HomeClienteDetalleSimplePageModule)
  },
  {
    path: 'HomeClienteDetalleProductoPage',
    loadChildren: () => import('./pages/home/home-cliente-detalle-producto/home-cliente-detalle-producto.module').then( m => m.HomeClienteDetalleProductoPageModule)
  },
  {
    path: 'HomeInvitadoPage',
    loadChildren: () => import('./pages/home/home-invitado/home-invitado.module').then( m => m.HomeInvitadoPageModule)
  },
  {
    path: 'HomeInvitadoStep2Page',
    loadChildren: () => import('./pages/home/home-invitado-step-dos/home-invitado-step-dos.module').then( m => m.HomeInvitadoStepDosPageModule)
  },
  {
    path: 'ErrorGenericoPage',
    loadChildren: () => import('./pages/error-generico/error-generico.module').then( m => m.ErrorGenericoPageModule)
  },
  {
    path: 'ErrorRootPage',
    loadChildren: () => import('./pages/error-root/error-root.module').then( m => m.ErrorRootPageModule)
  },
  {
    path: 'certificado-home',
    loadChildren: () => import('./pages/certificado/certificado-home/certificado-home.module').then( m => m.CertificadoHomePageModule)
  },
  {
    path: 'certificado-detalle',
    loadChildren: () => import('./pages/certificado/certificado-detalle/certificado-detalle.module').then( m => m.CertificadoDetallePageModule)
  },
  {
    path: 'certificado-generado',
    loadChildren: () => import('./pages/certificado/certificado-generado/certificado-generado.module').then( m => m.CertificadoGeneradoPageModule)
  },
  {
    path: 'cartola-detalle',
    loadChildren: () => import('./pages/certificado/cartola-detalle/cartola-detalle.module').then( m => m.CartolaDetallePageModule)
  },
  {
    path: 'cartola-cuatrimestral',
    loadChildren: () => import('./pages/certificado/cartola-cuatrimestral/cartola-cuatrimestral.module').then( m => m.CartolaCuatrimestralPageModule)
  },
  {
    path: 'home-centro-asesoria',
    loadChildren: () => import('./pages/centro-asesoria/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'tax-benefit-start',
    loadChildren: () => import('./pages/centro-asesoria/tax-benefit-start/tax-benefit-start.module').then( m => m.TaxBenefitStartPageModule)
  },
  {
    path: 'tax-benefit-simulator',
    loadChildren: () => import('./pages/centro-asesoria/tax-benefit-simulator/tax-benefit-simulator.module').then( m => m.TaxBenefitSimulatorPageModule)
  },
  {
    path: 'articles',
    loadChildren: () => import('./pages/centro-asesoria/articles/articles.module').then( m => m.ArticlesPageModule)
  },
  {
    path: 'simulator',
    loadChildren: () => import('./pages/centro-asesoria/simulator/simulator.module').then( m => m.SimulatorPageModule)
  },
  {
    path: 'simulator-start',
    loadChildren: () => import('./pages/centro-asesoria/simulator-start/simulator-start.module').then( m => m.SimulatorStartPageModule)
  },
  {
    path: 'benchmark-start',
    loadChildren: () => import('./pages/centro-asesoria/benchmark-start/benchmark-start.module').then( m => m.BenchmarkStartPageModule)
  },
  {
    path: 'benchmark',
    loadChildren: () => import('./pages/centro-asesoria/benchmark/benchmark.module').then( m => m.BenchmarkPageModule)
  },
  {
    path: 'benchmark-funds',
    loadChildren: () => import('./pages/centro-asesoria/benchmark-funds/benchmark-funds.module').then( m => m.BenchmarkFundsPageModule)
  },
  {
    path: 'article-detail',
    loadChildren: () => import('./pages/centro-asesoria/article-detail/article-detail.module').then( m => m.ArticleDetailPageModule)
  },
  {
    path: 'ClaveSacuPage',
    loadChildren: () => import('./pages/clave-sacu/clave-sacu.module').then( m => m.ClaveSacuPageModule)
  },
  {
    path: 'CambioFondoRentabilidad',
    loadChildren: () => import('./pages/cambio-y-dist-de-fondos/cambio-fondo-rentabilidad/cambio-fondo-rentabilidad.module').then( m => m.CambioFondoRentabilidadPageModule)
  },
  {
    path: 'CambioFondoStep_1Page',
    loadChildren: () => import('./pages/cambio-y-dist-de-fondos/cambio-fondo-step-1/cambio-fondo-step-1.module').then( m => m.CambioFondoStep1PageModule)
  },
  {
    path: 'CambioFondoStep_2Page',
    loadChildren: () => import('./pages/cambio-y-dist-de-fondos/cambio-fondo-step-2/cambio-fondo-step-2.module').then( m => m.CambioFondoStep2PageModule)
  },
  {
    path: 'CambioFondoStep_3Page',
    loadChildren: () => import('./pages/cambio-y-dist-de-fondos/cambio-fondo-step-3/cambio-fondo-step-3.module').then( m => m.CambioFondoStep3PageModule)
  },
  {
    path: 'IngresoDatosPage',
    loadChildren: () => import('./pages/deposito-directo/ingreso-datos/ingreso-datos.module').then( m => m.IngresoDatosPageModule)
  },
  {
    path: 'KhipuSuccessPage',
    loadChildren: () => import('./pages/deposito-directo/khipu-success/khipu-success.module').then( m => m.KhipuSuccessPageModule)
  },
  {
    path: 'KhipuErrorPage',
    loadChildren: () => import('./pages/deposito-directo/khipu-error/khipu-error.module').then( m => m.KhipuErrorPageModule)
  },
  {
    path: 'planes-home',
    loadChildren: () => import('./pages/planes-de-ahorro/planes-home/planes-home.module').then( m => m.PlanesHomePageModule)
  },
  {
    path: 'planes-step-uno',
    loadChildren: () => import('./pages/planes-de-ahorro/planes-step-uno/planes-step-uno.module').then( m => m.PlanesStepUnoPageModule)
  },
  {
    path: 'planes-step-dos',
    loadChildren: () => import('./pages/planes-de-ahorro/planes-step-dos/planes-step-dos.module').then( m => m.PlanesStepDosPageModule)
  },
  {
    path: 'planes-step-tres',
    loadChildren: () => import('./pages/planes-de-ahorro/planes-step-tres/planes-step-tres.module').then( m => m.PlanesStepTresPageModule)
  },
  {
    path: 'GiroStepUnoPage',
    loadChildren: () => import('./pages/giro-de-ahorro/giro-step-1/giro-step-1.module').then( m => m.GiroStepUnoPageModule)
  },
  {
    path: 'GiroStepDosPage',
    loadChildren: () => import('./pages/giro-de-ahorro/giro-step-2/giro-step-2.module').then( m => m.GiroStepDosPageModule)
  },
  {
    path: 'GiroStepTresPage',
    loadChildren: () => import('./pages/giro-de-ahorro/giro-step-3/giro-step-3.module').then( m => m.GiroStepTresPageModule)
  },
  {
    path: 'EvolucionAhorrosPage',
    loadChildren: () => import('./pages/evolucion-ahorros/evolucion-ahorros.module').then( m => m.EvolucionAhorrosPageModule)
  },
  {
    path: 'IndicadoresPage',
    loadChildren: () => import('./pages/indicadores/indicadores.module').then( m => m.IndicadoresPageModule)
  },
  {
    path: 'ValorCuotaPage',
    loadChildren: () => import('./pages/valor-cuota/valor-cuota.module').then( m => m.ValorCuotaPageModule)
  },
  {
    path: 'rentabilidad',
    loadChildren: () => import('./pages/rentabilidad/rentabilidad.module').then( m => m.RentabilidadPageModule)
  },
  {
    path: 'ConfiguracionPage',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'actualizar-datos-home',
    loadChildren: () => import('./pages/actualizar-datos/actualizar-datos-home/actualizar-datos-home.module').then( m => m.ActualizarDatosHomePageModule)
  },
  {
    path: 'actualizar-datos-sms',
    loadChildren: () => import('./pages/actualizar-datos/actualizar-datos-sms/actualizar-datos-sms.module').then( m => m.ActualizarDatosSmsPageModule)
  },
  {
    path: 'actualizar-datos-exito',
    loadChildren: () => import('./pages/actualizar-datos/actualizar-datos-exito/actualizar-datos-exito.module').then( m => m.ActualizarDatosExitoPageModule)
  },
  {
    path: 'actualizar-datos-contacto',
    loadChildren: () => import('./pages/actualizar-datos/actualizar-datos-contacto/actualizar-datos-contacto.module').then( m => m.ActualizarDatosContactoPageModule)
  },
  {
    path: 'actualizar-datos-laborales',
    loadChildren: () => import('./pages/actualizar-datos/actualizar-datos-laborales/actualizar-datos-laborales.module').then( m => m.ActualizarDatosLaboralesModule)
  },
  {
    path: 'notificaciones-home',
    loadChildren: () => import('./pages/notificaciones/notificaciones-home/notificaciones-home.module').then( m => m.NotificacionesHomePageModule)
  },
  {
    path: 'notificaciones-detalle',
    loadChildren: () => import('./pages/notificaciones/notificaciones-detalle/notificaciones-detalle.module').then( m => m.NotificacionesDetallePageModule)
  },
  {
    path: 'ConsultorPage',
    loadChildren: () => import('./pages/consultor/consultor.module').then( m => m.ConsultorPageModule)
  },
  {
    path: 'ContactoPage',
    loadChildren: () => import('./pages/contacto/contacto.module').then( m => m.ContactoPageModule)
  },
  {
    path: 'SucursalesPage',
    loadChildren: () => import('./pages/sucursales/sucursales.module').then( m => m.SucursalesPageModule)
  },
  {
    path: 'ClaveUnicaComponent',
    loadChildren: () => import('./pages/clave-unica/clave-unica.module').then( m => m.ClaveUnicaModule)
  },
  {
    path: 'LiquidacionDePensionesComponent',
    loadChildren: () => import('./pages/liquidacion-de-pensiones/liquidacion-de-pensiones.module').then( m => m.LiquidacionDePensionesComponentModule)
  },
  {
    path: 'LiquidacionGeneradoComponent',
    loadChildren: () => import('./pages/liquidacion-de-pensiones/liquidacion-generado/liquidacion-generado.module').then( m => m.LiquidacionGeneradoComponentModule)
  },
  {
    path: 'OtrasSuscripcionesPage',
    loadChildren: () => import('./pages/otras-suscripciones/otras-suscripciones.module').then( m => m.OtrasSuscripcionesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
