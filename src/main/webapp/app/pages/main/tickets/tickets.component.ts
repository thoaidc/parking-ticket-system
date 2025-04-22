import { Component, OnInit } from '@angular/core';
import {NgbDatepickerModule, NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import { TicketsService } from '../../../core/services/tickets.service';
import { ToastrService } from 'ngx-toastr';
import {
  SearchTicketRequest,
  Ticket,
  TICKET_STATUS,
  TicketFilter,
  TicketStatus,
  UpdateTicketStatusRequest
} from '../../../core/models/ticket.model';
import {UtilsService} from '../../../shared/utils/utils.service';
import {ICON_DELETE, ICON_PLAY, ICON_PLUS, ICON_RELOAD, ICON_SEARCH, ICON_STOP} from '../../../shared/utils/icon';
import {Authorities} from '../../../constants/authorities.constants';
import {ModalConfirmDialogComponent} from '../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {DatePipe, DecimalPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';
import {FormsModule} from '@angular/forms';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';

@Component({
  selector: 'app-tickets-management',
  standalone: true,
  imports: [
    DateFilterComponent,
    NgbDatepickerModule,
    NgbPagination,
    NgSelectModule,
    SafeHtmlPipe,
    NgIf,
    NgFor,
    HasAuthorityDirective,
    FormsModule,
    NgClass,
    DatePipe,
    NgbTooltip,
    DecimalPipe
  ],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent implements OnInit {
  private modalRef: NgbModalRef | undefined;
  periods: number = 1;
  tickets: Ticket[] = [];
  totalItems: any = 0;
  ticketsFilter: TicketFilter = {
    page: 1,
    size: 20,
    status: ''
  }

  isLoading = false;

  constructor(
    protected modalService: NgbModal,
    private ticketsService: TicketsService,
    protected utilsService: UtilsService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.periods = 1;
    this.onSearch();
  }

  onReload() {
    this.ticketsFilter = {
      page: 1,
      size: 20,
      status: ''
    }

    this.onSearch();
  }

  onTimeChange(even: any) {
    this.ticketsFilter.fromDate = even.fromDate;
    this.ticketsFilter.toDate = even.toDate;
    this.periods = even.periods;
    this.onSearch();
  }

  onSearch() {
    this.ticketsFilter.page = 1;
    this.searchTickets();
  }

  searchTickets() {
    const searchTicketsRequest: SearchTicketRequest = {
      page: this.ticketsFilter.page - 1,
      size: this.ticketsFilter.size
    }

    if (Object.values(TicketStatus).includes(this.ticketsFilter.status as TicketStatus)) {
      searchTicketsRequest.status = this.ticketsFilter.status;
    }

    if (this.ticketsFilter.fromDate) {
      const fromDate = this.ticketsFilter.fromDate.toString();
      searchTicketsRequest.fromDate = this.utilsService.convertToDateString(fromDate, 'YYYY/MM/DD');
    }

    if (this.ticketsFilter.toDate) {
      const toDate = this.ticketsFilter.toDate.toString();
      searchTicketsRequest.toDate = this.utilsService.convertToDateString(toDate, 'YYYY/MM/DD');
    }

    this.ticketsService.getTicketsWithPaging(searchTicketsRequest).subscribe((response) => {
      this.tickets = [];

      if (response && response.result as Ticket[]) {
        this.tickets = response.result as Ticket[];
        this.totalItems = response.total || 0;
      }
    });
  }

  loadMore($event: any) {
    this.ticketsFilter.page = $event;
    this.searchTickets();
  }

  createNewTicket() {
    this.ticketsService.createNewTicketAndWriteNFC().subscribe(response => {
      if (response && response.status && response.result as string) {
        this.toast.success('Tạo yêu cầu thành công, vui lòng để thẻ vào trong đầu đọc NFC', 'Thông báo');
        console.log("Ticket UID: ", response.result);
      } else {
        this.toast.error('Tạo yêu cầu thất bại. Vui lòng thử lại sau', 'Thông báo');
      }
    });
  }

  updateTicketStatus(uid: string, status: string) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { backdrop: 'static' });

    if (status === TicketStatus.ACTIVE) {
      this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn mở hoạt động thẻ này?';
      this.modalRef.componentInstance.classBtn = 'save-button-dialog';
    } else if (status === TicketStatus.LOCKED) {
      this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn khóa thẻ này?';
      this.modalRef.componentInstance.classBtn = 'btn-delete';
    }

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        const updateTicketStatus: UpdateTicketStatusRequest = { uid: uid, status: status };

        this.ticketsService.updateTicketsStatus(updateTicketStatus).subscribe(response => {
          if (response && response.status) {
            this.toast.success('Cập nhật trạng thái thẻ thành công', 'Thông báo');
            this.onSearch();
          } else {
            this.toast.error(response.message || 'Cập nhật thất bại', 'Thông báo');
          }
        });
      }
    });
  }

  deleteTicket(uid: string) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { backdrop: 'static' });
    this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn xóa thẻ này?';
    this.modalRef.componentInstance.classBtn = 'btn-delete';

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        this.ticketsService.deleteTicket(uid).subscribe(response => {
          if (response && response.status) {
            this.toast.success('Xóa thẻ thành công', 'Thông báo');
            this.onSearch();
          } else {
            this.toast.error(response.message || 'Xóa thẻ thất bại', 'Thông báo');
          }
        });
      }
    });
  }

  protected readonly ICON_PLAY = ICON_PLAY;
  protected readonly ICON_STOP = ICON_STOP;
  protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly Authorities = Authorities;
  protected readonly TicketStatus = TicketStatus;
  protected readonly TICKET_STATUS = TICKET_STATUS;
  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
    protected readonly ICON_PLUS = ICON_PLUS;
}
