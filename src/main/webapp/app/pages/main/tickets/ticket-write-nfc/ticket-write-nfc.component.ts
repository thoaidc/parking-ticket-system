import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, NgIf } from '@angular/common';
import { ICON_ATTENTION, ICON_ERROR_LARGE, ICON_SYNC_LARGE } from '../../../../shared/utils/icon';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';
import { WebsocketService } from '../../../../core/services/websocket.service';
import { Subscription } from 'rxjs';
import { IMessage } from '@stomp/stompjs';
import { SocketSpringMessageCus } from '../../../../core/models/event.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tickets-write-nfc',
  standalone: true,
  imports: [
    NgIf,
    SafeHtmlPipe,
  ],
  templateUrl: './ticket-write-nfc.component.html',
  styleUrls: ['./ticket-write-nfc.component.scss'],
})
export class TicketWriteNfcComponent implements OnInit, OnDestroy {
  @Input() UID: string = '';
  isSuccess = false;
  isLoading = true;
  private timeoutRef: ReturnType<typeof setTimeout> | null = null;
  private topicSubscription: Subscription | null = null;
  private readonly topic = '/topic/esp32';

  constructor(
    public activeModal: NgbActiveModal,
    private toast: ToastrService,
    private location: Location,
    private websocketService: WebsocketService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss(false);
    });
  }

  ngOnInit(): void {
    this.timeoutRef = setTimeout(() => this.cancelTask(), 10000);

    this.topicSubscription = this.websocketService.subscribeToTopic(this.topic).subscribe({
      next: (message: IMessage) => this.handleWebSocketMessage(message),
      error: () => this.handleWebSocketError()
    });
  }

  private handleWebSocketMessage(message: IMessage) {
    this.isLoading = false;
    this.clearTimeoutIfNeeded();
    const result: SocketSpringMessageCus = JSON.parse(message.body) as SocketSpringMessageCus;

    if (result && result.status) {
      this.isSuccess = true;
    } else {
      this.toast.error(result.message || 'Ghi dữ liệu thất bại', 'Thông báo');
    }
  }

  private handleWebSocketError() {
    this.isLoading = false;
    this.clearTimeoutIfNeeded();
    this.toast.error('Có lỗi xảy ra trong quá trình ghi, vui lòng thử lại', 'Thông báo');
  }

  private clearTimeoutIfNeeded() {
    if (this.timeoutRef) {
      clearTimeout(this.timeoutRef);
    }
  }

  cancelTask() {
    this.isLoading = false;
    this.clearTimeoutIfNeeded();

    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }

    this.websocketService.unsubscribeFromTopic(this.topic);
  }

  close() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    this.cancelTask();
  }

  protected readonly ICON_ATTENTION = ICON_ATTENTION;
  protected readonly ICON_SYNC_LARGE = ICON_SYNC_LARGE;
  protected readonly ICON_ERROR_LARGE = ICON_ERROR_LARGE;
}
