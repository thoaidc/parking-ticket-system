import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './core/services/auth.service';
import {LOCAL_USER_AUTHORITIES_KEY} from './constants/local-storage.constants';
import {Subscription} from 'rxjs';
import {WebsocketService} from './core/services/websocket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private stateSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router, private websocketService: WebsocketService) {
    authService.authenticate().subscribe(account => {
      if (account) {
        localStorage.setItem(LOCAL_USER_AUTHORITIES_KEY, JSON.stringify(account.authorities));
        this.router.navigate(['']).then();
      }
    });
  }

  ngOnInit(): void {
    this.stateSubscription = this.websocketService.onState().subscribe();
    this.websocketService.connect();
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }

    this.websocketService.disconnect();
  }
}
