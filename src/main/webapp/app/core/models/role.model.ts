import {Pagination} from './request.model';

export interface Role {
  id?: string;
  name?: string;
  code: string;
}

export interface RoleDetail {
  id?: string;
  name?: string;
  code: string;
  createdByStr?: string;
  createdDateStr?: string;
  lastModifiedByStr?: string;
  lastModifiedDateStr?: string;
  permissions?: string[];
}

export interface CreateRoleRequest {
  name: string;
  code: string;
  permissionIds: number[];
}

export interface UpdateRoleRequest extends CreateRoleRequest {
  id: number;
}

export interface RolesFilter extends Pagination {
  code?: string;
  name?: string;
  keyword?: string;
}

export interface TreeViewItem {
  id: any;
  name: string;
  code: any;
  disabled: boolean;
  checked: boolean;
  collapsed: boolean;
  children?: TreeViewItem[];
  parentId?: any;
}
