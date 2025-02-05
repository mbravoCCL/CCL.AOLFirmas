import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-firma-password',
  standalone: true,
    imports: [
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      CommonModule,
      MatIconModule,
      FormsModule
    ],
  templateUrl: './firma-password.component.html',
  styleUrl: './firma-password.component.scss'
})
export class FirmaPasswordComponent {
  
  inputValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<FirmaPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  onNoClick(): void {
    this.dialogRef.close(null); 
  }

  onConfirm(): void {
    this.dialogRef.close(this.inputValue); 
  }
}
