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

export const TICKET_STATUS = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: TicketStatus.ACTIVE,
    name: 'Hoạt động',
  },
  {
    value: TicketStatus.EXPIRED,
    name: 'Hết hạn',
  },
  {
    value: TicketStatus.LOCKED,
    name: 'Đã bị khóa'
  }
];

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

export const TICKET_SCAN_LOG_TYPE = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: TicketScanLogType.CHECKIN,
    name: 'CHECKIN',
  },
  {
    value: TicketScanLogType.CHECKOUT,
    name: 'CHECKOUT',
  }
];

export enum TicketScanLogResultType {
  VALID = 'SCAN_VALID',
  ERROR = 'SCAN_ERROR'
}

export const TICKET_SCAN_LOG_RESULT_TYPE = [
  {
    value: '',
    name: 'Tất cả',
  },
  {
    value: TicketScanLogResultType.VALID,
    name: 'Hợp lệ',
  },
  {
    value: TicketScanLogResultType.ERROR,
    name: 'Không hợp lệ',
  }
];

export interface SearchTicketRequest extends Pagination {
  status?: string;
  fromDate?: string;
  toDate?: string;
  keyword?: string;
}

export interface SearchTicketScanLogRequest extends Pagination {
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
  fromDate?: Dayjs;
  toDate?: Dayjs;
  type?: string;
  result?: string;
}

export interface TicketScanLogsReportFilter {
  fromDate: string;
  toDate: string;
  type: string;
}

export interface UpdateTicketStatusRequest {
  uid: string;
  status: string;
}

export interface TicketScanLogsReport {
  time: string,
  totalLogSuccess: number,
  totalLogError: number
}
