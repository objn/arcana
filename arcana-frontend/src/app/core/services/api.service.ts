import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TarotCard } from '../models/card.model';
import { Reading, ReadingCreate, ReadingListOut } from '../models/reading.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  // ── Cards ──────────────────────────────────────────────────────────────────
  getAllCards() {
    return this.http.get<TarotCard[]>(`${this.base}/cards`);
  }

  getMajorArcana() {
    return this.http.get<TarotCard[]>(`${this.base}/cards/major`);
  }

  getCard(cardId: string) {
    return this.http.get<TarotCard>(`${this.base}/cards/${cardId}`);
  }

  // ── Readings ────────────────────────────────────────────────────────────────
  createReading(payload: ReadingCreate) {
    return this.http.post<Reading>(`${this.base}/readings`, payload);
  }

  listReadings(page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);
    return this.http.get<ReadingListOut>(`${this.base}/readings`, { params });
  }

  getReading(id: string) {
    return this.http.get<Reading>(`${this.base}/readings/${id}`);
  }

  deleteReading(id: string) {
    return this.http.delete(`${this.base}/readings/${id}`);
  }

  // ── AI Interpretation ───────────────────────────────────────────────────────
  interpretCard(payload: {
    question: string;
    card_id:  string;
    position: string;
    reversed: boolean;
  }) {
    return this.http.post<{ meaning: string }>(
      `${this.base}/readings/interpret-card`,
      payload,
    );
  }
}
