import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {NgFor, NgIf} from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RolesService } from '../../../../core/services/roles.service';
import {Authorities} from '../../../../constants/authorities.constants';
import {HasAuthorityDirective} from '../../../../shared/directives/has-authority.directive';
import {FormsModule} from '@angular/forms';
import {TreeViewComponent} from '../tree-view/tree-view.component';
import {AlphanumericOnlyDirective} from '../../../../shared/directives/alphanumeric-only.directive';
import {RoleDetail, TreeViewItem} from '../../../../core/models/role.model';

@Component({
  selector: 'app-create-roles',
  standalone: true,
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss'],
  imports: [
    HasAuthorityDirective,
    FormsModule,
    TreeViewComponent,
    AlphanumericOnlyDirective,
    NgFor,
    NgIf
  ]
})
export class CreateRolesComponent implements OnInit {
  Authority = Authorities;
  roleDetail: any = { id: null, code: null, name: null, description: null };
  totalItems = 0;
  idRole?: any = 0;
  children: any = [];
  listSelected: any = [];
  disableButton = false;
  isView = false;

  constructor(
    private rolesService: RolesService,
    private toast: ToastrService,
    public activeModal: NgbActiveModal,
  ) {}

  async ngOnInit() {
    this.onSearch();
    if (this.idRole) {
      this.onRoleDetail(this.idRole);
    }
  }

  onSearch() {
    this.getPermission();
  }

  getPermission() {
    this.rolesService.getPermissions().subscribe((treeViewItems: TreeViewItem[]) => {
      this.children = treeViewItems;
      this.totalItems = treeViewItems.length;
    });
  }

  dismiss(value: any) {
    this.activeModal.close(value);
  }

  create() {
    this.roleDetail.permissions = this.listSelected;
    if (!this.checkRolePermission()) {
      return;
    }
    this.disableButton = true;
    const req = Object.assign({}, this.roleDetail);
    if (this.idRole > 0) {
      this.rolesService.update(req).subscribe(
        value => {
          this.toast.success(value.message, 'Thông báo');
          this.searchRolesComponent();
          this.dismiss(value);
          this.disableButton = false;
        },
        () => {
          this.disableButton = false;
        },
      );
    } else {
      this.rolesService.create(req).subscribe(
        value => {
          this.toast.success(value.message, 'Thông báo');
          this.searchRolesComponent();
          this.dismiss(value);
          this.disableButton = false;
        },
        () => {
          this.disableButton = false;
        },
      );
    }
  }

  checkRolePermission() {
    if (!this.roleDetail.code) {
      this.toast.error('Mã vai trò không được để trống', 'Thông báo');
      return false;
    }
    if (!this.roleDetail.name) {
      this.toast.error('Tên vai trò không được để trống', 'Thông báo');
      return false;
    }
    if (!this.roleDetail.permissions) {
      this.toast.error('Danh sách quyền không được để trống', 'Thông báo');
      return false;
    }
    return true;
  }

  onRoleDetail(id: any) {
    this.rolesService.getRoleDetail(id).subscribe((roleDetail: RoleDetail | null) => {
      if (roleDetail) {
        this.roleDetail = roleDetail;
        this.listSelected = roleDetail.permissions || [];
      }
    });
  }

  searchRolesComponent(): void {
    this.rolesService.triggerSearch();
  }

  receiveListSelected(data: number[]) {
    this.listSelected = data;
  }
}
