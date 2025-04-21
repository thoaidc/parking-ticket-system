import {Pagination} from './request.model';
import {Dayjs} from 'dayjs';

export interface Ticket {
  id: number;
  status: string;
  uid: string;
  type?: string;
  createdBy?: string;
  createdDate?: string;
}

export enum TicketStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  LOCKED = 'LOCKED',
  DELETED = 'DELETED'
}

export interface TicketScanLog {
  uid: string;
  type: string;
  result: string;
  message?: string;
  scanTime: string;
}

export enum TicketScanLogType {
  CHECKIN = 'CHECKIN',
  CHECKOUT = 'CHECKOUT'
}

export enum TicketScanLogResultType {
  VALID = 'SCAN_VALID',
  ERROR = 'SCAN_ERROR'
}

export interface SearchTicketRequest extends Pagination {
  status?: string;
  fromDate?: string;
  toDate?: string;
  keyword?: string;
}

export interface SearchTicketScanLogRequest extends Pagination {
  status?: string;
  fromDate?: string;
  toDate?: string;
  type?: string;
  result?: string;
}

export interface TicketFilter extends Pagination {
  status?: string;
  fromDate?: Dayjs;
  toDate?: Dayjs;
  keyword?: string;
}

export interface TicketScanLogFilter extends Pagination {
  status?: string;
  fromDate?: Dayjs;
  toDate?: Dayjs;
  type?: string;
  result?: string;
}

export interface UpdateTicketStatusRequest {
  uid: string;
  status: string;
}
