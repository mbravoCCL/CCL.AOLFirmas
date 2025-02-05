import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';
import { AuthService } from '../../service/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ConfigurationComponent } from '../../pages/profile/configuration/configuration.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent implements OnInit {

  isProfileMenuVisible = false;
  username: string = '';
  _authService = inject(AuthService);
  _dialogConfig = inject(MatDialog);
  router = inject(Router)

  ngOnInit(): void {

    this.username = this._authService.getUserNameFromLocalStorage()
      ?.split(" ")
      .slice(0, 2)
      .join(" ") || "";

  }

  toggleProfileMenu(): void {
    this.isProfileMenuVisible = !this.isProfileMenuVisible;
  }

  openConfigDialog() {
    const dialogRef = this._dialogConfig.open(ConfigurationComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró', result);
    });
  }


  logout() {
    this.router.navigate(['/login']);
  }


}
