import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { NetworkRepository, networkStore } from '@quotes-app/shared/state';

describe('NetworkRepository', () => {
  let repo: NetworkRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkRepository],
    });
    repo = TestBed.inject(NetworkRepository);

    networkStore.update((state) => ({ ...state, isOnline: true, wasOffline: false }));
  });

  it('should expose isOnline$ and wasOffline$', (done) => {
    repo.isOnline$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
  });

  it('should set online state', (done) => {
    networkStore.update((state) => ({ ...state, isOnline: false, wasOffline: true }));

    repo.setOnline();

    repo.isOnline$.pipe(take(1)).subscribe((isOnline) => {
      expect(isOnline).toBe(true);
      done();
    });
  });

  it('should set offline state', (done) => {
    networkStore.update((state) => ({ ...state, isOnline: true, wasOffline: false }));

    repo.setOffline();

    repo.isOnline$.pipe(take(1)).subscribe((isOnline) => {
      expect(isOnline).toBe(false);
      done();
    });
  });
});

