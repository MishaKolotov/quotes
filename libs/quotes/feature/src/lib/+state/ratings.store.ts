import { createStore, withProps } from '@ngneat/elf';
import { Rating } from '@quotes-app/shared/models';

export interface RatingsState {
  ratings: Record<string, Rating>;
}

const initialState: RatingsState = {
  ratings: {},
};

export const ratingsStore = createStore(
  { name: 'ratings' },
  withProps<RatingsState>(initialState)
);

