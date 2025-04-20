import { Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { HttpParams } from '@angular/common/http';
// import { ROUTES } from '../../layouts/main/sidebar/route.config';
import { ToastrService } from 'ngx-toastr';
// import * as CryptoJS from 'crypto-js';
// import { SECRET_KEY_LOGIN } from '../../constants/common.constants';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private toast: ToastrService) {}

  convertToDateString(dateString: string, toFormat: string): string {
    const dateFormats = ['MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];
    const timeFormat = 'HH:mm:ss';
    let date;
    // Kiểm tra nếu dateString khớp với định dạng thời gian
    if (dayjs(dateString, timeFormat, true).isValid()) {
      date = dayjs(dateString, timeFormat, true);
    } else {
      // Kiểm tra nếu dateString khớp với các định dạng ngày
      date = dayjs(dateString, dateFormats, true);
    }
    if (!date.isValid()) {
      return '';
    }
    return date.format(toFormat);
  }

  getFromToMoment(date?: dayjs.Dayjs, isMaxDate?: boolean): any {
    if (date && Object.keys(date).length !== 0) {
      const date1 = dayjs(date);
      return {
        year: date1.year(),
        month: date1.month() + 1,
        day: date1.date(),
      };
    }
    const _date = isMaxDate ? null : dayjs();
    return _date ? { year: _date.year(), month: _date.month() + 1, day: _date.date() } : null;
  }

  getCurrentDate() {
    const _date = dayjs();
    return { year: _date.year(), month: _date.month() + 1, day: _date.date() };
  }

  findFirstAccessibleRoute(userPermissions?: string[]): string {
    // if (!userPermissions) {
    //   userPermissions = this.getUserRoles();
    // }
    //
    // for (const route of ROUTES) {
    //   const accessiblePath = this.findAccessiblePath(route, userPermissions);
    //
    //   if (accessiblePath || accessiblePath === '') {
    //     return accessiblePath;
    //   }
    // }

    return '';
  }

  // private findAccessiblePath(route: any, userPermissions: string[]): string | null {
  //   // Check if the route has permissions and the user has at least one valid permission
  //   if (route.permission) {
  //     const hasAccess = Array.isArray(route.permission)
  //       ? route.permission.some(permission => userPermissions.includes(permission))
  //       : userPermissions.includes(route.permission);
  //
  //     if (hasAccess) {
  //       if (route.submenu && route.submenu.length > 0) {
  //         const firstAccessibleSubPath = this.findAccessiblePath(route.submenu[0], userPermissions);
  //         return firstAccessibleSubPath ? route.path + firstAccessibleSubPath : route.path;
  //       }
  //
  //       return route.path;
  //     }
  //   }
  //
  //   // Check in submenu
  //   if (route.submenu && route.submenu.length > 0) {
  //     for (const subRoute of route.submenu) {
  //       const accessiblePath = this.findAccessiblePath(subRoute, userPermissions);
  //
  //       if (accessiblePath) {
  //         return route.path + accessiblePath;
  //       }
  //     }
  //   }
  //
  //   return null;
  // }

  // getUserRoles() {
  //   const jsonString = localStorage.getItem('jhi-roles');
  //
  //   try {
  //     return JSON.parse(jsonString) as string[];
  //   } catch (error) {
  //     return [];
  //   }
  // }

  // checkUserPermission(permission: string) {
  //   const userRoles = this.getUserRoles();
  //   return userRoles.includes(permission);
  // }
  //
  // getUserSystem() {
  //   const jsonString = localStorage.getItem('jhi-typeSystem');
  //   return Number(jsonString);
  // }

  // findFirstAccessibleRoute(userPermissions?: string[]): string {
  //   if (!userPermissions) {
  //     userPermissions = this.getUserRoles();
  //   }
  //
  //   for (const route of ROUTES) {
  //     const accessiblePath = this.findAccessiblePath(route, userPermissions);
  //
  //     if (accessiblePath || accessiblePath === '') {
  //       return accessiblePath;
  //     }
  //   }
  //
  //   return '';
  // }

  // private findAccessiblePath(route: any, userPermissions: string[]): string | null {
  //   // Check if the route has permissions and the user has at least one valid permission
  //   if (route.permission) {
  //     const hasAccess = Array.isArray(route.permission)
  //       ? route.permission.some(permission => userPermissions.includes(permission))
  //       : userPermissions.includes(route.permission);
  //
  //     if (hasAccess) {
  //       if (route.submenu && route.submenu.length > 0) {
  //         const firstAccessibleSubPath = this.findAccessiblePath(route.submenu[0], userPermissions);
  //         return firstAccessibleSubPath ? route.path + firstAccessibleSubPath : route.path;
  //       }
  //
  //       return route.path;
  //     }
  //   }
  //
  //   // Check in submenu
  //   if (route.submenu && route.submenu.length > 0) {
  //     for (const subRoute of route.submenu) {
  //       const accessiblePath = this.findAccessiblePath(subRoute, userPermissions);
  //
  //       if (accessiblePath) {
  //         return route.path + accessiblePath;
  //       }
  //     }
  //   }
  //
  //   return null;
  // }
  //
  // getFromToMoment(date?: dayjs.Dayjs, isMaxDate?: boolean): any {
  //   if (date && Object.keys(date).length !== 0) {
  //     const date1 = dayjs(date);
  //     return {
  //       year: date1.year(),
  //       month: date1.month() + 1,
  //       day: date1.date(),
  //     };
  //   }
  //   const _date = isMaxDate ? null : dayjs();
  //   return _date ? { year: _date.year(), month: _date.month() + 1, day: _date.date() } : null;
  // }

  // convertToDateString(dateString: string, toFormat: string): string {
  //   const dateFormats = ['MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'];
  //   const timeFormat = 'HH:mm:ss';
  //   let date;
  //   // Kiểm tra nếu dateString khớp với định dạng thời gian
  //   if (dayjs(dateString, timeFormat, true).isValid()) {
  //     date = dayjs(dateString, timeFormat, true);
  //   } else {
  //     // Kiểm tra nếu dateString khớp với các định dạng ngày
  //     date = dayjs(dateString, dateFormats, true);
  //   }
  //   if (!date.isValid()) {
  //     return null;
  //   }
  //   return date.format(toFormat);
  // }

  // getCurrentDate() {
  //   const _date = dayjs();
  //   return { year: _date.year(), month: _date.month() + 1, day: _date.date() };
  // }
  //
  // getValueLocalStorage(type: any) {
  //   let value = null;
  //   let raw = localStorage.getItem(type);
  //   if (raw) {
  //     value = raw.replace(/^"(.*)"$/, '$1');
  //   }
  //   return value;
  // }
  //
  // createRequestOption = (req?: any): HttpParams => {
  //   let options: HttpParams = new HttpParams();
  //   if (req) {
  //     Object.keys(req).forEach(key => {
  //       if (key !== 'sort' && req[key] !== null && req[key] !== undefined) {
  //         for (const value of [].concat(req[key]).filter(v => v !== '')) {
  //           options = options.append(key, value);
  //         }
  //       }
  //     });
  //
  //     if (req.sort) {
  //       req.sort.forEach((val: string) => {
  //         options = options.append('sort', val);
  //       });
  //     }
  //   }
  //   return options;
  // };

  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    const isValidPassword = password.length >= minLength && hasLowerCase && hasUpperCase && hasDigit && hasSpecialChar;

    if (!isValidPassword) {
      this.toast.error('Mật khẩu phải bao gồm ít nhất 12 ký tự bao gồm chữ, số, ký tự in hoa và ký tự đặc biệt');
    }

    return isValidPassword;
  }

  // static encryptAES(plainText: string): string {
  //   try {
  //     const key = CryptoJS.enc.Utf8.parse(SECRET_KEY_LOGIN);
  //     const encrypted = CryptoJS.AES.encrypt(plainText, key, {
  //       mode: CryptoJS.mode.ECB,
  //       padding: CryptoJS.pad.Pkcs7,
  //     });
  //     return encrypted.toString();
  //   } catch (error) {
  //     console.error('encryptAES error:', error);
  //     return '';
  //   }
  // }
}
