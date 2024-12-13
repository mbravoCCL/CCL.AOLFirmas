import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FiltroFirma } from '../interface/FiltroFirma';

@Injectable({
  providedIn: 'root'
})
export class FiltrosFirmaService {
  private filtrosSubject = new BehaviorSubject<FiltroFirma>({
    tiposDocumento: [],
    historico: 0
  });

  filtros$ = this.filtrosSubject.asObservable();

  actualizarFiltros(filtros: any) {
    this.filtrosSubject.next(filtros);
  }
}
