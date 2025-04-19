import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SIDEBAR_ROUTES} from './route.config';
import {ICON_CLOSE_SIDEBAR, ICON_EXPAND_SIDEBAR} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {NgClass, NgFor, NgIf} from '@angular/common';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    SafeHtmlPipe,
    NgIf,
    NgFor,
    NgClass,
    HasAuthorityDirective,
    RouterLink
  ]
})
export class SidebarComponent implements AfterViewInit{
  routerList = SIDEBAR_ROUTES;
  latestUrl: string = '';
  mobileMode: boolean = false;
  desktopMode: boolean = false;

  @Input() isSidebarShown!: boolean;
  @Output() isSidebarShownChange = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth <= 767) {
      this.mobileMode = true;
      this.desktopMode = false;
    } else {
      this.mobileMode = false;
      this.desktopMode = true;
    }
  }

  ngAfterViewInit() {
    // const menuBaseSelector = '.app-sidebar .menu > .menu-item.has-sub';
    // const submenuBaseSelector = ' > .menu-submenu > .menu-item.has-sub';
    //
    // // menu
    // const menuLinkSelector = menuBaseSelector + ' > .menu-link';
    // const menus = [].slice.call(document.querySelectorAll(menuLinkSelector));
    // this.handleSidebarMenuToggle(menus);
    //
    // // submenu
    // const submenuLvl1Selector = menuBaseSelector + submenuBaseSelector;
    // const submenusLvl1 = [].slice.call(document.querySelectorAll(submenuLvl1Selector + ' > .menu-link'));
    // this.handleSidebarMenuToggle(submenusLvl1);
  }

  // handleSidebarMenuToggle(menus) {
  //   menus.map(function (menu) {
  //     menu.onclick = function (e) {
  //       e.preventDefault();
  //       const target = this.nextElementSibling;
  //
  //       if (target) {
  //         menus.map(function (m) {
  //           const otherTarget = m.nextElementSibling;
  //           if (otherTarget && otherTarget !== target) {
  //             slideUp(otherTarget);
  //             otherTarget.closest('.menu-item').classList.remove('expand');
  //             otherTarget.closest('.menu-item').classList.add('closed');
  //           }
  //         });
  //
  //         const targetItemElm = target.closest('.menu-item');
  //
  //         if (targetItemElm.classList.contains('expand') || (targetItemElm.classList.contains('active') && !target.style.display)) {
  //           targetItemElm.classList.remove('expand');
  //           targetItemElm.classList.add('closed');
  //         } else {
  //           targetItemElm.classList.add('expand');
  //           targetItemElm.classList.remove('closed');
  //         }
  //       }
  //     };
  //   });
  // }

  getLink(path: string, ignore?: boolean) {
    if (ignore) {
      return;
    }

    this.router.navigate([path]).then();
    this.latestUrl = path;
  }

  toggleAppSidebar() {
    this.isSidebarShown = !this.isSidebarShown;
    this.isSidebarShownChange.emit(this.isSidebarShown);

    if (this.isSidebarShown) {
      document.getElementById('sidebar')?.classList.add('open');
    } else {
      document.getElementById('sidebar')?.classList.remove('open');
    }
  }

  protected readonly ICON_CLOSE_SIDEBAR = ICON_CLOSE_SIDEBAR;
  protected readonly ICON_EXPAND_SIDEBAR = ICON_EXPAND_SIDEBAR;
}
