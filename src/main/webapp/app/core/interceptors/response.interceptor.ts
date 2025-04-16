import {inject} from '@angular/core';
import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn
} from '@angular/common/http';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { AuthServerProvider } from '../auth/auth-jwt.service';
// import { ConfirmDialogComponent } from '../../shared/modal/confirm-dialog/confirm-dialog.component';
// import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { Router } from '@angular/router';
// import { LoadingOption } from '../../shared/utils/loadingOption';
// import { ElementRefOption } from '../../shared/utils/elementRef';
// import { EASY_OTP, LOGIN } from '../../shared/utils/api.constant';
// import { DialogModal } from '../../shared/modal/dialogModal.model';
// import { SYNC_ICON } from '../../shared/utils/icon';
// import { TOKEN_EXPIRED_CODE } from '../../app.constants';

export const ResponseInterceptorFn: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  let checkModalRef: NgbModalRef;
  let isShowEPX: boolean;
  const router = inject(Router);
  const modalService = inject(NgbModal);
  const toastrService = inject(ToastrService);
  // const loading = inject(LoadingOption);
  // const elementRefOption = inject(ElementRefOption);
  // const authServerProvider = inject(AuthServerProvider);

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   if (this.checkModalRef) {
  //     this.checkModalRef.close();
  //   }
  //   this.loading.isLoading = request.url.includes(EASY_OTP);
  //   let isShowError = !(request.method === 'GET');
  //   return next.handle(request).pipe(
  //     tap(
  //       (event: HttpEvent<any>) => {
  //         if (event instanceof HttpResponse) {
  //           this.loading.isLoading = false;
  //           // Xử lý response thành công ở đây
  //           if (!event.body.status && event.body.message && !event.url?.includes(LOGIN) && isShowError) {
  //             this.toastrService.error(event.body.message[0].message, 'Thông báo');
  //           }
  //           if (this.elementRefOption.elementRef) {
  //             this.elementRefOption.elementRef.nativeElement.disabled = false;
  //             if (this.elementRefOption.oldIcon) {
  //               this.setIcon(this.elementRefOption.oldIcon);
  //             }
  //           }
  //           return event.body;
  //         }
  //       },
  //       error => {
  //         this.loading.isLoading = false;
  //         if (this.elementRefOption.elementRef) {
  //           this.elementRefOption.elementRef.nativeElement.disabled = false;
  //           if (this.elementRefOption.oldIcon) {
  //             this.setIcon(this.elementRefOption.oldIcon);
  //           }
  //         }
  //         if (error instanceof HttpErrorResponse) {
  //           const errorBody = error.error;
  //           if (errorBody && errorBody.message && !error.url?.includes(LOGIN)) {
  //             const messageCode = errorBody.message[0].code;
  //             // token hết hạn
  //             if (TOKEN_EXPIRED_CODE == messageCode) {
  //               const contentModel = new DialogModal(
  //                 'Đăng nhập thất bại',
  //                 'Phiên đăng nhập của quý khách đã hết hạn. Quý khách vui lòng đăng nhập lại để tiếp tục sử dụng phần mềm.',
  //                 'agree',
  //                 'arrow-up-from-bracket',
  //                 '',
  //                 true,
  //               );
  //               this.showErrorModel(contentModel);
  //               return;
  //             }
  //           }
  //           return errorBody;
  //         }
  //       },
  //     ),
  //     catchError((error: any) => {
  //       // Xử lý lỗi ở đây
  //       this.loading.isLoading = false;
  //       if (this.elementRefOption.elementRef) {
  //         this.elementRefOption.elementRef.nativeElement.disabled = false;
  //         if (this.elementRefOption.oldIcon) {
  //           this.setIcon(this.elementRefOption.oldIcon);
  //         }
  //       }
  //       if (error.url?.includes(EASY_OTP)) {
  //         return throwError('');
  //       }
  //       if (error.error && error.error.message) {
  //         if (isShowError) {
  //           if (error.error.message[0].message) {
  //             this.toastrService.error(error.error.message[0].message, 'Thông báo');
  //           } else if (error.error.message[0].code) {
  //             this.toastrService.error(error.error.message[0].code, 'Thông báo');
  //           }
  //         }
  //       }
  //       return throwError(error.error.message[0]);
  //     }),
  //   );
  //   // }
  // }
  //
  // showErrorModel(contentModel: DialogModal) {
  //   if (this.checkModalRef) {
  //     this.checkModalRef.close();
  //     this.modalService.dismissAll();
  //   }
  //   this.checkModalRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', backdrop: 'static' });
  //   this.checkModalRef.componentInstance.value = contentModel;
  //   this.isShowEPX = true;
  //   this.checkModalRef.componentInstance.formSubmit.subscribe(res => {
  //     if (res) {
  //       this.authServerProvider.logout();
  //       this.router.navigate(['./login']);
  //       this.isShowEPX = false;
  //       this.checkModalRef.close();
  //     }
  //   });
  // }
  //
  // setElementRef(el: any) {
  //   this.elementRefOption.elementRef = el;
  //   let innerHtml = this.elementRefOption.elementRef.nativeElement.innerHTML;
  //   if (innerHtml.lastIndexOf('<span') != -1) {
  //     let oldIcon = innerHtml.substring(0, innerHtml.lastIndexOf('<span'));
  //     this.setIcon(SYNC_ICON);
  //     this.elementRefOption.oldIcon = oldIcon;
  //   }
  // }
  //
  // setIcon(icon: any) {
  //   if (this.elementRefOption.elementRef) {
  //     let innerHtml = this.elementRefOption.elementRef.nativeElement.innerHTML;
  //     let oldText = innerHtml.substring(innerHtml.lastIndexOf('<span'));
  //     this.elementRefOption.elementRef.nativeElement.innerHTML = icon + oldText;
  //   }
  // }

  return next(req);
};
