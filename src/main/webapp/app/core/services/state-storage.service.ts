import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private previousPageKey = 'DCT_PARKING_TICKET_PREVIOUS_PAGE_URL';

  savePreviousPage(url: string): void {
    sessionStorage.setItem(this.previousPageKey, url);
  }

  getPreviousPage(): string | null {
    return sessionStorage.getItem(this.previousPageKey) as string | null;
  }

  clearPreviousPage(): void {
    sessionStorage.removeItem(this.previousPageKey);
  }
}
