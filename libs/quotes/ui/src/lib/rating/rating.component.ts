import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  @Input() currentRating = 0;
  @Input() quoteId = '';
  @Output() ratingChange = new EventEmitter<number>();

  readonly maxRating = 5;
  stars: number[] = [1, 2, 3, 4, 5];

  setRating(rating: number): void {
    this.currentRating = rating;
    this.ratingChange.emit(rating);
  }
}

