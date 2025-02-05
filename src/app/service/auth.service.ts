import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Login } from '../interface/login';
import { AuthResponse } from '../interface/response/AuthResponse';
import { Observable } from 'rxjs';
import { InformacionUsuarioResponse } from '../interface/response/InformacionUsuarioResponse';

const apiSeguridad = environment.apiSeguridad;

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  http = inject(HttpClient);

  constructor() { }

  login(login: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${apiSeguridad}/Usuario/Login`, login);
  }

  public saveAuthDataToLocalStorage(authResponse: AuthResponse) {
    localStorage.setItem('authData', JSON.stringify(authResponse));
  }
  
  public saveConfigUserToLocalStorage(usuarioResponse: InformacionUsuarioResponse) {
    localStorage.setItem('configUser', JSON.stringify(usuarioResponse));
  }

  public getAuthDataFromLocalStorage(): AuthResponse | null {
    const authData = localStorage.getItem('authData');
    return authData ? JSON.parse(authData) : null;
  }

  public getConfigUserFromLocalStorage(): InformacionUsuarioResponse | null {
    const configUser = localStorage.getItem('configUser');
    return configUser ? JSON.parse(configUser) : null;
  }

  getUserNameFromLocalStorage(): string | null {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData.displayName || null; 
    }
    return null; 
  }

  getIdUserFromLocalStorage(): number  {
    const authData = localStorage.getItem('authData');
    const parsedAuthData = JSON.parse(authData!);
    return  Number(parsedAuthData.id) ; 
  }

  getTokenFromLocalStorage(): string | null {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const parsedAuthData = JSON.parse(authData);
      return parsedAuthData.token || null; 
    }
    return null; 
  }

  clearAuthDataFromLocalStorage(): void {
    localStorage.removeItem('authData');
    localStorage.removeItem('configUser');
  }
}
