import {Component, OnInit} from '@angular/core';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {TicketScanLogsReport, TicketScanLogsReportFilter} from '../../../core/models/ticket.model';
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
  periods: any = 4;

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
    fromDate: '',
    toDate: '',
    type: 'HOURS'
  };

  fromDate: dayjs.Dayjs | any;
  toDate: dayjs.Dayjs | any;
  ticketScanLogs: TicketScanLogsReport[] = [];

  constructor(
    private ticketService: TicketsService,
    protected utilService: UtilsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fromDate = dayjs(dayjs().subtract(1, 'month'), 'DD/MM/YYYY');
    this.toDate = dayjs(dayjs(), 'DD/MM/YYYY');

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
    if (!this.ticketScanLogsFilter.type) {
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

    if (typeof this.fromDate == 'string') {
      if (this.fromDate.length <= 9 && this.fromDate.length != 0) {
        return;
      }
      this.fromDate = dayjs(this.fromDate, 'DD/MM/YYYY');
    }

    if (typeof this.toDate == 'string') {
      if (this.toDate.length <= 9 && this.toDate.length != 0) {
        return;
      }
      this.toDate = dayjs(this.toDate, 'DD/MM/YYYY');
    }

    if (this.toDate.diff(this.fromDate, 'day') > 31) {
      if (this.ticketScanLogsFilter.type != 'HOURS') {
        this.ticketScanLogsFilter.type = 'MONTH';
        this.disabledType(true);
      }
    } else {
      this.disabledType(false);
    }

    this.getTicketScanLogsCountByType();
  }

  disabledType(isDisabledMonth: any) {
    this.listType.forEach(type => {
      if (type.value === 'DAY') {
        type.disabled = !!isDisabledMonth;
      }
    });

    this.listType = JSON.parse(JSON.stringify(this.listType));
  }

  getTicketScanLogsCountByType() {
    this.ticketScanLogsFilter.fromDate = this.utilService.convertToDateString(this.fromDate, 'YYYY-MM-DD');
    this.ticketScanLogsFilter.toDate = this.utilService.convertToDateString(this.toDate, 'YYYY-MM-DD');
    this.ticketScanLogs = [
      {
        time: '8',
        totalLogSuccess: 30,
        totalLogError: 2
      },
      {
        time: '9',
        totalLogSuccess: 45,
        totalLogError: 1
      },
      {
        time: '10',
        totalLogSuccess: 40,
        totalLogError: 3
      },
      {
        time: '11',
        totalLogSuccess: 35,
        totalLogError: 4
      }
    ];

    this.ticketScanLogsFilter.type = 'HOURS'

    // this.ticketService.getTicketScanLogsCountByType(this.ticketScanLogsFilter).subscribe(response => {
    //   if (response && response.status && response.result) {
    //     this.ticketScanLogs = response.result;
    //     this.changeChartValue();
    //   }
    // });

    this.changeChartValue();
  }

  changeChartValue() {
    let label: string[] = [''];
    let totalLogSuccess: number[] = [0];
    let totalLogError: number[] = [0];

    this.ticketScanLogs.forEach(value => {
      totalLogSuccess.push(value.totalLogSuccess || 0);
      totalLogError.push(value.totalLogError || 0);

      if (this.ticketScanLogsFilter.type === 'MONTH') {
        label.push('Tháng ' + value.time);
      } else if (this.ticketScanLogsFilter.type === 'DAY') {
        label.push(this.utilService.convertToDateString(value.time, 'DD/MM') || value.time);
      } else {
        label.push(value.time + 'h');
      }
    });

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
            maxBarThickness: 70,
          },
          {
            label: 'Không hợp lệ',
            data: totalLogError,
            backgroundColor: '#003d60',
            borderColor: '#003d60',
            borderWidth: 1,
            maxBarThickness: 70,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
            },
          },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: this.ticketScanLogsFilter.type !== 'HOURS' ? this.getRotationAngle(this.ticketScanLogs) : 0,
              minRotation: this.ticketScanLogsFilter.type !== 'HOURS' ? this.getRotationAngle(this.ticketScanLogs) : 0,
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: this.ticketScanLogs.length > 0,
          },
        },
      },
    });
  }

  getRotationAngle(data: any[], threshold: number = 20) {
    if (data.length >= threshold) {
      return 45;
    }

    return 0;
  }
}
