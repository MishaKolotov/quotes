import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {
  Observable,
  from,
  map,
  catchError,
  of,
  switchMap,
  forkJoin,
} from 'rxjs';
import { Quote } from '@quotes-app/shared/models';

interface QuoteWithTimestamp extends Quote {
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly storeName = 'quotes';
  private readonly maxCachedQuotes = 100;
  private readonly dbService = inject(NgxIndexedDBService);
  private lastRandomQuoteId: string | null = null;

  saveQuote(quote: Quote): Observable<boolean> {
    const quoteWithTimestamp: QuoteWithTimestamp = {
      ...quote,
      timestamp: Date.now(),
    };

    return from(
      this.dbService.update(this.storeName, quoteWithTimestamp)
    ).pipe(
      map(() => true),
      catchError(() =>
        from(this.dbService.add(this.storeName, quoteWithTimestamp)).pipe(
          map(() => true),
          catchError(() => of(false))
        )
      )
    );
  }

  getCachedQuote(quoteId: string): Observable<Quote | null> {
    return from(this.dbService.getByID(this.storeName, quoteId)).pipe(
      map((quote: unknown) => {
        if (!quote) {
          return null;
        }
        return quote as Quote;
      }),
      catchError(() => of(null))
    );
  }

  getRandomCachedQuote(): Observable<Quote | null> {
    return this.getAllCachedQuotes().pipe(
      map((quotes) => {
        if (quotes.length === 0) {
          return null;
        }

        if (quotes.length === 1) {
          this.lastRandomQuoteId = quotes[0].id;
          return quotes[0];
        }
        let candidate = quotes[Math.floor(Math.random() * quotes.length)];
        let attempts = 0;

        while (
          attempts < 5 &&
          this.lastRandomQuoteId &&
          candidate.id === this.lastRandomQuoteId
        ) {
          candidate = quotes[Math.floor(Math.random() * quotes.length)];
          attempts += 1;
        }

        this.lastRandomQuoteId = candidate.id;
        return candidate;
      })
    );
  }

  getAllCachedQuotes(): Observable<Quote[]> {
    return from(this.dbService.getAll(this.storeName)).pipe(
      map((quotes: unknown) => {
        if (!Array.isArray(quotes)) {
          return [];
        }
        return quotes as Quote[];
      }),
      catchError(() => of([]))
    );
  }

  clearOldQuotes(): Observable<boolean> {
    return this.getAllCachedQuotes().pipe(
      switchMap((quotes) => {
        if (quotes.length <= this.maxCachedQuotes) {
          return of(true);
        }

        const quotesWithTimestamp = quotes as QuoteWithTimestamp[];
        const sortedQuotes = [...quotesWithTimestamp].sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        );
        const quotesToDelete = sortedQuotes.slice(this.maxCachedQuotes);

        if (quotesToDelete.length === 0) {
          return of(true);
        }

        const deleteOperations = quotesToDelete.map((quote) =>
          from(this.dbService.delete(this.storeName, quote.id)).pipe(
            catchError(() => of(false))
          )
        );

        return forkJoin(deleteOperations).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      }),
      catchError(() => of(false))
    );
  }
}

