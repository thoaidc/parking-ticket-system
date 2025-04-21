import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbModalRef, NgbPagination, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import dayjs from 'dayjs/esm';
import { ModalAccountInfoComponent } from './modal-account-info/modal-account-info.component';
import { ToastrService } from 'ngx-toastr';
import { ModalChangePasswordComponent } from './modal-change-password/modal-change-password.component';
import {
  Account,
  ACCOUNT_STATUS,
  AccountStatus,
  UpdateAccountStatusRequest
} from '../../../core/models/account.model';
import {AccountsFilter, SearchAccountRequest} from '../../../core/models/account.model';
import {AccountsService} from '../../../core/services/accounts.service';
import {UtilsService} from '../../../shared/utils/utils.service';
import {AuthService} from '../../../core/services/auth.service';
import {Authorities} from '../../../constants/authorities.constants';
import {ModalConfirmDialogComponent} from '../../../shared/modals/modal-confirm-dialog/modal-confirm-dialog.component';
import {
  ICON_DELETE,
  ICON_KEY,
  ICON_PLAY,
  ICON_PLUS,
  ICON_RELOAD,
  ICON_SEARCH,
  ICON_STOP,
  ICON_UPDATE
} from '../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../shared/directives/has-authority.directive';
import {DatePipe, DecimalPipe, NgClass, NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {DateFilterComponent} from '../../../shared/components/date-filter/date-filter.component';
import {PAGINATION_PAGE_SIZE} from '../../../constants/common.constants';
import {LOCAL_USER_AUTHORITIES_KEY} from '../../../constants/local-storage.constants';
import {BaseResponse} from '../../../core/models/response.model';

@Component({
  selector: 'app-accounts-management',
  standalone: true,
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  imports: [
    SafeHtmlPipe,
    HasAuthorityDirective,
    DecimalPipe,
    FormsModule,
    NgSelectModule,
    NgbPagination,
    DateFilterComponent,
    DatePipe,
    NgClass,
    NgIf,
    NgFor,
    NgbTooltip
  ]
})
export class AccountsComponent implements OnInit {
  private modalRef: NgbModalRef | undefined;
  AccountStatus = AccountStatus;
  accountsFilter: AccountsFilter = {
    page: 1,
    size: 20,
    status: '',
    fromDate: dayjs(),
    toDate: dayjs(),
  };
  accounts: Account[] = [];
  totalItems = 0;
  userName = '';
  periods = 1;
  isLoading = false;

  constructor(
    protected modalService: NgbModal,
    private accountService: AccountsService,
    private utilsService: UtilsService,
    private toast: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.onReload();

    this.authService.subscribeAuthenticationState().subscribe((account: Account |  null) => {
      if (account) {
        this.userName = account.username || '';
      } else {
        this.userName = '';
      }
    });
  }

  onReload() {
    this.periods = 1;
    this.accountsFilter = {
      page: 1,
      size: 20,
      status: '',
      fromDate: dayjs(),
      toDate: dayjs()
    };

    this.onSearch();
  }

  onTimeChange(even: any) {
    this.accountsFilter.fromDate = even.fromDate;
    this.accountsFilter.toDate = even.toDate;
    this.periods = even.periods;
    this.onSearch();
  }

  onSearch() {
    this.accountsFilter.page = 1;
    this.getAccounts();
  }

  getAccounts() {
    const searchAccountsRequest: SearchAccountRequest = {
      page: this.accountsFilter.page - 1,
      size: this.accountsFilter.size,
      keyword: this.accountsFilter.keyword
    };

    if (Object.values(AccountStatus).includes(this.accountsFilter.status as AccountStatus)) {
      searchAccountsRequest.status = this.accountsFilter.status;
    }

    if (this.accountsFilter.fromDate) {
      const fromDate = this.accountsFilter.fromDate.toString();
      searchAccountsRequest.fromDate = this.utilsService.convertToDateString(fromDate, 'YYYY/MM/DD');
    }

    if (this.accountsFilter.toDate) {
      const toDate = this.accountsFilter.toDate.toString();
      searchAccountsRequest.toDate = this.utilsService.convertToDateString(toDate, 'YYYY/MM/DD');
    }

    this.accountService.getAccountsWithPaging(searchAccountsRequest).subscribe((response) => {
      this.accounts = [];

      if (response && response.result as Account[]) {
        this.accounts = response.result as Account[];
        this.totalItems = response.total || 0;
      }
    });
  }

  onAccountDetail(accountId?: number) {
    let roles: string[] = JSON.parse(localStorage.getItem(LOCAL_USER_AUTHORITIES_KEY) || '') as string[];

    if (roles && (!roles.includes(Authorities.ACCOUNT_VIEW) || !roles.includes(Authorities.ROLE_VIEW))) {
      this.toast.error('Bạn không có quyền truy cập chức năng này', 'Thông báo');
      return;
    }

    this.modalRef = this.modalService.open(ModalAccountInfoComponent, { size: 'lg', backdrop: 'static' });
    this.modalRef.componentInstance.accountId = accountId || 0;
    this.modalRef.closed.subscribe(() => this.getAccounts());
  }

  updateUserStatus(accountId: any, status: any) {
    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, { backdrop: 'static' });

    switch (status) {
      case AccountStatus.INACTIVE: {
        this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn mở hoạt động tài khoản này?';
        this.modalRef.componentInstance.classBtn = 'save-button-dialog';
        break;
      }

      case AccountStatus.ACTIVE: {
        this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn ngưng hoạt động tài khoản này?';
        this.modalRef.componentInstance.classBtn = 'btn-delete';
        break;
      }
    }

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        const request: UpdateAccountStatusRequest = { id: accountId, status: status };

        this.accountService.updateAccountStatus(request).subscribe(response => {
          if (response && response.status) {
            this.toast.success(response.message, 'Thông báo');
            this.getAccounts();
          } else {
            this.toast.error(response.message || 'Cập nhật thất bại!');
          }
        });
      }
    });
  }

  changePassword(account: any) {
    this.modalRef = this.modalService.open(ModalChangePasswordComponent, {backdrop: 'static'});
    this.modalRef.componentInstance.accountId = account.id;

    this.modalRef.closed.subscribe((response?: BaseResponse<any>) => {
      if (response && response.status) {
        if (account.username.toLowerCase() === this.userName.toLowerCase()) {
          this.toast.success('Đổi mật khẩu thành công, vui lòng đăng nhập lại', 'Thông báo');
          this.authService.logout();
        } else {
          this.toast.success('Đổi mật khẩu thành công', 'Thông báo');
          this.getAccounts();
        }
      }

      if (response && !response.status) {
        this.toast.error('Cập nhật thất bại', 'Thông báo');
      }
    });
  }

  deleteUser(accountId: any) {
    if (!accountId) {
      this.toast.success('Không tìm thấy thông tin tài khoản', 'Thông báo');
      return;
    }

    this.modalRef = this.modalService.open(ModalConfirmDialogComponent, {backdrop: 'static'});
    this.modalRef.componentInstance.title = 'Bạn có chắc chắn muốn xoá tài khoản này?';
    this.modalRef.componentInstance.classBtn = 'btn-delete';

    this.modalRef.closed.subscribe((isConfirmed?: boolean) => {
      if (isConfirmed) {
        this.accountService.deleteAccount(accountId).subscribe(response => {
          if (response.status) {
            this.toast.success('Xóa tài khoản thành công', 'Thông báo');
            this.getAccounts();
          } else {
            this.toast.error(response.message, 'Xóa tài khoản thất bại');
          }
        });
      }
    });
  }

  loadMore($event: any) {
    this.accountsFilter.page = $event;
    this.getAccounts();
  }

  protected readonly ICON_RELOAD = ICON_RELOAD;
  protected readonly ICON_SEARCH = ICON_SEARCH;
  protected readonly ICON_PLUS = ICON_PLUS;
  protected readonly ICON_UPDATE = ICON_UPDATE;
  protected readonly ICON_STOP = ICON_STOP;
  protected readonly ICON_PLAY = ICON_PLAY;
  protected readonly ICON_KEY = ICON_KEY;
  protected readonly Authorities = Authorities;
  protected readonly ICON_DELETE = ICON_DELETE;
  protected readonly PAGINATION_PAGE_SIZE = PAGINATION_PAGE_SIZE;
  protected readonly ACCOUNT_STATUS = ACCOUNT_STATUS;
}
