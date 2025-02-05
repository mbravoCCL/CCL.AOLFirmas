import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { Login } from '../../../interface/login';
import { ErrorResponse } from '../../../interface/response/ErrorResponse';
import { AuthResponse } from '../../../interface/response/AuthResponse';
import { ToastrService } from 'ngx-toastr'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { UsuarioService } from '../../../service/usuario.service';
import { catchError, of, switchMap } from 'rxjs';
import { InformacionUsuarioRequest } from '../../../interface/request/InformacionUsuarioRequest';
import { InformacionUsuarioResponse } from '../../../interface/response/InformacionUsuarioResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule , ReactiveFormsModule , MatInputModule, MatFormFieldModule, MatIconModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  fb = inject(FormBuilder);
  _authService = inject(AuthService);
  _userService = inject(UsuarioService);
  _toastr = inject(ToastrService); 
  router = inject(Router); 
  _auth = inject(AuthService);

  constructor(){
    this.initForm()
  }

  ngOnInit(): void {
    this._auth.clearAuthDataFromLocalStorage();
  }


  initForm(){
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  login(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData: Login = this.loginForm.value;
   
    this._authService.login(loginData).pipe(
      switchMap((response: AuthResponse) => {
      
        this._toastr.success(`Bienvenido! ${response.displayName}`, 'Login exitoso', { progressBar: true });
        this._authService.saveAuthDataToLocalStorage(response);

        let requestUser : InformacionUsuarioRequest = {
          idUsuario : Number(response.id)
        }

        return this._userService.InformacionUsuario(requestUser);
      
      }),
      catchError((error: any) => {
        const errorMessage = error?.error?.errors || 'Ha ocurrido un error desconocido.';
        this._toastr.error(errorMessage, 'Error', { progressBar: true });
        return of(null);
      })
    ).subscribe({
      next: (data: InformacionUsuarioResponse | null) => {
       
        if (data) {
          this._authService.saveConfigUserToLocalStorage(data);
          setTimeout(() => {
            this.router.navigate(['/firmas']);
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error general:', error);
      }
    });
  }
  

  oauthLogin(): void {
    console.log('Login with OAuth');
  }
}
