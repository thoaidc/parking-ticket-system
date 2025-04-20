import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Location, NgIf} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {AccountsService} from '../../../../core/services/accounts.service';
import {UtilsService} from '../../../../shared/utils/utils.service';
import {ICON_EYE, ICON_EYE_CROSS} from '../../../../shared/utils/icon';
import {SafeHtmlPipe} from '../../../../shared/pipes/safe-html.pipe';
import {FormsModule} from '@angular/forms';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';

@Component({
  selector: 'app-modal-change-password',
  standalone: true,
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],
  imports: [
    SafeHtmlPipe,
    FormsModule,
    AlphanumericOnlyDirective,
    NgIf
  ]
})
export class ModalChangePasswordComponent implements OnInit {
  request: any = { password: null, rePassword: null, oldPassword: null };
  id: any = null;
  hideOldPassword: any = true;
  hidePassword: any = true;
  hideRePassword: any = true;
  isLoading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
    protected utilsService: UtilsService,
    private accountService: AccountsService,
    private toast: ToastrService
  ) {
    this.location.subscribe(() => {
      this.activeModal.dismiss();
    });
  }

  ngOnInit(): void {
    this.request.id = this.id;
  }

  onSave() {
    if (!this.request.oldPassword) {
      this.toast.error('Mật khẩu hiện tại không được để trống', 'Thông báo');
      return;
    }
    if (!this.request.password) {
      this.toast.error('Mật khẩu mới không được để trống', 'Thông báo');
      return;
    } else {
      if (!this.utilsService.validatePassword(this.request.password)) {
        return;
      }
    }
    if (!this.request.rePassword) {
      this.toast.error('Vui lòng xác nhận mật khẩu', 'Thông báo');
      return;
    } else {
      if (!this.utilsService.validatePassword(this.request.rePassword)) {
        return;
      }
    }
    if (this.request.password !== this.request.rePassword) {
      this.toast.error('Xác nhận mật khẩu không chính xác', 'Thông báo');
      return;
    }
    if (this.request.password === this.request.oldPassword) {
      this.toast.error('Mật khẩu mới không được trùng mật khẩu hiện tại', 'Thông báo');
      return;
    }
    // this.service.changePassword(this.request).subscribe(value => {
    //   this.activeModal.close(value.data);
    // });
  }
  dismiss() {
    this.activeModal.dismiss();
  }
  protected readonly ICON_EYE_CROSS = ICON_EYE_CROSS;
  protected readonly ICON_EYE = ICON_EYE;
}
