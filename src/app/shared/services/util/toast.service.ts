import { Injectable } from '@angular/core';
import { HotToastService, ToastConfig, ToastType } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: HotToastService) {}

  public open(
    message: string,
    dismissible: boolean,
    duration?: number,
    type?: ToastType
  ) {
    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: duration ? duration : 2000,
      dismissible: dismissible,
      theme: 'snackbar',
    };
    if (type === 'success' || type === 'error' || type === 'loading') {
      this.toast.close();
    }

    // 'success' | 'error' | 'loading' | 'blank' | 'warning' | 'info';
    switch (type) {
      case 'success':
        this.toast.success(message, config);
        break;
      case 'error':
        this.toast.error(message, config);
        break;
      case 'loading':
        this.toast.loading(message, config);
        break;
      case 'warning':
        this.toast.warning(message, config);
        break;
      case 'info':
        this.toast.info(message, config);
        break;

      default:
        this.toast.show(message, config);
        break;
    }
  }

  loading(message: string) {
    this.toast.close();
    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: 30 * 1000,
      dismissible: false,
      theme: 'snackbar',
    };
    this.toast.loading(message, config);
  }

  warning(message: string) {
    this.toast.close();
    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: 5 * 1000,
      dismissible: true,
      theme: 'snackbar',
    };
    this.toast.warning(message, config);
  }

  info(message: string) {
    this.toast.close();
    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: 5 * 1000,
      dismissible: true,
      theme: 'snackbar',
    };
    this.toast.warning(message, config);
  }

  error(message: string) {
    this.toast.close();

    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: 60 * 1000,
      dismissible: true,
      theme: 'snackbar',
    };
    this.toast.error(message, config);
  }

  success(message: string) {
    this.toast.close();
    let config: Partial<ToastConfig> = {
      position: 'bottom-center',
      duration: 3 * 1000,
      dismissible: false,
      theme: 'snackbar',
    };
    this.toast.success(message, config);
  }
}
