import { TestBed } from '@angular/core/testing';

import { QuotesRepository } from '@quotes-app/quotes/feature';
import { Quote } from '@quotes-app/shared/models';

const q: Quote = { id: '1', text: 'Hello', author: 'Tester', tags: [] };

describe('QuotesRepository', () => {
  let repo: QuotesRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotesRepository],
    });

    repo = TestBed.inject(QuotesRepository);
  });

  it('should set current quote', (done) => {
    repo.setCurrentQuote(q);

    repo.currentQuote$.subscribe((current) => {
      expect(current).toEqual(q);
      done();
    });
  });

  it('should add and update quote in store', (done) => {
    repo.addQuote(q);
    repo.updateQuote('1', { text: 'Updated' });

    repo.allQuotes$.subscribe((quotes) => {
      expect(quotes.length).toBe(1);
      expect(quotes[0].text).toBe('Updated');
      done();
    });
  });

  it('should delete quote from store', (done) => {
    repo.reset();
    repo.deleteQuote('1');

    repo.allQuotes$.subscribe((quotes) => {
      expect(quotes.length).toBe(0);
      done();
    });
  });
});

