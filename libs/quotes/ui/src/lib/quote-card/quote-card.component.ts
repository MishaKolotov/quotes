import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Quote } from '@quotes-app/shared/models';
import { RatingComponent } from '../rating/rating.component';
import { CopyQuoteComponent } from '../copy-quote/copy-quote.component';
import { ShareQuoteComponent } from '../share-quote/share-quote.component';

@Component({
  selector: 'app-quote-card',
  standalone: true,
  imports: [MatIconModule, RatingComponent, CopyQuoteComponent, ShareQuoteComponent],
  templateUrl: './quote-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuoteCardComponent {
  @Input() quote: Quote | null = null;
  @Input() loading = false;
  @Input() currentRating = 0;
  @Output() ratingChange = new EventEmitter<number>();
}
