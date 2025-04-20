import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Location, NgIf} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {AccountsService} from '../../../../core/services/accounts.service';
import {RolesService} from '../../../../core/services/roles.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../../../shared/utils/icon';
import {Authorities} from '../../../../constants/authorities.constants';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {AccountDetail} from '../../../../core/models/account.model';
import {Role, RolesFilter} from '../../../../core/models/role.model';

@Component({
  selector: 'app-modal-account-info',
  standalone: true,
  templateUrl: './modal-account-info.component.html',
  styleUrls: ['./modal-account-info.component.scss'],
  imports: [
    SafeHtmlPipe,
    HasAuthorityDirective,
    AlphanumericOnlyDirective,
    FormsModule,
    NgSelectModule,
    NgIf
  ]
})
export class ModalAccountInfoComponent implements OnInit {
  id: number = 0;
  accountDetail!: AccountDetail;
  roles: Role[] = [];
  isLoading = false;
  hide = true;

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    protected utilsService: UtilsService,
    private accountsService: AccountsService,
    private toast: ToastrService,
    private roleService: RolesService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss();
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.accountsService.getAccountDetail(this.id).subscribe(response => {
        if (response) {
          this.accountDetail = response;
        }
      });
    }

    this.getRoles();
  }

  onSave() {
    if (!this.accountDetail) {
      return;
    }

    if (!this.accountDetail.username) {
      this.toast.error('Tài khoản không được để trống', 'Thông báo');
      return;
    }

    if (!this.accountDetail.email) {
      this.toast.error('Email không được để trống', 'Thông báo');
      return;
    }

    if (this.accountDetail.id && this.accountDetail.id > 0) {
      if (!this.accountDetail.password) {
        this.toast.error('Mật khẩu không được để trống', 'Thông báo');
        return;
      } else if (!this.utilsService.validatePassword(this.accountDetail.password)) {
        return;
      }
    }

    if (!this.accountDetail.authorities || this.accountDetail.authorities.length == 0) {
      this.toast.error('Vai trò không được để trống', 'Thông báo');
      return;
    }

    // if (!this.id) {
    //   this.accountsService.createAccount(this.accountDetail).subscribe(value => {
    //     this.toast.success(value.message, 'Thông báo');
    //     this.activeModal.close(value);
    //   });
    // } else {
    //   this.accountsService.updateAccount(this.accountDetail).subscribe(value => {
    //     this.toast.success(value.message, 'Thông báo');
    //     this.activeModal.close(value);
    //   });
    // }
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  getRoles() {
    const searchRoleRequest: RolesFilter = {
      page: 0,
      size: 100
    }

    this.roleService.getRoles(searchRoleRequest).subscribe(response => {
      if (response && response.status && response.result as Role[]) {
        this.roles = response.result as Role[];
      } else {
        this.roles = [];
      }
    });
  }

  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
  protected readonly ICON_EYE = ICON_EYE;
  protected readonly Authorities = Authorities;
}
