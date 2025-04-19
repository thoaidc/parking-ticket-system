import { Component, HostListener, Input, OnInit } from '@angular/core';
import {AuthService} from '../../../core/services/auth.service';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgIf} from '@angular/common';
import {ICON_ENGLISH, ICON_LOGOUT, ICON_NOTIFICATION, ICON_VIETNAMESE} from '../../../shared/utils/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    SafeHtmlPipe,
    NgIf
  ]
})
export class NavbarComponent implements OnInit {
  @Input() isSidebarShown!: boolean;
  showDropdown = '';
  userName: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.getUserName();
  }

  getUserName() {
    let rawUserName = localStorage.getItem('jhi-userName');

    if (rawUserName) {
      this.userName = rawUserName.replace(/^"(.*)"$/, '$1');
    } else {
      this.userName = null;
    }
  }

  @HostListener('document:click', ['$event'])
  hiddenAllDropdown() {
    this.showDropdown = '';
  }

  toggleUserInfo(event: any) {
    event.stopPropagation();
    this.showDropdown = this.showDropdown == 'USER_INFO' ? '' : 'USER_INFO';
  }

  logOut() {
    this.authService.logout();
  }

  protected readonly ICON_LOGOUT = ICON_LOGOUT;
  protected readonly ICON_VIETNAMESE = ICON_VIETNAMESE;
  protected readonly ICON_ENGLISH = ICON_ENGLISH;
  protected readonly ICON_NOTIFICATION = ICON_NOTIFICATION;
}
