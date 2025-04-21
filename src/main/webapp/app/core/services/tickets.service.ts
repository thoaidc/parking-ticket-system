import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ApplicationConfigService} from '../config/application-config.service';
import {
  API_TICKETS_MANAGEMENT,
  API_TICKETS_SCAN_LOGS,
  API_TICKETS_UPDATE_STATUS,
  API_TICKETS_WRITE_NFC
} from '../../constants/api.constants';
import {BaseResponse} from '../models/response.model';
import {createSearchRequestParams} from '../utils/request.util';
import {SearchTicketRequest, SearchTicketScanLogRequest, Ticket, TicketScanLog} from '../models/ticket.model';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService
  ) {}

  private ticketsUrl = this.applicationConfigService.getEndpointFor(API_TICKETS_MANAGEMENT);
  private ticketWriteNFCUrl = this.applicationConfigService.getEndpointFor(API_TICKETS_WRITE_NFC);
  private ticketUpdateStatusUrl = this.applicationConfigService.getEndpointFor(API_TICKETS_UPDATE_STATUS);
  private ticketScanLogsUrl = this.applicationConfigService.getEndpointFor(API_TICKETS_SCAN_LOGS);

  getTicketsWithPaging(searchTicketRequest: SearchTicketRequest): Observable<BaseResponse<Ticket[]>> {
    const params = createSearchRequestParams(searchTicketRequest);
    return this.http.get<BaseResponse<Ticket[]>>(`${this.ticketsUrl}`, { params: params });
  }

  getTicketScanLogsWithPaging(searchRequest: SearchTicketScanLogRequest): Observable<BaseResponse<TicketScanLog[]>> {
    const params = createSearchRequestParams(searchRequest);
    return this.http.get<BaseResponse<TicketScanLog[]>>(`${this.ticketScanLogsUrl}`, { params: params });
  }

  writeNFC(uid: string): Observable<BaseResponse<any>> {
    return this.http.post<BaseResponse<any>>(`${this.ticketWriteNFCUrl}/${uid}`, {});
  }

  updateTicketsStatus(updateTicketStatusRequest: any): Observable<BaseResponse<any>> {
    return this.http.put<BaseResponse<any>>(`${this.ticketUpdateStatusUrl}`, updateTicketStatusRequest);
  }

  deleteTicket(uid: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.ticketsUrl}/${uid}`);
  }
}
