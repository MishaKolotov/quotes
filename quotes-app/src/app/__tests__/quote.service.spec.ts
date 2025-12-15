import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QuoteService, CacheService } from '@quotes-app/shared/data-access';
import { NetworkRepository } from '@quotes-app/shared/state';
import { Quote } from '@quotes-app/shared/models';

const mockQuote: Quote = {
  id: '1',
  text: 'Test quote',
  author: 'Tester',
  tags: ['test'],
};

class MockCacheService {
  getRandomCachedQuote = jest.fn().mockReturnValue(of(mockQuote));
}

class MockNetworkRepository {
  isOnline$ = of(true);
}

describe('QuoteService', () => {
  let service: QuoteService;
  let httpMock: HttpTestingController;
  let cacheService: MockCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        QuoteService,
        { provide: CacheService, useClass: MockCacheService },
        { provide: NetworkRepository, useClass: MockNetworkRepository },
      ],
    });

    service = TestBed.inject(QuoteService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService) as unknown as MockCacheService;
  });

  it('should fetch a quote from one of the APIs when online', (done) => {
    service.fetchRandomQuote().subscribe((quote) => {
      expect(quote.text).toBe('Test quote');
      done();
    });

    const requests = httpMock.match((request) =>
      request.url.includes('dummyjson.com') || request.url.includes('api.quotable.io')
    );

    expect(requests.length).toBeGreaterThan(0);

    requests[0].flush({
      id: 1,
      quote: 'Test quote',
      author: 'Tester',
      tags: ['test'],
    });
  });

  it('should fall back to cache when offline', (done) => {
    const networkRepo = TestBed.inject(NetworkRepository) as any;
    networkRepo.isOnline$ = of(false);

    service.fetchRandomQuote().subscribe((quote) => {
      expect(cacheService.getRandomCachedQuote).toHaveBeenCalled();
      expect(quote).toEqual(mockQuote);
      done();
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

