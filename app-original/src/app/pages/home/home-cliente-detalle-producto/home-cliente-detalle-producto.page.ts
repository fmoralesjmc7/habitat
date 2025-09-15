import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ContextoAPP } from "src/app/util/contexto-app";
import { ResizeClass } from "src/app/util/resize.class";

@Component({
  selector: "app-home-cliente-detalle-producto",
  templateUrl: "./home-cliente-detalle-producto.page.html",
  styleUrls: ["./home-cliente-detalle-producto.page.scss"],
})
export class HomeClienteDetalleProductoPage extends ResizeClass implements OnInit {

  producto: any;

  constructor(
    private readonly navCtrl: NavController,
    private readonly route: ActivatedRoute,
    public readonly contextoAPP: ContextoAPP
  ) {
    super(contextoAPP);
    this.route.queryParams.subscribe((params) => {
      this.producto = JSON.parse(params.producto);
    });
  }

  backButton() {
    this.navCtrl.pop();
  }

  ngOnInit(): void {
    //requerido
  }
}
