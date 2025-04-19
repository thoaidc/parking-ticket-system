import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {LOCAL_USER_AUTHORITIES_KEY} from './constants/local-storage.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
    authService.authenticate().subscribe(account => {
      if (account) {
        localStorage.setItem(LOCAL_USER_AUTHORITIES_KEY, JSON.stringify(account.authorities));
        this.router.navigate(['']).then();
      }
    });
  }
}
