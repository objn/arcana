import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Reading } from '../../core/models/reading.model';
import { SPREAD_CONFIGS } from '../../core/models/card.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="history-page">
      <div class="hdr">
        <div class="hdr-title">Arcana</div>
        <div class="hdr-sub">History</div>
        <div class="hdr-rule"></div>
        <a routerLink="/reading" class="back-btn">← Back to Reading</a>
      </div>

      @if (loading()) {
        <div class="loading">Loading…</div>
      }

      @if (!loading() && readings().length === 0) {
        <div class="empty">You haven't done any readings yet.</div>
      }

      <div class="readings-list">
        @for (r of readings(); track r.id) {
          <div class="reading-card">
            <div class="reading-header">
              <span class="spread-badge">{{ spreadLabel(r.spread_type) }}</span>
              <span class="reading-date">{{ r.created_at | date:'d MMM yyyy, HH:mm' }}</span>
            </div>
            @if (r.question) {
              <div class="question">"{{ r.question }}"</div>
            }
            <div class="cards-row">
              @for (dc of r.drawn_cards; track dc.card_id) {
                <div class="mini-card">
                  <div class="mini-position">{{ dc.position }}</div>
                  <div class="mini-name">{{ dc.card_id }}</div>
                  <div class="mini-orient">{{ dc.reversed ? '↓' : '↑' }}</div>
                </div>
              }
            </div>
            <button class="delete-btn" (click)="deleteReading(r.id)">Delete</button>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (total() > pageSize) {
        <div class="pagination">
          <button [disabled]="page() === 1" (click)="loadPage(page() - 1)">‹</button>
          <span>{{ page() }} / {{ totalPages() }}</span>
          <button [disabled]="page() >= totalPages()" (click)="loadPage(page() + 1)">›</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400&display=swap');
    :host { display:block; }
    .history-page { min-height:100vh; background:#0b0714; padding:24px 16px;
      font-family:'Cormorant Garamond',serif; color:#e8d8b4;
      display:flex; flex-direction:column; align-items:center; gap:16px; }
    .hdr { text-align:center; }
    .hdr-title { font-family:'Cinzel Decorative',serif; font-size:1.4rem; color:#f0d87a; letter-spacing:.14em; }
    .hdr-sub { font-size:.65rem; letter-spacing:.4em; color:rgba(201,168,76,.35); text-transform:uppercase; margin-top:4px; }
    .hdr-rule { width:120px; height:1px; background:linear-gradient(90deg,transparent,#c9a84c,transparent);
      margin:10px auto 14px; opacity:.45; }
    .back-btn { font-size:.8rem; color:#c9a84c; text-decoration:none; letter-spacing:.1em; }
    .back-btn:hover { color:#f0d87a; }
    .loading, .empty { color:rgba(232,216,180,.4); font-style:italic; font-size:.95rem; }
    .readings-list { width:min(600px,96vw); display:flex; flex-direction:column; gap:14px; }
    .reading-card { background:rgba(19,13,36,.85); border:1px solid rgba(201,168,76,.18);
      border-radius:14px; padding:18px 20px; position:relative; }
    .reading-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .spread-badge { font-size:.62rem; letter-spacing:.15em; text-transform:uppercase;
      color:#c9a84c; border:1px solid rgba(201,168,76,.3); padding:3px 10px; border-radius:20px; }
    .reading-date { font-size:.72rem; color:rgba(232,216,180,.4); }
    .question { font-style:italic; font-size:.9rem; color:rgba(232,216,180,.7); margin-bottom:10px; }
    .cards-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
    .mini-card { background:rgba(28,13,58,.8); border:1px solid rgba(201,168,76,.15);
      border-radius:8px; padding:6px 10px; min-width:80px; text-align:center; }
    .mini-position { font-size:.55rem; letter-spacing:.15em; text-transform:uppercase;
      color:rgba(201,168,76,.45); margin-bottom:3px; }
    .mini-name { font-size:.7rem; color:#e8d8b4; line-height:1.3; }
    .mini-orient { font-size:.7rem; color:rgba(201,168,76,.6); margin-top:2px; }
    .delete-btn { position:absolute; top:12px; right:12px;
      background:transparent; border:1px solid rgba(232,100,100,.3);
      color:rgba(232,100,100,.6); font-size:.65rem; padding:4px 10px;
      border-radius:12px; cursor:pointer; transition:all .2s; }
    .delete-btn:hover { background:rgba(232,100,100,.1); color:rgba(232,100,100,.9); }
    .pagination { display:flex; align-items:center; gap:16px; color:rgba(201,168,76,.6); font-size:.85rem; }
    .pagination button { background:transparent; border:1px solid rgba(201,168,76,.3);
      color:#c9a84c; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:1rem; }
    .pagination button:disabled { opacity:.3; cursor:default; }
  `],
})
export class HistoryComponent implements OnInit {
  private api = inject(ApiService);

  readings = signal<Reading[]>([]);
  loading  = signal(true);
  page     = signal(1);
  total    = signal(0);
  pageSize = 10;
  totalPages = () => Math.ceil(this.total() / this.pageSize);

  spreadLabel(type: string): string {
    return SPREAD_CONFIGS[type]?.label ?? type;
  }

  ngOnInit() { this.loadPage(1); }

  loadPage(p: number) {
    this.page.set(p);
    this.loading.set(true);
    this.api.listReadings(p, this.pageSize).subscribe({
      next: res => {
        this.readings.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteReading(id: string) {
    this.api.deleteReading(id).subscribe({
      next: () => this.readings.update(list => list.filter(r => r.id !== id)),
    });
  }
}
