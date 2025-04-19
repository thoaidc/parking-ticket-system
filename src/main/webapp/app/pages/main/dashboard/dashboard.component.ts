import { Component } from '@angular/core';
import {ICON_DASHBOARD} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    SafeHtmlPipe
  ]
})
export class DashboardComponent {
  // public chart: any;
  // protected readonly DASHBOARD_ICON = DASHBOARD_ICON;
  // ADMIN = User.TYPE_ADMIN;
  // filterOTPCount: FilterNumberOTPCount = {
  //   fromDate: dayjs().startOf('month'),
  //   toDate: dayjs(),
  //   type: DAY,
  //   systemId: Number(this.utilService.getValueLocalStorage('jhi-typeSystem')),
  // };
  // response: any = [];
  // fromDate: dayjs.Dayjs | any;
  // toDate: dayjs.Dayjs | any;
  // periods: any = 4;
  // filterSystem: any = { page: 1, size: 20, keyword: null };
  // systemList: any = [];
  // listType: any = [
  //   {
  //     value: MONTH,
  //     name: 'Theo tháng',
  //   },
  //   {
  //     value: DAY,
  //     name: 'Theo ngày',
  //   },
  //   {
  //     value: HOURS,
  //     name: 'Theo giờ',
  //   },
  // ];
  //
  // constructor(
  //   private service: ReportService,
  //   protected utilService: UtilsService,
  //   private toastr: ToastrService,
  //   private systemService: SystemManagementService,
  // ) {}
  //
  // ngOnInit(): void {
  //   this.fromDate = dayjs(dayjs().subtract(1, 'month'), 'DD/MM/YYYY');
  //   this.toDate = dayjs(dayjs(), 'DD/MM/YYYY');
  //
  //   if (this.utilService.checkUserPermission(Authority.SYSTEM_VIEW)) {
  //     this.getSystems();
  //   } else {
  //     this.getUserSystem();
  //   }
  //
  //   this.getListOTPCountByType();
  // }
  //
  // getUserSystem() {
  //   const systemId = this.utilService.getUserSystem();
  //
  //   if (systemId > 0) {
  //     this.systemService.findSystemById(systemId).subscribe(response => {
  //       this.systemList = [response];
  //     });
  //   } else {
  //     this.toastr.error('Không tìm thấy thông tin hệ thống của bạn', 'Lỗi');
  //   }
  // }
  //
  // getSystems() {
  //   const request = Object.assign({}, this.filterSystem);
  //   request.page = this.filterSystem.page - 1;
  //   this.systemService.getSystemWithPaging(request).subscribe(
  //     value => {
  //       this.systemList = [];
  //       if (value.body && value.body.data) {
  //         this.systemList = value.body.data;
  //       }
  //     },
  //     () => {
  //       this.systemList = [];
  //     },
  //   );
  // }
  //
  // onTimeChange(even: any) {
  //   this.fromDate = even.fromDate;
  //   this.toDate = even.toDate;
  //   this.periods = even.periods;
  //   this.onChangeValue();
  // }
  //
  // onChangeValue() {
  //   if (!this.filterOTPCount.type) {
  //     this.toastr.error('Loại thống kê không được để trống', 'Thông báo');
  //     return;
  //   }
  //   if (!this.fromDate) {
  //     this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
  //     return;
  //   }
  //   if (!this.toDate) {
  //     if (this.periods === 8) {
  //       this.toDate = dayjs(dayjs(), 'DD/MM/YYYY');
  //     } else {
  //       this.toastr.error('Thời gian tìm kiếm không được để trống', 'Thông báo');
  //       return;
  //     }
  //   }
  //   if (typeof this.fromDate == 'string') {
  //     if (this.fromDate.length <= 9 && this.fromDate.length != 0) {
  //       return;
  //     }
  //     this.fromDate = dayjs(this.fromDate, 'DD/MM/YYYY');
  //   }
  //   if (typeof this.toDate == 'string') {
  //     if (this.toDate.length <= 9 && this.toDate.length != 0) {
  //       return;
  //     }
  //     this.toDate = dayjs(this.toDate, 'DD/MM/YYYY');
  //   }
  //   if (this.toDate.diff(this.fromDate, 'day') > 31) {
  //     if (this.filterOTPCount.type != HOURS) {
  //       this.filterOTPCount.type = MONTH;
  //       this.disabledType(true);
  //     }
  //   } else {
  //     this.disabledType(false);
  //   }
  //
  //   this.getListOTPCountByType();
  // }
  //
  // disabledType(isDisabledMonth: any) {
  //   this.listType.forEach(type => {
  //     if (type.value == DAY) {
  //       type.disabled = !!isDisabledMonth;
  //     }
  //   });
  //   this.listType = JSON.parse(JSON.stringify(this.listType));
  // }
  //
  // getListOTPCountByType() {
  //   this.filterOTPCount.fromDate = this.utilService.convertToDateString(this.fromDate, 'YYYY-MM-DD');
  //   this.filterOTPCount.toDate = this.utilService.convertToDateString(this.toDate, 'YYYY-MM-DD');
  //   this.service.getNumberOTP(this.filterOTPCount).subscribe(
  //     res => {
  //       if (res && res.body && res.body.data) {
  //         this.response = [];
  //         if (res.body.data && res.body.data.listCountOTP) {
  //           this.response = res.body.data.listCountOTP;
  //         }
  //         let label: any = [];
  //         let totalSmsOTP: any = [];
  //         let totalSmartOTP: any = [];
  //         this.response.forEach(value => {
  //           if (value.totalSMSOTP !== null && value.totalSMSOTP !== undefined) {
  //             totalSmsOTP.push(value.totalSMSOTP);
  //           } else {
  //             totalSmsOTP.push(0);
  //           }
  //           if (value.totalSmartOTP !== null && value.totalSmartOTP !== undefined) {
  //             totalSmartOTP.push(value.totalSmartOTP);
  //           } else {
  //             totalSmartOTP.push(0);
  //           }
  //           if (this.filterOTPCount.type === MONTH) {
  //             let label1 = 'Tháng ' + value.time;
  //             label.push(label1);
  //           } else if (this.filterOTPCount.type === DAY) {
  //             let label2 = this.utilService.convertToDateString(value.time, 'DD/MM');
  //             label.push(label2);
  //           } else {
  //             let label3 = value.time + 'h';
  //             label.push(label3);
  //           }
  //         });
  //         // Hủy bỏ biểu đồ cũ nếu có
  //         if (this.chart) {
  //           this.chart.destroy();
  //         }
  //         // Tạo biểu đồ mới với dữ liệu mới
  //         this.chart = new Chart('canvas', {
  //           type: 'bar',
  //           data: {
  //             labels: label,
  //             datasets: [
  //               {
  //                 label: 'SMS',
  //                 data: totalSmsOTP,
  //                 backgroundColor: '#003d60',
  //                 borderColor: '#003d60',
  //                 borderWidth: 1,
  //                 maxBarThickness: 70,
  //               },
  //               {
  //                 label: 'SMART OTP',
  //                 data: totalSmartOTP,
  //                 backgroundColor: '#a22600',
  //                 borderColor: '#a22600',
  //                 borderWidth: 1,
  //                 maxBarThickness: 70,
  //               },
  //             ],
  //           },
  //           options: {
  //             scales: {
  //               yAxes: [
  //                 {
  //                   ticks: {
  //                     beginAtZero: true,
  //                   },
  //                 },
  //               ],
  //               xAxes: [
  //                 {
  //                   ticks: {
  //                     autoSkip: false,
  //                     maxRotation: this.filterOTPCount.type !== HOURS ? this.getRotationAngle(this.response) : 0,
  //                     minRotation: this.filterOTPCount.type !== HOURS ? this.getRotationAngle(this.response) : 0,
  //                   },
  //                 },
  //               ],
  //             },
  //             responsive: true,
  //             maintainAspectRatio: false,
  //           },
  //         });
  //       }
  //     },
  //     () => {
  //       this.response = [];
  //     },
  //   );
  // }
  //
  // getRotationAngle(data, threshold = 20) {
  //   // Nếu số lượng cột lớn hơn hoặc bằng ngưỡng, trả về 90 độ
  //   if (data.length >= threshold) {
  //     return 45;
  //   }
  //   // Nếu không, trả về 0 độ
  //   else {
  //     return 0;
  //   }
  // }
  //
  // protected readonly ICON_SEARCH = ICON_SEARCH;
  // protected readonly LIST_STATUS = LIST_STATUS;
  // protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly ICON_DASHBOARD = ICON_DASHBOARD;
}
