import {Dayjs} from 'dayjs';
import {Pagination} from './request.model';

export interface Account {
  id?: number;
  username: string;
  status: string;
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
  deviceId?: string;
  createdTime?: string;
  updatedTime?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  authorities?: string[];
}

export interface Authority {
  id: number;
  name?: string;
  code: string;
}

export interface AccountDetail {
  id: number;
  email: string;
  username: string;
  status: string;
  password?: string;
  phone?: string;
  address?: string;
  fullname?: string;
  deviceId?: string;
  createdByStr?: string;
  createdDateStr?: string;
  lastModifiedByStr?: string;
  lastModifiedDateStr?: string;
  authorities?: Authority[];
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED'
}

export const ACCOUNT_STATUS = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: AccountStatus.ACTIVE,
    name: 'Hoạt động',
  },
  {
    value: AccountStatus.INACTIVE,
    name: 'Ngưng hoạt động',
  },
  {
    value: AccountStatus.LOCKED,
    name: 'Đã bị khóa'
  }
];

export interface SearchAccountRequest extends Pagination {
  status?: string;
  fromDate?: string;
  toDate?: string;
  keyword?: string;
}

export interface AccountsFilter extends Pagination {
  status?: string;
  fromDate?: Dayjs;
  toDate?: Dayjs;
  keyword?: string;
}

export interface CreateAccountRequest {
  username: string;
  email: string;
  password: string;
  fullname?: string;
  address?: string;
  phone?: string;
  roleIds: number[];
}

export interface UpdateAccountRequest {
  id: number;
  username: string;
  email: string;
  status: string;
  phone?: string;
  fullname?: string;
  address?: string;
  roleIds: number[];
}

export interface UpdateAccountStatusRequest {
  id: number;
  status: string;
}

export interface UpdateAccountPasswordRequest {
  id: number;
  oldPassword: string;
  newPassword: string;
}
