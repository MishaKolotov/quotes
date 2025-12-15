import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, race, of, EMPTY } from 'rxjs';
import { map, catchError, timeout, retry, take, switchMap } from 'rxjs/operators';
import { Quote, QuoteResponse } from '@quotes-app/shared/models';
import { CacheService } from './cache.service';
import { NetworkRepository } from '@quotes-app/shared/state';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private readonly apiTimeout = 5000;
  private readonly maxRetries = 2;
  private readonly apiSources = [
    {
      url: 'https://dummyjson.com/quotes/random',
      mapper: (response: QuoteResponse & { quote?: string }): Quote => ({
        id: response.id?.toString() || this.generateId(),
        text: response.quote || '',
        author: response.author || 'Unknown',
        tags: [],
      }),
    },
    {
      url: 'https://api.quotable.io/random',
      mapper: (
        response: QuoteResponse & {
          _id?: string;
          content?: string;
          tags?: string[];
        }
      ): Quote => ({
        id: response._id || this.generateId(),
        text: response.content || '',
        author: response.author || 'Unknown',
        tags: response.tags || [],
      }),
    },
  ];

  private readonly fallbackQuotes: Quote[] = [
    {
      id: 'fallback-7',
      text: 'The only impossible journey is the one you never begin.',
      author: 'Tony Robbins',
    },
    {
      id: 'fallback-8',
      text: 'In the middle of difficulty lies opportunity.',
      author: 'Albert Einstein',
    },
  ];

  private networkRepo = inject(NetworkRepository);

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) {}

  fetchRandomQuote(): Observable<Quote> {
    return this.networkRepo.isOnline$.pipe(
      take(1),
      switchMap((isOnline) => {
        if (!isOnline) {
          return this.getCachedOrFallback();
        }

        const requests = this.apiSources.map((source) =>
          this.http.get<QuoteResponse>(source.url).pipe(
            timeout(this.apiTimeout),
            retry(this.maxRetries),
            map((response) => {
              try {
                return source.mapper(response);
              } catch {
                throw new Error('Failed to map response');
              }
            }),
            catchError(() => EMPTY)
          )
        );

        return race(...requests).pipe(
          take(1),
          catchError(() => this.getCachedOrFallback())
        );
      })
    );
  }

  private getCachedOrFallback(): Observable<Quote> {
    return this.cacheService.getRandomCachedQuote().pipe(
      map((cachedQuote) => {
        if (cachedQuote) {
          return cachedQuote;
        }
        return this.getRandomFallbackQuote();
      }),
      catchError(() => {
        return of(this.getRandomFallbackQuote());
      })
    );
  }

  private getRandomFallbackQuote(): Quote {
    const randomIndex = Math.floor(
      Math.random() * this.fallbackQuotes.length
    );
    return this.fallbackQuotes[randomIndex];
  }

  private generateId(): string {
    return `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getLocalFallbackQuotes(): Quote[] {
    return [...this.fallbackQuotes];
  }
}
