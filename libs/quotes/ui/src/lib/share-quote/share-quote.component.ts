import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Quote } from '@quotes-app/shared/models';

@Component({
  selector: 'app-share-quote',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './share-quote.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareQuoteComponent {
  @Input() quote: Quote | null = null;

  async share(): Promise<void> {
    if (!this.quote) { 
      return; 
    }

    const text = `"${this.quote.text}" — ${this.quote.author}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Inspiring quote',
          text,
          url: location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
        window.alert('Quote copied to clipboard!');
    }
  }
}

