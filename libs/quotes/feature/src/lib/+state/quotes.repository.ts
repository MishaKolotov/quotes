import { Injectable } from '@angular/core';
import { select } from '@ngneat/elf';
import {
  selectAllEntities,
  addEntities,
  updateEntities,
  deleteEntities,
} from '@ngneat/elf-entities';
import { Quote } from '@quotes-app/shared/models';
import { quotesStore, initialState } from './quotes.store';

@Injectable({ providedIn: 'root' })
export class QuotesRepository {
  currentQuote$ = quotesStore.pipe(
    select((state) => state.currentQuote)
  );

  loading$ = quotesStore.pipe(select((state) => state.loading));
  error$ = quotesStore.pipe(select((state) => state.error));
  allQuotes$ = quotesStore.pipe(selectAllEntities());

  setCurrentQuote(quote: Quote | null): void {
    quotesStore.update((state) => ({
      ...state,
      currentQuote: quote,
      error: null,
    }));
  }

  setLoading(loading: boolean): void {
    quotesStore.update((state) => ({
      ...state,
      loading,
    }));
  }

  setError(error: string | null): void {
    quotesStore.update((state) => ({
      ...state,
      error,
      loading: false,
    }));
  }

  addQuote(quote: Quote): void {
    quotesStore.update(addEntities(quote));
  }

  updateQuote(id: string, quote: Partial<Quote>): void {
    quotesStore.update(
      updateEntities(id, (entity: Quote) => ({ ...entity, ...quote }))
    );
  }

  deleteQuote(id: string): void {
    quotesStore.update(deleteEntities(id));
  }

  reset(): void {
    quotesStore.update((state) => ({
      ...state,
      ...initialState,
      entities: {},
      ids: [],
    }));
  }
}

