import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of, switchMap, finalize } from 'rxjs';
import { Quote } from '@quotes-app/shared/models';
import { QuoteService } from '@quotes-app/shared/data-access';
import { CacheService } from '@quotes-app/shared/data-access';
import { QuotesRepository } from './+state/quotes.repository';
import { NetworkRepository } from '@quotes-app/shared/state';

@Injectable({
  providedIn: 'root',
})
export class QuotesFacade {
  private quotesRepo = inject(QuotesRepository);
  private quoteService = inject(QuoteService);
  private cacheService = inject(CacheService);
  private networkRepo = inject(NetworkRepository); 

  get currentQuote$() {
    return this.quotesRepo.currentQuote$;
  }

  get loading$() {
    return this.quotesRepo.loading$;
  }

  get error$() {
    return this.quotesRepo.error$;
  }

  get allQuotes$() {
    return this.quotesRepo.allQuotes$;
  }

  get isOnline$() {
    return this.networkRepo.isOnline$;
  }

  loadRandomQuote(): Observable<Quote | null> {
    this.quotesRepo.setLoading(true);
    this.quotesRepo.setError(null);

    return this.quoteService.fetchRandomQuote().pipe(
      switchMap((quote) => {
        this.quotesRepo.setCurrentQuote(quote);
        this.quotesRepo.addQuote(quote);

        return this.cacheService.saveQuote(quote).pipe(
          switchMap(() => of(quote)),
          catchError(() => of(quote)),
        );
      }),
      catchError((error) => {
        this.quotesRepo.setError(
          error.message || 'Failed to load quote'
        );

        const fallbackQuote = this.quoteService.getLocalFallbackQuotes()[0];
        if (fallbackQuote) {
          this.quotesRepo.setCurrentQuote(fallbackQuote);
          return of(fallbackQuote);
        }

        return of(null);
      }),
      finalize(() => this.quotesRepo.setLoading(false)));
  }

  loadNextQuote(): Observable<Quote | null> {
    return this.loadRandomQuote();
  }

  getCachedQuotes(): Observable<Quote[]> {
    return this.cacheService.getAllCachedQuotes();
  }
}

