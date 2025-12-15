import { TestBed } from '@angular/core/testing';

import { RatingsRepository } from '@quotes-app/quotes/feature';
import { ratingsStore } from '@quotes-app/quotes/feature';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Rating } from '@quotes-app/shared/models';

class MockDbService {
  update = jest.fn().mockResolvedValue(true);
  add = jest.fn().mockResolvedValue(true);
  delete = jest.fn().mockResolvedValue(true);
  clear = jest.fn().mockResolvedValue(true);
  getAll = jest.fn().mockResolvedValue([]);
}

describe('RatingsRepository', () => {
  let repo: RatingsRepository;
  let db: MockDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RatingsRepository,
        { provide: NgxIndexedDBService, useClass: MockDbService },
      ],
    });

    repo = TestBed.inject(RatingsRepository);
    db = TestBed.inject(NgxIndexedDBService) as unknown as MockDbService;

    // reset store
    ratingsStore.update((state) => ({ ...state, ratings: {} }));
  });

  it('should set rating in store and persist to DB', () => {
    repo.setRating('1', 4);

    repo.getRatingByQuoteId('1').subscribe((rating) => {
      expect(rating?.value).toBe(4);
    });

    expect(db.update).toHaveBeenCalled();
  });

  it('should update rating', () => {
    repo.setRating('1', 3);
    repo.updateRating('1', 5);

    repo.getRatingByQuoteId('1').subscribe((rating) => {
      expect(rating?.value).toBe(5);
    });
  });

  it('should delete rating', () => {
    repo.setRating('1', 3);
    repo.deleteRating('1');

    repo.getRatingByQuoteId('1').subscribe((rating) => {
      expect(rating).toBeNull();
    });

    expect(db.delete).toHaveBeenCalledWith('ratings', '1');
  });

  it('should load ratings from DB into store', (done) => {
    const rating: Rating = { quoteId: '1', value: 5, timestamp: Date.now() };
    db.getAll = jest.fn().mockResolvedValue([rating]);

    repo.loadRatingsFromDB().subscribe((ratings) => {
      expect(ratings.length).toBe(1);
      repo.getRatingByQuoteId('1').subscribe((loaded) => {
        expect(loaded?.value).toBe(5);
        done();
      });
    });
  });
});

