import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FirmaPorUsuario } from '../interface/FirmasPorUsuario';
import { Observable } from 'rxjs';
import { Firma } from '../interface/firma';
import { environment } from '../../environments/environment.development';
import { FirmaDocumentoRequest } from '../interface/request/FirmaDocumentoRequest';
import { FirmaDocumentosRequest } from '../interface/request/FirmaDocumentosRequest';
import { AuthService } from './auth.service';

const apiBackend = environment.apiBackend;

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  http = inject(HttpClient);
  authService = inject(AuthService);
  
  constructor() { }

    private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getTokenFromLocalStorage();
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }

    ListadoDocumentosPorUsuario(firma: FirmaPorUsuario): Observable<Firma[]> {
      return this.http.post<Firma[]>(`${apiBackend}/Firma/ListadoDocumentosPorUsuario`, firma, {
        headers: this.getAuthHeaders()
      });
    }
  
    descargarPdf(idDocumento: number): Observable<Blob> {
      return this.http.post<Blob>(`${apiBackend}/Firma/DescargarPdf`, { idDocumento }, {
        headers: this.getAuthHeaders(),
        responseType: 'blob' as 'json'
      });
    }
  
    firmarDocumento(request: FirmaDocumentoRequest): Observable<boolean> {
      return this.http.post<boolean>(`${apiBackend}/Firma/FirmarDocumento`, request, {
        headers: this.getAuthHeaders()
      });
    }
  
    firmarDocumentos(request: FirmaDocumentosRequest): Observable<boolean> {
      return this.http.post<boolean>(`${apiBackend}/Firma/FirmarDocumentos`, request, {
        headers: this.getAuthHeaders()
      });
    }
}
