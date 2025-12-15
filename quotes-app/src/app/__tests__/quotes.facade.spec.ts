import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { QuotesFacade } from '@quotes-app/quotes/feature';
import { QuoteService, CacheService } from '@quotes-app/shared/data-access';
import { QuotesRepository } from '@quotes-app/quotes/feature';
import { NetworkRepository } from '@quotes-app/shared/state';
import { Quote } from '@quotes-app/shared/models';

const mockQuote: Quote = {
  id: '1',
  text: 'Facade test quote',
  author: 'Tester',
  tags: ['test'],
};

class MockQuoteService {
  fetchRandomQuote = jest.fn().mockReturnValue(of(mockQuote));
  getLocalFallbackQuotes = jest.fn().mockReturnValue([mockQuote]);
}

class MockCacheService {
  saveQuote = jest.fn().mockReturnValue(of(true));
  getAllCachedQuotes = jest.fn().mockReturnValue(of([mockQuote]));
}

class MockQuotesRepository {
  loading$ = of(false);
  error$ = of(null);
  currentQuote$ = of(null);
  allQuotes$ = of([]);

  setLoading = jest.fn();
  setError = jest.fn();
  setCurrentQuote = jest.fn();
  addQuote = jest.fn();
}

class MockNetworkRepository {
  isOnline$ = of(true);
}

describe('QuotesFacade', () => {
  let facade: QuotesFacade;
  let quoteService: MockQuoteService;
  let quotesRepo: MockQuotesRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuotesFacade,
        { provide: QuoteService, useClass: MockQuoteService },
        { provide: CacheService, useClass: MockCacheService },
        { provide: QuotesRepository, useClass: MockQuotesRepository },
        { provide: NetworkRepository, useClass: MockNetworkRepository },
      ],
    });

    facade = TestBed.inject(QuotesFacade);
    quoteService = TestBed.inject(QuoteService) as unknown as MockQuoteService;
    quotesRepo = TestBed.inject(QuotesRepository) as unknown as MockQuotesRepository;
  });

  it('should load a random quote and update the store', (done) => {
    facade.loadRandomQuote().subscribe((quote) => {
      expect(quote).toEqual(mockQuote);
      expect(quotesRepo.setLoading).toHaveBeenCalledWith(true);
      expect(quotesRepo.setCurrentQuote).toHaveBeenCalledWith(mockQuote);
      expect(quotesRepo.addQuote).toHaveBeenCalledWith(mockQuote);
      done();
    });
  });

  it('should handle errors and use fallback quote', (done) => {
    quoteService.fetchRandomQuote.mockReturnValueOnce(throwError(() => new Error('API error')));

    facade.loadRandomQuote().subscribe((quote) => {
      expect(quotesRepo.setError).toHaveBeenCalledWith('API error');
      expect(quote).toEqual(mockQuote); // fallback
      done();
    });
  });
});

