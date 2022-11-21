import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowsService {
  constructor() {}

  openUrlInNewTab(url: string): void {
    window.open(url, '_blank');
  }

  reloadWindow(): void {
    window.location.reload();
  }
}
