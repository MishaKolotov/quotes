import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import { networkStore } from './network.store';

@Injectable({ providedIn: 'root' })
export class NetworkRepository {
  isOnline$ = networkStore.pipe(select((state) => state.isOnline));
  wasOffline$ = networkStore.pipe(select((state) => state.wasOffline));

  setOnline(): void {
    networkStore.update((state) => {
      return {
        ...state,
        isOnline: true,
        wasOffline: state.wasOffline || !state.isOnline,
      };
    });
  }

  setOffline(): void {
    networkStore.update((state) => {
      return {
        ...state,
        isOnline: false,
        wasOffline: true,
      };
    });
  }

  initialize(): void {
    const isOnline = navigator.onLine;
    networkStore.update((state) => ({
      ...state,
      isOnline,
      wasOffline: false,
    }));

    window.addEventListener('online', () => this.setOnline());
    window.addEventListener('offline', () => this.setOffline());
  }
}

