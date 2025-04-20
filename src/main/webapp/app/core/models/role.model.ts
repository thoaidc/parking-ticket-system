import {Pagination} from './request.model';

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface RoleDetail {
  id: number;
  name: string;
  code: string;
  createdByStr?: string;
  createdDateStr?: string;
  lastModifiedByStr?: string;
  lastModifiedDateStr?: string;
  permissions?: number[];
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
  id: number;
  name: string;
  code: string;
  disabled: boolean;
  checked: boolean;
  collapsed: boolean;
  children?: TreeViewItem[];
  parentId?: number[];
}
