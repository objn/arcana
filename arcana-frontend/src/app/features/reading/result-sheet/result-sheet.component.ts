import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarotCard, DrawnCard, SPREAD_CONFIGS } from '../../../core/models/card.model';
import { CardThreeComponent } from '../card-three/card-three.component';

export interface ResultData {
  spreadType: string;
  question: string;
  cards: TarotCard[];
  reversed: boolean[];
}

@Component({
  selector: 'app-result-sheet',
  standalone: true,
  imports: [CommonModule, CardThreeComponent],
  template: `
    <div class="sheet" [class.open]="isOpen">
      <div class="sheet-scrim" (click)="close.emit()"></div>
      <div class="sheet-panel">
        <div class="sheet-handle"></div>

        @if (data) {
          <div class="sheet-header">
            <div class="spread-name">{{ spreadConfig?.label }}</div>
            @if (data.question) {
              <div class="question-text">"{{ data.question }}"</div>
            }
          </div>

          <!-- Card results -->
          <div class="cards-results">
            @for (card of data.cards; track card.card_id; let i = $index) {
              <div class="card-result-row">
                <!-- 3D card -->
                <div class="card-3d-wrap">
                  <app-card-three
                    [frontImage]="cardImageUrl(card)"
                    [revealed]="true"
                    [reversed]="data.reversed[i]"
                  />
                </div>
                <!-- Info -->
                <div class="card-info">
                  <div class="position-label">{{ positionLabel(i) }}</div>
                  <div class="card-name">{{ card.name }}</div>
                  <div class="card-orient">{{ data.reversed[i] ? '↓ Reversed' : '↑ Upright' }}</div>
                  <div class="meaning-label">ความหมาย</div>
                  <div class="card-rule"></div>
                  <div class="card-desc">{{ data.reversed[i] ? card.meaning_rev : card.meaning_up }}</div>
                  <div class="card-tags">
                    @for (kw of (data.reversed[i] ? card.keywords_rev : card.keywords_up); track kw) {
                      <span class="tag">{{ kw }}</span>
                    }
                  </div>
                </div>
              </div>
              @if (!$last) { <div class="divider"></div> }
            }
          </div>

          <button class="again-btn" (click)="close.emit()">✦ เลือกไพ่ใบใหม่ ✦</button>
          <button class="save-btn" (click)="save.emit()">
            {{ saved ? '✓ บันทึกแล้ว' : '♦ บันทึกการดูดวง ♦' }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    .sheet { position:fixed; inset:0; z-index:50; display:flex; flex-direction:column; pointer-events:none; }
    .sheet-scrim { flex:1; background:rgba(0,0,0,0); transition:background .5s; }
    .sheet.open .sheet-scrim { background:rgba(0,0,0,.65); pointer-events:all; }
    .sheet-panel { width:100%; background:linear-gradient(170deg,#160c2e,#0b0714);
      border-top:1px solid rgba(201,168,76,.22); border-radius:22px 22px 0 0;
      padding:0 24px clamp(28px,6vh,52px); transform:translateY(100%);
      transition:transform .55s cubic-bezier(.23,1,.32,1); pointer-events:none;
      max-height:80vh; overflow-y:auto; font-family:'Cormorant Garamond',serif; color:#e8d8b4; }
    .sheet.open .sheet-panel { transform:translateY(0); pointer-events:all; }
    .sheet-handle { width:40px; height:3px; background:rgba(201,168,76,.25);
      border-radius:2px; margin:14px auto 20px; }
    .sheet-header { text-align:center; margin-bottom:20px; }
    .spread-name { font-family:'Cinzel Decorative',serif; font-size:.75rem; color:#c9a84c;
      letter-spacing:.15em; text-transform:uppercase; }
    .question-text { font-size:.95rem; color:rgba(232,216,180,.7); font-style:italic;
      margin-top:6px; }
    .cards-results { display:flex; flex-direction:column; gap:0; }
    .card-result-row { display:flex; gap:18px; align-items:flex-start; padding:16px 0; }
    .card-3d-wrap { flex-shrink:0; }
    .card-info { flex:1; padding-top:4px; }
    .position-label { font-size:.58rem; letter-spacing:.22em; text-transform:uppercase;
      color:rgba(201,168,76,.45); margin-bottom:4px; }
    .card-name { font-family:'Cinzel Decorative',serif; font-size:.95rem; color:#f0d87a;
      letter-spacing:.08em; line-height:1.3; margin-bottom:4px; }
    .card-orient { font-size:.62rem; letter-spacing:.22em; text-transform:uppercase;
      color:rgba(201,168,76,.5); margin-bottom:10px; }
    .meaning-label { font-size:.58rem; letter-spacing:.18em; text-transform:uppercase;
      color:rgba(201,168,76,.4); margin-bottom:4px; }
    .card-rule { width:100%; height:1px;
      background:linear-gradient(90deg,rgba(201,168,76,.2),transparent); margin-bottom:10px; }
    .card-desc { font-size:.9rem; line-height:1.75; color:rgba(232,216,180,.82);
      font-style:italic; margin-bottom:12px; }
    .card-tags { display:flex; flex-wrap:wrap; gap:6px; }
    .tag { font-size:.58rem; letter-spacing:.14em; text-transform:uppercase;
      color:rgba(201,168,76,.7); border:1px solid rgba(201,168,76,.22);
      padding:4px 10px; border-radius:20px; background:rgba(201,168,76,.04); }
    .divider { width:100%; height:1px;
      background:linear-gradient(90deg,transparent,rgba(201,168,76,.15),transparent); }
    .again-btn, .save-btn {
      width:100%; font-family:'Cinzel Decorative',serif; font-size:.72rem;
      letter-spacing:.15em; border:none; padding:13px; border-radius:50px;
      cursor:pointer; text-transform:uppercase; transition:all .25s; margin-top:12px; }
    .again-btn { color:#0b0714;
      background:linear-gradient(135deg,#b8922e,#f0d87a,#b8922e);
      box-shadow:0 4px 18px rgba(201,168,76,.3); }
    .save-btn { color:#c9a84c; background:transparent;
      border:1px solid rgba(201,168,76,.35); }
    .again-btn:hover { transform:translateY(-1px); box-shadow:0 6px 26px rgba(201,168,76,.5); }
    .save-btn:hover { background:rgba(201,168,76,.08); }
  `],
})
export class ResultSheetComponent {
  @Input() isOpen = false;
  @Input() data: ResultData | null = null;
  @Input() saved = false;
  @Output() close = new EventEmitter<void>();
  @Output() save  = new EventEmitter<void>();

  get spreadConfig() {
    return this.data ? SPREAD_CONFIGS[this.data.spreadType] : null;
  }

  positionLabel(i: number): string {
    return this.spreadConfig?.positions[i] ?? `Position ${i + 1}`;
  }

  cardImageUrl(card: TarotCard): string {
    if (card.suit === 'major') {
      return `assets/cards/major/major_${card.number.toLowerCase()}.jpg`;
    }
    return `assets/cards/${card.suit}/${card.card_id}.jpg`;
  }
}
