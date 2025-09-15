import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { RutValidator } from '../../validators/rut.validator';
import { OAuthService, OAuthErrorEvent, UserInfo } from 'angular-oauth2-oidc';
import { authConfig } from '../../shared/auth.config';
import { SeguridadService } from '../../services/api/restful/seguridad.service';
import { rutFormat, rutClean, rutValidate } from 'rut-helpers';

@Component({
  selector: 'page-signin',
  templateUrl: './signin.html',
  styleUrls: ['./signin.scss'],
  standalone: false
})
export class SigninPage implements OnInit {
  @ViewChild('contentLogin') contentLogin!: ElementRef;
  @ViewChild('imgLogo') imgLogo!: ElementRef;

  nombre = 'Usuario';
  rutInput = '';
  clave = '';
  rut!: number;
  dv = '';
  esCliente = false;
  form!: FormGroup;
  ingresoClave = false;
  huellaActiva = false;
  loginHibrido = false;
  tipoBiometria: string = 'finger';
  margenTecladoLogin = false;
  mostrarValidacionRut = false;
  errorRut = false;

  versionNumber = '0.0.1';
  glosaAmbiente = '';
  build = 1;
  tipoInput = 'password';

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
    private renderer: Renderer2,
    private oauthService: OAuthService,
    private seguridadService: SeguridadService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      rutInput: new FormControl('', { validators: [Validators.required, RutValidator.checkRut], updateOn: 'blur' }),
      clave: new FormControl('', { validators: [Validators.required] })
    });

    // Configure OAuth
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin().catch(() => {});
  }

  ocultaTeclado() { return; }
  focusElement() { this.margenTecladoLogin = true; }
  blurElement() { this.margenTecladoLogin = false; }
  togglePasswordMode() { this.tipoInput = this.tipoInput === 'text' ? 'password' : 'text'; }
  detectarNombreMock() { this.nombre = 'Usuario'; }
  ingresarOtroUsuario() { this.esCliente = false; this.huellaActiva = false; this.loginHibrido = false; this.form.reset(); }
  mostrarModalHuella() { /* stub for phase 1 */ }
  abrirWhatsApp() { window.open('https://wa.me/56959821111?text=%C2%A1Hola!', '_blank'); }
  recuperarClave() { window.open('/recuperaClaveWeb/Recovery/index.htm', '_blank'); }
  detectaClave() { this.ingresoClave = !!this.clave && this.clave.toString().length >= 4; }

  validarRut() {
    this.rutInput = rutFormat(this.rutInput);
    this.mostrarValidacionRut = true;
    this.errorRut = !rutValidate(this.rutInput);
  }

  cleanRut() {
    this.rutInput = rutClean(this.rutInput);
    this.clave = '';
  }

  async iniciarSesion() {
    if (this.form.invalid) return;

    // Parse RUT -> rut (number) + dv (char)
    const raw = (this.rutInput || '').toString().replace(/\.|-/g, '').toUpperCase();
    const body = raw.slice(0, -1);
    const dv = raw.slice(-1);
    const rut = parseInt(body, 10);

    const pwd = this.clave.toString();

    // OAuth password flow
    try {
      await this.oauthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(`${rut}-${dv}`, pwd);
    } catch (e) {
      // swallow for now; backend call below will decide
    }

    this.seguridadService.signIn(rut, dv, pwd).subscribe({
      next: (response: any) => {
        // Expected response: { codigo: 'S'|'N'|'B', token?: string }
        if (response?.codigo === 'S') {
          this.nav.navigateRoot('/home-cliente');
        } else if (response?.codigo === 'B') {
          // bloqueado: stay, could show toast
        } else {
          // no logeado: stay, could show toast
        }
      },
      error: () => {
        // error service
      }
    });
  }
}
