import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AvatarModule, CommonModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  isProfileMenuVisible = false;

  toggleProfileMenu(): void {
    this.isProfileMenuVisible = !this.isProfileMenuVisible;
  }
}
