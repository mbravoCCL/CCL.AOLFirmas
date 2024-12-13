import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { FirmaDocumentoComponent } from './firma-documento/firma-documento.component';

import { FirmaBusquedaComponent } from './firma-busqueda/firma-busqueda.component';

@Component({
  selector: 'app-firmas',
  standalone: true,
  imports: [MatTabsModule, MatIconModule, FirmaDocumentoComponent, FirmaBusquedaComponent],
  templateUrl: './firmas.component.html',
  styleUrl: './firmas.component.scss'
})
export  default class FirmasComponent {

}
