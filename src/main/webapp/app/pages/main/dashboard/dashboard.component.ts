import {Component, OnInit} from '@angular/core';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {
  TICKET_SCAN_LOG_TYPE,
  TicketScanLogsReport,
  TicketScanLogsReportFilter
} from '../../../core/models/ticket.model';
import dayjs from 'dayjs/esm';
import {ToastrService} from 'ngx-toastr';
import {UtilsService} from '../../../shared/utils/utils.service';
import {TicketsService} from '../../../core/services/tickets.service';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import {Dayjs} from 'dayjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SafeHtmlPipe,
    DateFilterComponent,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public chart: any;
  periods: any = 1;

  listType: { value: string, name: string, disabled: boolean }[] = [
    {
      value: 'MONTH',
      name: 'Theo tháng',
      disabled: false
    },
    {
      value: 'DAY',
      name: 'Theo ngày',
      disabled: false
    },
    {
      value: 'HOURS',
      name: 'Theo giờ',
      disabled: false
    },
  ];

  ticketScanLogsFilter: TicketScanLogsReportFilter = {
    groupType: 'HOURS',
    type: ''
  };

  fromDate: Dayjs = dayjs().startOf('day');
  toDate: Dayjs = dayjs().endOf('day');
  ticketScanLogs: TicketScanLogsReport[] = [];

  constructor(
    private ticketService: TicketsService,
    protected utilService: UtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    Chart.register(
      BarController,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
      Title
    );

    this.getTicketScanLogsCountByType();
  }

  onTimeChange(even: any) {
    this.fromDate = even.fromDate;
    this.toDate = even.toDate;
    this.periods = even.periods;
    this.onChangeValue();
  }

  onChangeValue() {
    if (!this.ticketScanLogsFilter.groupType) {
      this.toastr.error('Loại thống kê không được để trống', 'Thông báo');
      return;
    }

    if (!this.fromDate) {
      this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
      return;
    }

    if (!this.toDate) {
      if (this.periods === 8) {
        this.toDate = dayjs(dayjs(), 'DD/MM/YYYY');
      } else {
        this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
        return;
      }
    }

    if (this.toDate.diff(this.fromDate, 'day') > 31) {
      if (this.ticketScanLogsFilter.groupType != 'HOURS') {
        this.ticketScanLogsFilter.groupType = 'MONTH';
        this.disabledType(true);
      }
    } else {
      this.disabledType(false);
    }

    this.getTicketScanLogsCountByType();
  }

  disabledType(isDisabledMonth: boolean) {
    this.listType.forEach(type => {
      if (type.value === 'DAY') {
        type.disabled = isDisabledMonth;
      }
    });

    this.listType = JSON.parse(JSON.stringify(this.listType));
  }

  getTicketScanLogsCountByType() {
    this.ticketScanLogsFilter.fromDate = this.utilService.convertToDateString(this.fromDate.toString(), 'YYYY-MM-DD HH:mm:ss');
    this.ticketScanLogsFilter.toDate = this.utilService.convertToDateString(this.toDate.toString(), 'YYYY-MM-DD HH:mm:ss');
    this.ticketScanLogs = [];

    this.ticketService.getTicketScanLogStatistics(this.ticketScanLogsFilter).subscribe(ticketScanLogsReport => {
      if (ticketScanLogsReport && ticketScanLogsReport.length > 0) {
        this.ticketScanLogs = ticketScanLogsReport;
        this.changeChartValue();
      } else {
        this.toastr.warning('Không tìm thấy dữ liệu thống kê', 'Thông báo');
      }
    });
  }

  changeChartValue() {
    let label: string[] = [];
    let totalLogSuccess: number[] = [];
    let totalLogError: number[] = [];

    this.ticketScanLogs.forEach(log => {
      totalLogSuccess.push(log.totalLogSuccess || 0);
      totalLogError.push(log.totalLogError || 0);

      switch (this.ticketScanLogsFilter.groupType) {
        case 'MONTH':
          label.push('Tháng ' + log.time);
          break;
        case 'DAY':
          label.push(this.utilService.convertToDateString(log.time, 'DD/MM') || log.time);
          break;
        case 'HOURS':
          label.push(log.time + 'h');
          break;
        default:
          label.push('-');
      }
    });

    this.rewriteChart(label, totalLogSuccess, totalLogError);
  }

  rewriteChart(label: string[], totalLogSuccess: number[], totalLogError: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Hợp lệ',
            data: totalLogSuccess,
            backgroundColor: '#a22600',
            borderColor: '#a22600',
            borderWidth: 1,
            maxBarThickness: 70
          },
          {
            label: 'Không hợp lệ',
            data: totalLogError,
            backgroundColor: '#003d60',
            borderColor: '#003d60',
            borderWidth: 1,
            maxBarThickness: 70
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              autoSkip: true
            }
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: this.ticketScanLogsFilter.type !== 'HOURS' ? this.getRotationAngle(this.ticketScanLogs) : 0,
              minRotation: this.ticketScanLogsFilter.type !== 'HOURS' ? this.getRotationAngle(this.ticketScanLogs) : 0,
            }
          }
        },
        plugins: {
          tooltip: {
            enabled: this.ticketScanLogs.length > 0
          }
        }
      }
    });
  }

  getRotationAngle(data: any[], threshold: number = 20) {
    if (data.length >= threshold) {
      return 45;
    }

    return 0;
  }

  protected readonly TICKET_SCAN_LOG_TYPE = TICKET_SCAN_LOG_TYPE;
}
