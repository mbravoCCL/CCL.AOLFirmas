import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { InformacionUsuarioResponse } from '../interface/response/InformacionUsuarioResponse';
import { Observable } from 'rxjs';
import { InformacionUsuarioRequest } from '../interface/request/InformacionUsuarioRequest';


const apiSeguridad = environment.apiSeguridad;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  http = inject(HttpClient);
  authService = inject(AuthService);

  constructor() { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getTokenFromLocalStorage();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  InformacionUsuario(request: InformacionUsuarioRequest): Observable<InformacionUsuarioResponse> {
    return this.http.post<InformacionUsuarioResponse>(`${apiSeguridad}/Usuario/InformacionUsuario`, request, {
      headers: this.getAuthHeaders()
    });
  }

}
