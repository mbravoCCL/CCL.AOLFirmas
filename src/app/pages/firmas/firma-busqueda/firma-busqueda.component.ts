import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Firma } from '../../../interface/firma';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FiltrosFirmaService } from '../../../service/filtros-firma.service';
import { FiltroFirma } from '../../../interface/FiltroFirma';

@Component({
  selector: 'app-firma-busqueda',
  standalone: true,
  imports: [MatIconModule,MatCheckboxModule,CommonModule,MatDividerModule, MatButtonModule],
  templateUrl: './firma-busqueda.component.html',
  styleUrl: './firma-busqueda.component.scss'
})
export class FirmaBusquedaComponent implements OnInit {
  
  filtros: FiltroFirma = {
    tiposDocumento: [] , 
    historico: 0
  };

  _filtrosService = inject(FiltrosFirmaService);

  ngOnInit(): void {
  
  }

  aplicarFiltro() {
    this._filtrosService.actualizarFiltros(this.filtros);
  }

  toggleHistorico(isChecked: boolean){
    this.filtros.historico = isChecked ? 1 : 0;
  }

  toggleTipoDocumento(tipo: string, isChecked: boolean) {
    if (isChecked) {
      this.filtros.tiposDocumento.push(tipo);
    } else {
      const index = this.filtros.tiposDocumento.indexOf(tipo);
      if (index > -1) {
        this.filtros.tiposDocumento.splice(index, 1);
      }
    }
  }

}
