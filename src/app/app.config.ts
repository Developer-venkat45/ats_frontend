import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ConfirmationService, MessageService } from 'primeng/api';
import { authInterceptor } from './core/service/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync(), provideAnimationsAsync(), MessageService, ConfirmationService]
};
