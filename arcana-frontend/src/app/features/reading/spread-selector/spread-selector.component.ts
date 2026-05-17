import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SPREAD_CONFIGS } from '../../../core/models/card.model';

@Component({
  selector: 'app-spread-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spread-selector">
      <div class="spread-label">รูปแบบการดูดวง</div>
      <div class="spread-tabs">
        @for (entry of spreadEntries; track entry[0]) {
          <button
            class="spread-tab"
            [class.active]="selected === entry[0]"
            (click)="selectedChange.emit(entry[0])"
          >
            {{ entry[1].label }}
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .spread-selector { width:min(480px,96vw); margin:0 auto; }
    .spread-label { font-size:.62rem; letter-spacing:.22em; color:rgba(201,168,76,.45);
      text-transform:uppercase; margin-bottom:8px; text-align:center; }
    .spread-tabs { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; }
    .spread-tab { font-family:'Cormorant Garamond',serif; font-size:.8rem;
      background:rgba(255,255,255,.04); border:1px solid rgba(201,168,76,.2);
      color:rgba(232,216,180,.6); padding:6px 14px; border-radius:20px;
      cursor:pointer; transition:all .25s; letter-spacing:.05em; }
    .spread-tab.active, .spread-tab:hover {
      background:rgba(201,168,76,.12); border-color:rgba(201,168,76,.5);
      color:#f0d87a; }
  `],
})
export class SpreadSelectorComponent {
  @Input() selected = 'three_card';
  @Output() selectedChange = new EventEmitter<string>();

  spreadEntries = Object.entries(SPREAD_CONFIGS);
}
