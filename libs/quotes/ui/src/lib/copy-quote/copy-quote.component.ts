import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Quote } from '@quotes-app/shared/models';

@Component({
  selector: 'app-copy-quote',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './copy-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyQuoteComponent {
  @Input() quote: Quote | null = null;

  private snackBar = inject(MatSnackBar);

  async copyQuote(): Promise<void> {
    if (!this.quote) {
      return;
    }

    const text = `"${this.quote.text}"\n— ${this.quote.author}`;

    try {
      await navigator.clipboard.writeText(text);
      this.snackBar.open('Quote copied!', 'OK', {
        duration: 2000,
        horizontalPosition: 'start',
        verticalPosition: 'bottom',
        panelClass: ['copy-snackbar-offset'],
      });
    } catch {
      this.snackBar.open('Copy failed', 'OK', {
        duration: 2000,
      });
    }
  }
}

