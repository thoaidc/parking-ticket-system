import { Component, OnInit } from '@angular/core';
import { ICON_RELOAD, ICON_SEARCH } from '../../../../shared/utils/icon';
import { ToastrService } from 'ngx-toastr';
import {
  TicketScanLog,
  TicketScanLogFilter,
  TicketScanLogResultType,
  SearchTicketScanLogRequest,
  TicketScanLogType
} from '../../../../core/models/ticket.model';
import {TicketsService} from '../../../../core/services/tickets.service';
import {Authorities} from '../../../../constants/authorities.constants';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {DateFilterComponent} from '../../../../shared/components/date-filter/date-filter.component';
import {DatePipe, DecimalPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {PAGINATION_PAGE_SIZE} from '../../../../constants/common.constants';

@Component({
  selector: 'app-ticket-scan-logs',
  standalone: true,
  imports: [
    DateFilterComponent,
    NgIf,
    NgFor,
    NgSelectModule,
    FormsModule,
    SafeHtmlPipe,
    HasAuthorityDirective,
    NgbPagination,
    DecimalPipe,
    NgClass,
    DatePipe
  ],
  templateUrl: './ticket-scan-logs.component.html',
  styleUrls: ['./ticket-scan-logs.component.scss'],
})
export class TicketScanLogsComponent implements OnInit {
  periods: number = 1;
  totalItems: number = 0;
  isLoading = false;
  ticketScanLogs: TicketScanLog[] = [];
  logsFilter: TicketScanLogFilter = {
    page: 1,
    size: 10
  };

  constructor(
    private ticketService: TicketsService,
    private toastService: ToastrService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.onReload();
  }

  onReload() {
    this.periods = 1;
    this.logsFilter = {
      page: 1,
      size: 10
    };

    this.onSearch();
  }

  onTimeChange(even: any) {
    this.logsFilter.fromDate = even.fromDate;
    this.logsFilter.toDate = even.toDate;
    this.periods = even.periods;
    this.onSearch();
  }

  onSearch() {
    this.logsFilter.page = 1;
    this.getTicketScanLogs();
  }

  getTicketScanLogs() {
    const searchTicketScanLogsRequest: SearchTicketScanLogRequest = {
      page: this.logsFilter.page - 1,
      size: this.logsFilter.size
    }

    if (Object.values(TicketScanLogType).includes(this.logsFilter.type as TicketScanLogType)) {
      searchTicketScanLogsRequest.type = this.logsFilter.type;
    }

    if (Object.values(TicketScanLogResultType).includes(this.logsFilter.result as TicketScanLogResultType)) {
      searchTicketScanLogsRequest.result = this.logsFilter.result;
    }

    if (this.logsFilter.fromDate) {
      const fromDate = this.logsFilter.fromDate.toString();
      searchTicketScanLogsRequest.fromDate = this.utilsService.convertToDateString(fromDate, 'YYYY/MM/DD');
    }

    if (this.logsFilter.toDate) {
      const toDate = this.logsFilter.toDate.toString();
      searchTicketScanLogsRequest.toDate = this.utilsService.convertToDateString(toDate, 'YYYY/MM/DD');
    }

    this.ticketService.getTicketScanLogsWithPaging(searchTicketScanLogsRequest).subscribe((response) => {
      this.ticketScanLogs = [];

      if (response && response.result as TicketScanLog[]) {
        this.ticketScanLogs = response.result as TicketScanLog[];
        this.totalItems = response.total || 0;
      }
    });
  }

  loadMore($event: any) {
    this.logsFilter.page = $event;
    this.getTicketScanLogs();
  }

  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly Authorities = Authorities;
  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly Object = Object;
  protected readonly TicketScanLogResultType = TicketScanLogResultType;
  protected readonly TicketScanLogType = TicketScanLogType;
}
