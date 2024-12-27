import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable, catchError, switchMap, filter, take, throwError, from, Subject, of } from 'rxjs';
import { inject } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


let isRefreshingToken = false;
let refreshTokenInProgress = new Subject<boolean>();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const confirmationService = inject(ConfirmationService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  const dashboardService = inject(DashboardService);
  const myToken = localStorage.getItem('access_token');

  // if (!myToken) {
  //   //localStorage.clear();
  //   //router.navigate(['/login']);
  //   return of();
  //   //return throwError(() => new Error('Authentication token is missing. Please log in.'));
  // }


  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${myToken}`,
    },
  });

  return next(cloneRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isRefreshingToken) {
          isRefreshingToken = true;

          return new Observable<HttpEvent<unknown>>((observer) => {
            confirmationService.confirm({
              message: 'Your session has expired. Do you want to continue?',
              header: 'Confirmation',
              accept: () => {
                from(dashboardService.refreshToken()).pipe(
                  switchMap((newToken: string) => {
                    isRefreshingToken = false;
                    refreshTokenInProgress.next(true);
                    dashboardService.refreshTokenSubject.next(newToken);

                    const newCloneRequest = req.clone({
                      setHeaders: {
                        Authorization: `Bearer ${newToken}`,
                      },
                    });

                    return next(newCloneRequest);
                  }),
                  catchError((refreshError) => {
                    isRefreshingToken = false;
                    refreshTokenInProgress.next(false);
                    observer.error(refreshError);
                    return throwError(refreshError);
                  })
                ).subscribe({
                  next: (event) => observer.next(event),
                  error: (err) => observer.error(err),
                  complete: () => observer.complete()
                });
              },
              reject: () => {
                isRefreshingToken = false;
                //localStorage.clear();
                localStorage.removeItem('access_token');
                router.navigate(['/login']);
                observer.error(error);
              }
            });
          });
        } else {
          return refreshTokenInProgress.pipe(
            filter(isSuccess => isSuccess),
            take(1),
            switchMap(() => {
              const newToken = dashboardService.refreshTokenSubject.getValue();
              const newCloneRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(newCloneRequest);
            })
          );
        }
      } else {
        return throwError(error);
      }
    })
  );
};