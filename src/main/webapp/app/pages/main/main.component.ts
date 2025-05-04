import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {NgxLoadingBar} from '@ngx-loading-bar/core';
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {NavbarComponent} from './layouts/navbar/navbar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, SidebarComponent, NavbarComponent, NgxLoadingBar],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  isSidebarShown = true;
}
