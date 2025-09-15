import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AyudaContextualComponent } from './ayuda-contextual/ayuda-contextual';
import { HeaderComponent } from './header/header.component';
import { HeaderComponentCA } from './ca-header/header.component';
import { StartPageComponentCA } from './ca-start-page/start-page.component';
import { ModalInfoComponentCA } from './ca-modal-info/modal-info.component';
import { QuestionSlideComponentCA } from './ca-question-slide/question-slide.component';
import { LoadingComponentCA } from './ca-loading/loading.component';
import { ErrorComponentCA } from './ca-error/error.component';
import { GenderOptionsComponentCA } from './ca-gender-options/gender-options.component';
import { ChartistComponent } from './ca-chartist/chartist.component';
import { ModalComponentCA } from './ca-modal/modal.component';
import { ModalFilterComponentCA } from './ca-modal-filter/modal-filter.component';
import { ChipFilterComponentCA } from './ca-chip-filter/chip-filter.component';
import { AfpBarProgressComponentCA } from './ca-afp-bar-progress/afp-bar-progress.component';
import { SelectFundComponentCA } from './ca-select-fund/select-fund.component';
import { SelectCheckboxComponentCA } from './ca-select-checkbox/select-checkbox.component';
import { SelectRadioComponentCA } from './ca-select-radio/select-radio.component';
import { SelectPickerComponentCA } from './select-picker/select-picker.component';
import { ModalCartolaCuatrimestralComponent } from './modal-cartola-cuatrimestral/modal-cartola-cuatrimestral.component';
import { AyudaContextualTituloComponent } from './ayuda-contextual-titulo/ayuda-contextual-titulo';
import { StepItemsComponent } from './step-items/step-items.component';
import { ModalGeneralComponent } from './modal-general/modal-general.component';
import { ModalRegimenesComponent } from './modal-regimenes/modal-regimenes.component';
import { ListadoEmpleadoresComponent } from './actualizar-datos/listado-empleadores/listado-empleadores.component';
import { ExpandableComponent } from './expandable/expandable.component';
import { AyudaContextualKhipuComponent } from './ayuda-contextual-khipu/ayuda-contextual-khipu';
import { FormularioEdicionContactoComponent } from './actualizar-datos/formulario-edicion-contacto/formulario-edicion-contacto.component';
import { FormularioEdicionLaboralesComponent } from './actualizar-datos/formulario-edicion-laborales/formulario-edicion-laborales.component';
import { ModalPrudentialAutorizaConsolidacionComponent } from './prudential/modal-prudential-autoriza-consolidacion/modal-prudential-autoriza-consolidacion.component';
import { ModalPrudentialFelicitacionesComponent } from './prudential/modal-prudential-felicitaciones/modal-prudential-felicitaciones.component';
import { ModalInformativoPrudentialComponent } from './prudential/modal-informativo-prudential/modal-informativo-prudential.component'
import { ListadoCertificadosComponent } from './certificados/listado-certificados/listado-certificados.component';
import { ModalCertificadosComponent } from './modal-certificados/modal-certificados.component';
import { PrevisualizadorPdfComponent } from './previsualizador-pdf/previsualizador-pdf.component';

@NgModule({
  declarations: [
    AyudaContextualComponent,
    HeaderComponent,
    HeaderComponentCA,
    StartPageComponentCA,
    ModalInfoComponentCA,
    QuestionSlideComponentCA,
    LoadingComponentCA,
    ErrorComponentCA,
    GenderOptionsComponentCA,
    ChartistComponent,
    ModalComponentCA,
    ModalFilterComponentCA,
    ChipFilterComponentCA,
    AfpBarProgressComponentCA,
    SelectFundComponentCA,
    SelectCheckboxComponentCA,
    SelectRadioComponentCA,
    SelectPickerComponentCA,
    ModalCartolaCuatrimestralComponent,
    AyudaContextualTituloComponent,
    StepItemsComponent,
    ModalGeneralComponent,
    ModalRegimenesComponent,
    ListadoEmpleadoresComponent,
    ExpandableComponent,
    AyudaContextualKhipuComponent,
    FormularioEdicionContactoComponent,
    FormularioEdicionLaboralesComponent,
    ModalPrudentialAutorizaConsolidacionComponent,
    ModalPrudentialFelicitacionesComponent,
    ModalInformativoPrudentialComponent,
    ListadoCertificadosComponent,
    ModalCertificadosComponent,
    PrevisualizadorPdfComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    NgxExtendedPdfViewerModule
  ],
    exports: [
        AyudaContextualComponent,
        HeaderComponent,
        HeaderComponentCA,
        StartPageComponentCA,
        ModalInfoComponentCA,
        QuestionSlideComponentCA,
        LoadingComponentCA,
        ErrorComponentCA,
        GenderOptionsComponentCA,
        ChartistComponent,
        ModalComponentCA,
        ModalFilterComponentCA,
        ChipFilterComponentCA,
        AfpBarProgressComponentCA,
        SelectFundComponentCA,
        SelectCheckboxComponentCA,
        SelectRadioComponentCA,
        ModalCartolaCuatrimestralComponent,
        AyudaContextualTituloComponent,
        StepItemsComponent,
        ModalGeneralComponent,
        ModalRegimenesComponent,
        ListadoEmpleadoresComponent,
        ExpandableComponent,
        AyudaContextualKhipuComponent,
        FormularioEdicionContactoComponent,
        FormularioEdicionLaboralesComponent,
        ModalPrudentialAutorizaConsolidacionComponent,
        ModalPrudentialFelicitacionesComponent,
        ModalInformativoPrudentialComponent,
        ListadoCertificadosComponent,
        ModalCertificadosComponent,
        PrevisualizadorPdfComponent
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ComponentsModule { }
