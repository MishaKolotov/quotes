import { createStore, withProps } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { Quote } from '@quotes-app/shared/models';

export interface QuotesState {
  currentQuote: Quote | null;
  loading: boolean;
  error: string | null;
}

export const initialState: QuotesState = {
  currentQuote: null,
  loading: false,
  error: null,
};

export const quotesStore = createStore(
  { name: 'quotes' },
  withProps<QuotesState>(initialState),
  withEntities<Quote>()
);

