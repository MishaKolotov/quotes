import { Injectable, inject } from '@angular/core';
import { select } from '@ngneat/elf';
import { Rating } from '@quotes-app/shared/models';
import { ratingsStore } from './ratings.store';
import { Observable, from, map, catchError, of, switchMap } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({ providedIn: 'root' })
export class RatingsRepository {
  private readonly storeName = 'ratings';
  private readonly dbService = inject(NgxIndexedDBService);

  allRatings$ = ratingsStore.pipe(
    select((state) => Object.values(state.ratings))
  );

  getRatingByQuoteId(quoteId: string): Observable<Rating | null> {
    return ratingsStore.pipe(
      select((state) => state.ratings[quoteId] || null)
    );
  }

  setRating(quoteId: string, value: number): void {
    const rating: Rating = {
      quoteId,
      value,
      timestamp: Date.now(),
    };

    ratingsStore.update((state) => ({
      ...state,
      ratings: {
        ...state.ratings,
        [quoteId]: rating,
      },
    }));

    this.saveRatingToDB(rating).subscribe();
  }

  private saveRatingToDB(rating: Rating): Observable<boolean> {
    return from(this.dbService.update(this.storeName, rating)).pipe(
      map(() => true),
      catchError(() => {
        return from(this.dbService.add(this.storeName, rating)).pipe(
          map(() => true),
          catchError(() => of(false))
        );
      })
    );
  }

  updateRating(quoteId: string, value: number): void {
    ratingsStore.update((state) => {
      const existingRating = state.ratings[quoteId];
      if (!existingRating) {
        return state;
      }

      const updatedRating: Rating = {
        ...existingRating,
        value,
        timestamp: Date.now(),
      };

      const newState = {
        ...state,
        ratings: {
          ...state.ratings,
          [quoteId]: updatedRating,
        },
      };

      this.saveRatingToDB(updatedRating).subscribe();

      return newState;
    });
  }

  deleteRating(quoteId: string): void {
    from(this.dbService.delete(this.storeName, quoteId)).subscribe();

    ratingsStore.update((state) => {
      const ratings = { ...state.ratings };
      delete ratings[quoteId];
      return {
        ...state,
        ratings,
      };
    });
  }

  reset(): void {
    from(this.dbService.clear(this.storeName)).subscribe();

    ratingsStore.update((state) => ({
      ...state,
      ratings: {},
    }));
  }


  loadRatingsFromDB(): Observable<Rating[]> {
    return from(this.dbService.getAll(this.storeName)).pipe(
      map((ratings: unknown) => {
        if (!Array.isArray(ratings)) {
          return [];
        }
        return ratings as Rating[];
      }),
      switchMap((ratings) => {
        if (ratings.length > 0) {
          const ratingsMap: Record<string, Rating> = {};
          ratings.forEach((rating) => {
            ratingsMap[rating.quoteId] = rating;
          });

          ratingsStore.update((state) => ({
            ...state,
            ratings: ratingsMap,
          }));
        }
        return of(ratings);
      }),
      catchError(() => of([]))
    );
  }
}

