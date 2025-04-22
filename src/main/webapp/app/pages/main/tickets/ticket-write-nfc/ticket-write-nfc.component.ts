import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Location, NgIf } from '@angular/common';
import { ICON_ATTENTION, ICON_ERROR_LARGE, ICON_SYNC_LARGE } from '../../../../shared/utils/icon';
import { SafeHtmlPipe } from '../../../../shared/pipes/safe-html.pipe';

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

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss(false);
    });
  }

  ngOnInit(): void {

  }

  close() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
  }

  protected readonly ICON_ATTENTION = ICON_ATTENTION;
  protected readonly ICON_SYNC_LARGE = ICON_SYNC_LARGE;
  protected readonly ICON_ERROR_LARGE = ICON_ERROR_LARGE;
}
