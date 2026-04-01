import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { QuotaInfo } from '../models/request.model';

const QUOTA_CACHE_KEY = 'cac_quota';
const QUOTA_ENDPOINT = '/quota-check';

/** Checks and caches the IP-based generation quota */
@Injectable({ providedIn: 'root' })
export class QuotaService {
  private readonly http = inject(HttpClient);

  /**
   * Returns current quota info, using sessionStorage cache when available.
   * Falls back to max quota on network error so generation can proceed.
   */
  checkQuota(): Observable<QuotaInfo> {
    const cached = sessionStorage.getItem(QUOTA_CACHE_KEY);
    if (cached) return of(JSON.parse(cached) as QuotaInfo);
    return this.http.get<QuotaInfo>(QUOTA_ENDPOINT).pipe(
      catchError(() => of({ ipQuotaRemaining: 3, systemQuotaRemaining: 12 }))
    );
  }

  /** Clears the quota cache so the next call fetches fresh data */
  clearCache(): void {
    sessionStorage.removeItem(QUOTA_CACHE_KEY);
  }

  /** Caches quota info after a successful generation response */
  cacheQuota(info: QuotaInfo): void {
    sessionStorage.setItem(QUOTA_CACHE_KEY, JSON.stringify(info));
  }
}
