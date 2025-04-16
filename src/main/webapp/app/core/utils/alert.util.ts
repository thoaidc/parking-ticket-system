import { Injectable, SecurityContext, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {Alert} from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertUtil {
  timeout = 5000;
  toast = false;
  position = 'top right';

  // Unique id for each alert. Starts from 0
  private alertId = 0;
  private alerts: Alert[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private ngZone: NgZone,
  ) {}

  clear(): void {
    this.alerts = [];
  }

  get(): Alert[] {
    return this.alerts;
  }

  /**
   * Adds alert to alerts array and returns added alert.
   * @param alert      Alert to add. If `timeout`, `toast` or `position` is missing then applying default value.
   * @param extAlerts  If missing then adding `alert` to `AlertService` internal array and alerts can be retrieved by `get()`.
   *                   Else adding `alert` to `extAlerts`.
   * @returns  Added alert
   */
  addAlert(alert: Alert, extAlerts?: Alert[]): Alert {
    alert.id = this.alertId++;
    alert.message = this.sanitizer.sanitize(SecurityContext.HTML, alert.message ?? '') ?? '';
    alert.toast = alert.toast ?? this.toast;
    alert.timeout = alert.timeout ?? this.timeout;
    alert.position = alert.position ?? this.position;

    alert.close = (alertsArray: Alert[]) => this.closeAlert(alert.id!, alertsArray);
    (extAlerts ?? this.alerts).push(alert);

    if (alert.timeout > 0) {
      // Workaround protractor waiting for setTimeout.
      // Reference https://www.protractortest.org/#/timeouts
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.closeAlert(alert.id!, extAlerts ?? this.alerts);
          });
        }, alert.timeout || this.timeout);
      });
    }

    return alert;
  }

  private closeAlert(alertId: number, extAlerts?: Alert[]): void {
    const alerts = extAlerts ?? this.alerts;
    const alertIndex = alerts.map(alert => alert.id).indexOf(alertId);

    // If found alert then remove
    if (alertIndex >= 0) {
      alerts.splice(alertIndex, 1);
    }
  }
}
