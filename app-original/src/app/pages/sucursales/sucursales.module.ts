import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "../../components/components.module";
import { SucursalService } from "../../services";
import { SucursalesPage } from "./sucursales.page";

@NgModule({
  declarations: [SucursalesPage],
  imports: [
    CommonModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild([{ path: "", component: SucursalesPage }]),
  ],
  providers: [SucursalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SucursalesPageModule {}
