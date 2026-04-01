import { Component, OnInit, inject, signal } from '@angular/core';
import { QuotaService } from '../../shared/services/quota.service';
import { QuotaInfo } from '../../shared/models/request.model';

/** Displays current IP and system-wide generation quota */
@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  private readonly quotaService = inject(QuotaService);
  readonly quota = signal<QuotaInfo | null>(null);

  ngOnInit(): void {
    this.quotaService.checkQuota().subscribe(q => this.quota.set(q));
  }
}
