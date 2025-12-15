import { createStore, withProps } from '@ngneat/elf';

export interface NetworkState {
  isOnline: boolean;
  wasOffline: boolean;
}

const initialState: NetworkState = {
  isOnline: navigator.onLine,
  wasOffline: false,
};

export const networkStore = createStore(
  { name: 'network' },
  withProps<NetworkState>(initialState)
);

