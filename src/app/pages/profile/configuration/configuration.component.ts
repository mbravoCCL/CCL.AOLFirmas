import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FirmaElectronicaRequest } from '../../../interface/request/FirmaElectronicaRequest';
import { AuthService } from '../../../service/auth.service';
import Swal from 'sweetalert2';
import { ConfigurationService } from '../../../service/configuration.service';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent implements OnInit{
  dialogRef = inject(MatDialogRef<ConfigurationComponent>);
  fb = inject(FormBuilder);
  configForm!: FormGroup;
  _authService = inject(AuthService);
  _configurationService = inject(ConfigurationService);
  base64pfx: string = '';
  base64firma: string = '';

  constructor(private cdref: ChangeDetectorRef ){

  }
  
  ngOnInit(): void {
    
    this.initForm();
    this.cdref.detectChanges();
  }


  initForm(){
    this.configForm = this.fb.group({
      pfx: [null, Validators.required], 
      firma: [null], 
      password: [''] 
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(){
  
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return; 
    }

    let firmaElectronicaRequest: FirmaElectronicaRequest = {
      idUsuario: this._authService.getIdUserFromLocalStorage(),
      certificadoPFX: this.base64pfx,
      contraseniaCertificado: this.configForm.controls["password"].value,
      imagenFirma: this.base64firma
    };
    
     Swal.fire({
            text: "¿Está seguro de actualizar la información?",
            showCancelButton: true,
            icon: "warning",
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#0e4597",
            cancelButtonColor: "#d33",
          }).then((result) => {
            if (result.isConfirmed) {
              this._configurationService.ActualizarFirmaElectronica(firmaElectronicaRequest).subscribe({
                next: (result: boolean) => {
                  let configUser = this._authService.getConfigUserFromLocalStorage();

                  if(firmaElectronicaRequest.contraseniaCertificado){
                    configUser!.contraseniaCertificadoCargada = true;
                  }else{
                    configUser!.contraseniaCertificadoCargada = false;
                  }

                  if(firmaElectronicaRequest.imagenFirma){
                    configUser!.certificadoCargado = true;
                  }else{
                    configUser!.certificadoCargado = false;
                  }

                  this._authService.saveConfigUserToLocalStorage(configUser!);

                  Swal.fire("Guardado!", "Se actualizó la información correctamente", "success");
                  this.dialogRef.close();
                },
                error: (error) => {
                  Swal.fire("Error", "Ha ocurrido un error al intentar actualizar la información.", "error");
                  console.log(error);
                },
              });
            }
          });

  }


  onFileSelected(controlName: string, event: any): void {
    const file = event.target.files[0];  
    if (file) {
      this.configForm.controls[controlName].setValue(file); 
    }
  }


  onFileChangePFX(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input?.files?.length) {
      const file = input.files[0]; 
      this.convertirArchivoABase64(file)
        .then((base64) => {
          const base64SinPrefijo = this.eliminarPrefijoBase64(base64);
          this.base64pfx = base64SinPrefijo;
        })
        .catch((error) => {
          console.error("Error al convertir el archivo:", error);
         
        });
    }
  }
  
  onFileChangeFirma(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input?.files?.length) {
      const file = input.files[0]; 
      this.convertirArchivoABase64(file)
        .then((base64) => {
          const base64SinPrefijo = this.eliminarPrefijoBase64(base64);
          this.base64firma = base64SinPrefijo;
        })
        .catch((error) => {
          console.error("Error al convertir el archivo:", error);
         
        });
    }
  }

  convertirArchivoABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      
      reader.onloadend = () => {
        resolve(reader.result as string); 
      };
      
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  }

  eliminarPrefijoBase64(base64: string): string {
   
    const regex = /^data:.+;base64,/;
    return base64.replace(regex, ''); 
  }
}
