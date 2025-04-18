import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private authService: AuthService, private router: Router) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['login']).then();
    }
  }
}
