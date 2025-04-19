import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {NgxLoadingBar} from '@ngx-loading-bar/core';
import {SidebarComponent} from './sidebar/sidebar.component';
import {NavbarComponent} from './navbar/navbar.component';
import {APP_SETTINGS} from '../../constants/app.constants';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, SidebarComponent, NavbarComponent, NgxLoadingBar],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  appSettings = APP_SETTINGS;
  isSidebarShown = true;

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']).then();
    }
  }

  onAppSidebarMinifiedToggled(): void {
    this.appSettings.appSidebarMinified = !this.appSettings.appSidebarMinified;
  }

  onAppSidebarMobileToggled(): void {
    this.appSettings.appSidebarMobileToggled = !this.appSettings.appSidebarMobileToggled;
  }

  onAppSidebarEndToggled(): void {
    this.appSettings.appSidebarEndToggled = !this.appSettings.appSidebarEndToggled;
  }

  onAppSidebarEndMobileToggled(): void {
    this.appSettings.appSidebarEndMobileToggled = !this.appSettings.appSidebarEndMobileToggled;
  }
}
