import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, timer } from 'rxjs';
import { QuotesFacade } from '@quotes-app/quotes/feature';
import { RatingsRepository } from '@quotes-app/quotes/feature';
import { QuoteCardComponent } from '@quotes-app/quotes/ui';
import { NetworkStatusComponent } from '@quotes-app/shared/ui';
import { Quote } from '@quotes-app/shared/models';

const SLIDER_DELAY = 10_000; 

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    QuoteCardComponent,
    NetworkStatusComponent,
  ],
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
})
export class QuotesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  autoplay = signal(true);
  private quotesFacade = inject(QuotesFacade);
  private ratingsRepo = inject(RatingsRepository);

  isLoadingQuote = signal(false);
  currentQuote: Quote | null = null;
  currentRating = 0;
  countdownSeconds = signal<number | null>(null);

  get currentQuote$() {
    return this.quotesFacade.currentQuote$;
  }

  get error$() {
    return this.quotesFacade.error$;
  }

  get isOnline$() {
    return this.quotesFacade.isOnline$;
  }

  ngOnInit(): void {
    this.currentQuote$
      .pipe(takeUntil(this.destroy$))
      .subscribe((quote) => {
        this.currentQuote = quote;
        if (quote) {
          this.loadRating(quote.id);
        }
      });
    this.setupAutoplay();
    this.loadRandomQuote();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupAutoplay() {
    const totalSeconds = SLIDER_DELAY / 1000;

    this.countdownSeconds.set(totalSeconds);

    timer(0, 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const isAutoplayEnabled = this.autoplay();
        const isLoading = this.isLoadingQuote();

        if (!isAutoplayEnabled || isLoading) {
          return;
        }

        const current = this.countdownSeconds() ?? totalSeconds;

        if (current <= 1) {
          this.countdownSeconds.set(totalSeconds);
          this.loadRandomQuote();
        } else {
          this.countdownSeconds.set(current - 1);
        }
      });
  }

  toggleAutoplay(): void {
    this.autoplay.update((value) => !value);
  }

  loadRandomQuote(): void {
    if (this.isLoadingQuote()) {
      return;
    }

    this.isLoadingQuote.set(true);
    this.quotesFacade
      .loadRandomQuote()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoadingQuote.set(false);
          this.countdownSeconds.set(SLIDER_DELAY / 1000);
        },
        error: () => {
          this.isLoadingQuote.set(false);
          this.countdownSeconds.set(SLIDER_DELAY / 1000);
        },
      });
  }

  onRatingChange(rating: number): void {
    if (this.currentQuote) {
      this.currentRating = rating;
      this.ratingsRepo.setRating(this.currentQuote.id, rating);
    }
  }

  private loadRating(quoteId: string): void {
    this.ratingsRepo
      .getRatingByQuoteId(quoteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rating) => {
        this.currentRating = rating?.value || 0;
      });
  }
}
