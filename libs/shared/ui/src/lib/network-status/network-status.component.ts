import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { NetworkRepository } from '@quotes-app/shared/state';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './network-status.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkStatusComponent {
  private networkRepo = inject(NetworkRepository);

  get isOnline$() {
    return this.networkRepo.isOnline$;
  }
}

