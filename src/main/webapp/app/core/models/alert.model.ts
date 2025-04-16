
export enum AlertType {
  INFO= 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger'
}

export interface Alert {
  id?: number;
  type: AlertType;
  message?: string;
  timeout?: number;
  toast?: boolean;
  position?: string;
  close?: (alerts: Alert[]) => void;
}
