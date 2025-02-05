import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FirmaElectronicaRequest } from '../interface/request/FirmaElectronicaRequest';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const apiBackend = environment.apiBackend;
const apiSeguridad = environment.apiSeguridad;

@Injectable({
  providedIn: 'root'
})


export class ConfigurationService {

  http = inject(HttpClient);
  authService = inject(AuthService);
     
  constructor() { }

     private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getTokenFromLocalStorage();
        return new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
      }

      ActualizarFirmaElectronica(request: FirmaElectronicaRequest): Observable<boolean> {
        return this.http.put<boolean>(`${apiSeguridad}/Usuario/ActualizarFirmaElectronica`, request, {
          headers: this.getAuthHeaders()
        });
      }


  
}
