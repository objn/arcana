import {
  Component, OnInit, ViewChild, inject, signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { TarotCard, SPREAD_CONFIGS } from '../../core/models/card.model';
import { CardDeckComponent, CardSelectionItem } from './card-deck/card-deck.component';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SpreadDef { key: string; label: string; size: number; icon: string; }

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CardDeckComponent],
  template: `
    <div class="app">
      <canvas id="bg"></canvas>

      <!-- ☰ Hamburger — fixed top-left ──────────────────────────────── -->
      <div class="ham-wrap">
        <button class="ham-btn" (click)="menuOpen.update(v => !v)" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        @if (menuOpen()) {
          <div class="ham-backdrop" (click)="menuOpen.set(false)"></div>
          <div class="ham-drawer">
            <div class="ham-head">Menu</div>
            <a class="ham-item" routerLink="/history" (click)="menuOpen.set(false)">♦ ประวัติการดูดวง</a>
            <button class="ham-item ham-logout" (click)="logout()">↪ ออกจากระบบ</button>
          </div>
        }
      </div>

      <!-- ✦ Count badge — fixed top-right ─────────────────────────── -->
      <div class="count-badge" [class.has-cards]="selectedItems().length > 0">
        ✦ {{ selectedItems().length }}<span class="badge-of">/{{ spreadSize() }}</span>
      </div>

      <!-- ═══════════════════════════════════════════════════════════
           ZONE 1 — Start: Spread + Question
      ══════════════════════════════════════════════════════════════ -->
      <section id="zone-start" class="zone zone-start">
        <div class="start-content">

          <!-- Logo -->
          <div class="hdr">
            <div class="hdr-title">Arcana</div>
            <div class="hdr-sub">Tarot · 78 Cards</div>
            <div class="hdr-rule"></div>
          </div>

          <div class="start-prompt">How would you like to read today?</div>

          <!-- Spread options grid -->
          <div class="spread-grid">
            @for (sp of spreads; track sp.key) {
              <button
                class="spread-opt"
                [class.active]="spreadType() === sp.key"
                (click)="selectSpread(sp.key)"
              >
                <span class="so-icon">{{ sp.icon }}</span>
                <span class="so-label">{{ sp.label }}</span>
                <span class="so-size">{{ sp.size }} card{{ sp.size > 1 ? 's' : '' }}</span>
              </button>
            }
          </div>

          <!-- Question input -->
          <div class="q-wrap">
            <div class="q-label">Your Question <span class="q-opt">(optional)</span></div>
            <input
              class="q-input"
              type="text"
              [(ngModel)]="question"
              placeholder="Focus your mind and type your question…"
              autocomplete="off"
            >
          </div>

          <!-- Begin Reading -->
          <button class="begin-btn" (click)="scrollTo('zone-deck')">
            Begin Reading <span class="begin-arrow">→</span>
          </button>

        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════════
           ZONE 2 — Deck: Select Cards
      ══════════════════════════════════════════════════════════════ -->
      <section id="zone-deck" class="zone zone-deck">

        <div class="zone-header">
          <div class="zh-title">Select Your Cards</div>
          <div class="zh-sub">
            {{ currentSpreadLabel() }} ·
            Choose {{ spreadSize() }} card{{ spreadSize() > 1 ? 's' : '' }}
          </div>
        </div>

        <app-card-deck
          [allCards]="allCards()"
          [spreadSize]="spreadSize()"
          (selectionChange)="onSelectionChange($event)"
        />

        <!-- Progress + scroll CTA -->
        <div class="deck-footer">
          <div class="deck-progress">
            @for (i of progressDots(); track i) {
              <div class="dp-dot" [class.filled]="i < selectedItems().length"></div>
            }
          </div>
          @if (selectedItems().length >= spreadSize() && spreadSize() > 0) {
            <button class="scroll-cta" (click)="scrollTo('zone-reveal')">
              View Reading ↓
            </button>
          }
        </div>

      </section>

      <!-- ═══════════════════════════════════════════════════════════
           ZONE 3 — Reveal: Reading Results
      ══════════════════════════════════════════════════════════════ -->
      <section id="zone-reveal" class="zone zone-reveal">

        <!-- Question reminder -->
        @if (question) {
          <div class="rv-question">"{{ question }}"</div>
        }

        <!-- Empty state -->
        @if (selectedItems().length === 0) {
          <div class="rv-empty">
            <div class="rve-icon">✦</div>
            <div>Select {{ spreadSize() }} card{{ spreadSize() > 1 ? 's' : '' }} from the deck above</div>
            <button class="rve-back" (click)="scrollTo('zone-deck')">↑ Go to Deck</button>
          </div>
        }

        <!-- Pre-reveal: face-down cards + button -->
        @if (selectedItems().length >= spreadSize() && spreadSize() > 0 && !isRevealing() && revealedSet().size === 0) {
          <div class="facedown-wrap">
            <div class="facedown-row">
              @for (item of selectedItems(); track item.card.card_id; let i = $index) {
                <div class="fd-slot">
                  <div class="fd-card">
                    <div class="fd-back"></div>
                  </div>
                  <div class="fd-pos">{{ spreadPosition(i) }}</div>
                  <button class="fd-return" (click)="returnCard(i)">Return</button>
                </div>
              }
            </div>
            <button class="reveal-btn" (click)="startReveal()">✦ Reveal Reading</button>
          </div>
        }

        <!-- Post-reveal: card flip entries -->
        @if (isRevealing() || revealedSet().size > 0) {
          <div class="reveal-entries">
            @for (item of selectedItems(); track item.card.card_id; let i = $index) {
              <div class="re-entry" [class.visible]="i === 0 || revealedSet().has(i - 1)">

                <!-- Position divider -->
                <div class="re-sep">
                  <div class="sep-line"></div>
                  <div class="sep-label">{{ spreadPosition(i) }}</div>
                  <div class="sep-line"></div>
                </div>

                <!-- Card row: flip card + meanings -->
                <div class="re-row">

                  <!-- 3D Flip Card -->
                  <div class="flip-wrap">
                    <div class="flip-inner" [class.flipped]="revealedSet().has(i)">

                      <!-- Back face -->
                      <div class="flip-face flip-back"></div>

                      <!-- Front face (card art) -->
                      <div
                        class="flip-face flip-front"
                        [class]="'suit-' + item.card.suit"
                        [class.reversed]="item.reversed"
                      >
                        <img
                          class="card-img"
                          [src]="cardImageUrl(item.card.card_id)"
                          [alt]="item.card.name"
                          (error)="onImgError($event)"
                        >
                        <div class="card-overlay">
                          <div class="co-number">{{ item.card.number }}</div>
                          <div class="co-glyph">✦</div>
                          <div class="co-name">{{ item.card.name }}</div>
                        </div>
                      </div>

                    </div><!-- /flip-inner -->
                  </div><!-- /flip-wrap -->

                  <!-- Meanings (fade in after flip) -->
                  <div class="re-meanings" [class.visible]="revealedSet().has(i)">

                    <div class="rm-name">{{ item.card.name }}</div>
                    <div class="rm-orient" [class.rev]="item.reversed">
                      {{ item.reversed ? '↑ Reversed' : '↓ Upright' }}
                    </div>
                    <div class="rm-keywords">
                      {{ (item.reversed ? item.card.keywords_rev : item.card.keywords_up).join(' · ') }}
                    </div>

                    <!-- General meaning -->
                    <div class="meaning-block">
                      <div class="mb-label">Meaning</div>
                      <div class="mb-text">
                        {{ item.reversed ? item.card.meaning_rev : item.card.meaning_up }}
                      </div>
                    </div>

                    <!-- Question-specific meaning -->
                    @if (question) {
                      <div class="meaning-block">
                        <div class="mb-label">In Context of Your Question</div>
                        @if (questionMeanings()[item.card.card_id]) {
                          <div class="mb-text ai-text">{{ questionMeanings()[item.card.card_id] }}</div>
                        } @else if (revealedSet().has(i)) {
                          <div class="mb-loading">
                            <span class="loading-dot"></span>
                            <span class="loading-dot"></span>
                            <span class="loading-dot"></span>
                            Reading the cards…
                          </div>
                        }
                      </div>
                    }

                  </div><!-- /re-meanings -->
                </div><!-- /re-row -->
              </div><!-- /re-entry -->
            }

            <!-- Save + Reset buttons after full reveal -->
            @if (allRevealed()) {
              <div class="after-reveal">
                <div class="ar-rule"></div>
                @if (!isSaved()) {
                  <button class="save-btn" (click)="saveReading()">Save This Reading</button>
                } @else {
                  <div class="saved-msg">✓ Reading saved</div>
                }
                <button class="reset-btn" (click)="resetAll()">New Reading</button>
              </div>
            }
          </div><!-- /reveal-entries -->
        }

      </section><!-- /zone-reveal -->

    </div><!-- /app -->
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    :host { display: block; }

    /* ─── App shell — scroll-snap ─────────────────────────────────── */
    .app {
      position: relative;
      height: 100vh;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      scroll-behavior: smooth;
      background: #0b0714;
      font-family: 'Cormorant Garamond', serif;
      color: #e8d8b4;
    }
    #bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }

    /* ─── Zones ───────────────────────────────────────────────────── */
    .zone {
      scroll-snap-align: start;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .zone-start   { justify-content: center; padding: 0 16px; }
    .zone-deck    { padding: 20px 0 16px; gap: 8px; overflow: hidden; }
    .zone-reveal  { padding: 28px 20px 60px; gap: 0; }

    /* ─── Hamburger ───────────────────────────────────────────────── */
    .ham-wrap { position: fixed; top: 14px; left: 14px; z-index: 3000; }
    .ham-btn {
      width: 40px; height: 40px;
      background: rgba(11,7,20,.90); border: 1px solid rgba(201,168,76,.35);
      border-radius: 10px; cursor: pointer;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 5px; padding: 0;
      backdrop-filter: blur(6px); transition: border-color .25s;
    }
    .ham-btn:hover { border-color: rgba(201,168,76,.7); }
    .ham-btn span  { display: block; width: 18px; height: 1.5px; background: #c9a84c; border-radius: 2px; }
    .ham-backdrop  { position: fixed; inset: 0; z-index: 2999; }
    .ham-drawer {
      position: absolute; top: calc(100% + 8px); left: 0;
      background: rgba(11,5,24,.97); border: 1px solid rgba(201,168,76,.22);
      border-radius: 14px; padding: 8px; min-width: 200px;
      z-index: 3001; backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,.65);
      display: flex; flex-direction: column; gap: 2px;
    }
    .ham-head {
      font-size: .58rem; letter-spacing: .25em; color: rgba(201,168,76,.40);
      text-transform: uppercase; padding: 4px 8px 8px;
      border-bottom: 1px solid rgba(201,168,76,.10); margin-bottom: 4px;
    }
    .ham-item {
      display: block; font-family: inherit; font-size: .82rem;
      letter-spacing: .08em; color: #e8d8b4; background: none; border: none;
      border-radius: 8px; padding: 10px 12px; text-align: left;
      text-decoration: none; cursor: pointer; transition: background .2s;
    }
    .ham-item:hover { background: rgba(201,168,76,.10); color: #c9a84c; }
    .ham-logout { color: rgba(232,216,180,.55); }

    /* ─── Count badge ─────────────────────────────────────────────── */
    .count-badge {
      position: fixed; top: 14px; right: 14px; z-index: 2000;
      background: rgba(11,7,20,.90); border: 1px solid rgba(201,168,76,.25);
      border-radius: 20px; padding: 6px 14px;
      font-size: .78rem; color: rgba(201,168,76,.40);
      letter-spacing: .10em; backdrop-filter: blur(6px);
      transition: border-color .3s, color .3s, box-shadow .3s;
    }
    .count-badge.has-cards {
      color: #c9a84c; border-color: rgba(201,168,76,.60);
      box-shadow: 0 0 12px rgba(201,168,76,.20);
    }
    .badge-of { opacity: .45; }

    /* ─── Zone 1: Start ───────────────────────────────────────────── */
    .start-content {
      display: flex; flex-direction: column; align-items: center;
      gap: 20px; width: 100%; max-width: 500px;
    }
    .hdr { text-align: center; }
    .hdr-title {
      font-family: 'Cinzel Decorative', serif; font-size: 1.7rem; color: #f0d87a;
      letter-spacing: .14em;
      text-shadow: 0 0 28px rgba(201,168,76,.55), 0 0 60px rgba(123,47,191,.4);
    }
    .hdr-sub {
      font-size: .65rem; letter-spacing: .4em; color: rgba(201,168,76,.35);
      text-transform: uppercase; margin-top: 5px;
    }
    .hdr-rule {
      width: 120px; height: 1px;
      background: linear-gradient(90deg, transparent, #c9a84c, transparent);
      margin: 10px auto 0; opacity: .45;
    }
    .start-prompt {
      font-size: 1.05rem; color: rgba(232,216,180,.65); letter-spacing: .05em;
      font-style: italic;
    }

    /* Spread grid */
    .spread-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 10px; width: min(380px, 92vw);
    }
    .spread-opt {
      display: flex; flex-direction: column; align-items: center; gap: 7px;
      padding: 16px 10px; background: rgba(255,255,255,.04);
      border: 1px solid rgba(201,168,76,.18); border-radius: 14px;
      cursor: pointer; transition: background .25s, border-color .25s, box-shadow .25s;
      font-family: inherit;
    }
    .spread-opt:hover { background: rgba(201,168,76,.10); border-color: rgba(201,168,76,.45); }
    .spread-opt.active {
      background: rgba(201,168,76,.12); border-color: rgba(201,168,76,.65);
      box-shadow: 0 0 20px rgba(201,168,76,.15);
    }
    .so-icon  { font-size: 1.3rem; color: rgba(201,168,76,.70); }
    .so-label { font-size: .78rem; color: #e8d8b4; letter-spacing: .04em; text-align: center; }
    .so-size  { font-size: .60rem; color: rgba(201,168,76,.45); letter-spacing: .08em; }

    /* Question */
    .q-wrap { width: min(380px, 92vw); }
    .q-label {
      font-size: .62rem; letter-spacing: .22em; color: rgba(201,168,76,.48);
      text-transform: uppercase; margin-bottom: 7px;
    }
    .q-opt { color: rgba(201,168,76,.30); font-size: .55rem; }
    .q-input {
      width: 100%; box-sizing: border-box;
      background: rgba(255,255,255,.04); border: 1px solid rgba(201,168,76,.22);
      border-radius: 10px; padding: 11px 14px;
      font-family: 'Cormorant Garamond', serif; font-size: .95rem; color: #e8d8b4;
      outline: none; transition: border-color .3s; caret-color: #c9a84c;
    }
    .q-input::placeholder { color: rgba(232,216,180,.35); font-style: italic; }
    .q-input:focus { border-color: rgba(201,168,76,.50); }

    /* Begin button */
    .begin-btn {
      font-family: 'Cinzel Decorative', serif; font-size: .76rem;
      letter-spacing: .18em; color: #0b0714;
      background: linear-gradient(135deg, #b8922e, #f0d87a, #b8922e);
      border: none; border-radius: 50px; padding: 14px 40px;
      cursor: pointer; box-shadow: 0 4px 22px rgba(201,168,76,.35);
      transition: box-shadow .3s, transform .3s; text-transform: uppercase;
    }
    .begin-btn:hover {
      box-shadow: 0 6px 32px rgba(201,168,76,.55); transform: translateY(-2px);
    }
    .begin-arrow { margin-left: 6px; }

    /* ─── Zone 2: Deck ────────────────────────────────────────────── */
    .zone-header { text-align: center; padding: 4px 0; }
    .zh-title {
      font-family: 'Cinzel Decorative', serif; font-size: .88rem;
      letter-spacing: .16em; color: #f0d87a; text-transform: uppercase;
    }
    .zh-sub { font-size: .68rem; color: rgba(201,168,76,.45); letter-spacing: .10em; margin-top: 4px; }

    /* Progress dots */
    .deck-footer {
      display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 6px 0;
    }
    .deck-progress { display: flex; gap: 8px; }
    .dp-dot {
      width: 8px; height: 8px; border-radius: 50%;
      border: 1px solid rgba(201,168,76,.40); transition: background .3s, border-color .3s;
    }
    .dp-dot.filled { background: #c9a84c; border-color: #c9a84c; }
    .scroll-cta {
      font-family: inherit; font-size: .70rem; letter-spacing: .14em;
      color: #c9a84c; background: rgba(201,168,76,.08);
      border: 1px solid rgba(201,168,76,.35); border-radius: 20px;
      padding: 7px 20px; cursor: pointer; transition: all .25s;
    }
    .scroll-cta:hover { background: rgba(201,168,76,.16); border-color: rgba(201,168,76,.65); }

    /* ─── Zone 3: Reveal ──────────────────────────────────────────── */
    .rv-question {
      width: min(560px, 92vw); text-align: center;
      font-size: 1.05rem; color: rgba(232,216,180,.55); font-style: italic;
      padding: 0 0 16px; letter-spacing: .04em;
      border-bottom: 1px solid rgba(201,168,76,.12); margin-bottom: 8px;
    }

    .rv-empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 14px; padding: 60px 0; color: rgba(232,216,180,.30);
      font-size: .88rem; letter-spacing: .06em; text-align: center;
    }
    .rve-icon { font-size: 2.5rem; color: rgba(201,168,76,.20); }
    .rve-back {
      font-family: inherit; font-size: .70rem; letter-spacing: .12em;
      color: rgba(201,168,76,.50); background: none; border: 1px solid rgba(201,168,76,.25);
      border-radius: 20px; padding: 7px 18px; cursor: pointer; transition: all .25s;
    }
    .rve-back:hover { color: #c9a84c; border-color: rgba(201,168,76,.55); }

    /* Face-down cards */
    .facedown-wrap {
      display: flex; flex-direction: column; align-items: center; gap: 28px;
      padding: 16px 0;
    }
    .facedown-row {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;
    }
    .fd-slot { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .fd-card { perspective: 1000px; }
    .fd-back {
      width: 100px; height: 160px; border-radius: 10px;
      background: linear-gradient(160deg, #1c0a3a 0%, #0d0522 50%, #1c0a3a 100%);
      border: 1px solid rgba(201,168,76,.35);
      box-shadow: 0 8px 24px rgba(0,0,0,.55);
      position: relative;
    }
    .fd-back::before {
      content: ''; position: absolute; inset: 7px;
      border: 1px solid rgba(201,168,76,.12); border-radius: 6px;
    }
    .fd-back::after {
      content: '✦'; position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; color: rgba(201,168,76,.18);
    }
    .fd-pos {
      font-size: .60rem; letter-spacing: .18em; color: rgba(201,168,76,.45);
      text-transform: uppercase;
    }
    .fd-return {
      font-family: inherit; font-size: .60rem; color: rgba(232,216,180,.30);
      background: none; border: 1px solid rgba(255,255,255,.06);
      border-radius: 6px; padding: 3px 10px; cursor: pointer; transition: all .2s;
    }
    .fd-return:hover { color: #c9a84c; border-color: rgba(201,168,76,.35); }

    .reveal-btn {
      font-family: 'Cinzel Decorative', serif; font-size: .78rem;
      letter-spacing: .18em; color: #0b0714;
      background: linear-gradient(135deg, #b8922e, #f0d87a, #b8922e);
      border: none; border-radius: 50px; padding: 15px 44px;
      cursor: pointer; box-shadow: 0 4px 24px rgba(201,168,76,.40);
      transition: box-shadow .3s, transform .3s;
    }
    .reveal-btn:hover { box-shadow: 0 6px 34px rgba(201,168,76,.60); transform: translateY(-2px); }

    /* ─── Reveal entries ──────────────────────────────────────────── */
    .reveal-entries { width: min(680px, 96vw); display: flex; flex-direction: column; gap: 0; }
    .re-entry { opacity: 0; transform: translateY(20px); transition: opacity .5s, transform .5s; padding: 24px 0; }
    .re-entry.visible { opacity: 1; transform: none; }

    /* Separator */
    .re-sep { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .sep-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(201,168,76,.30), transparent); }
    .sep-label { font-size: .60rem; letter-spacing: .28em; color: rgba(201,168,76,.50); text-transform: uppercase; white-space: nowrap; }

    /* Card row layout */
    .re-row { display: flex; gap: 24px; align-items: flex-start; }
    @media (max-width: 560px) { .re-row { flex-direction: column; align-items: center; } }

    /* ─── 3D Flip Card ────────────────────────────────────────────── */
    .flip-wrap { perspective: 1400px; width: 160px; height: 256px; flex-shrink: 0; }
    .flip-inner {
      width: 100%; height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.90s cubic-bezier(.45,.05,.45,1);
    }
    .flip-inner.flipped { transform: rotateY(180deg); }

    .flip-face {
      position: absolute; inset: 0;
      backface-visibility: hidden; border-radius: 12px; overflow: hidden;
    }

    /* Card back */
    .flip-back {
      background: linear-gradient(160deg, #1c0a3a 0%, #0d0522 50%, #1c0a3a 100%);
      border: 1px solid rgba(201,168,76,.40);
      box-shadow: 0 8px 28px rgba(0,0,0,.60);
    }
    .flip-back::before {
      content: ''; position: absolute; inset: 8px;
      border: 1px solid rgba(201,168,76,.14); border-radius: 7px;
    }
    .flip-back::after {
      content: '✦'; position: absolute; inset: 0;
      display: flex; align-items: center; justify-content: center;
      font-size: 36px; color: rgba(201,168,76,.22);
    }

    /* Card front */
    .flip-front {
      transform: rotateY(180deg);
      display: flex; align-items: stretch;
      border: 1px solid rgba(201,168,76,.40);
      box-shadow: 0 8px 28px rgba(0,0,0,.60);
    }
    /* Suit gradients */
    .suit-major     { background: linear-gradient(160deg, #1a0636 0%, #4a0d9e 100%); }
    .suit-cups      { background: linear-gradient(160deg, #061836 0%, #0d4e9e 100%); }
    .suit-wands     { background: linear-gradient(160deg, #361606 0%, #9e4d0d 100%); }
    .suit-swords    { background: linear-gradient(160deg, #0f1836 0%, #2d4e9e 100%); }
    .suit-pentacles { background: linear-gradient(160deg, #061806 0%, #0d6e0d 100%); }

    /* Reversed card — rotate content inside the front face */
    .flip-front.reversed .card-img,
    .flip-front.reversed .card-overlay { transform: rotate(180deg); }

    .card-img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 1;
    }
    .card-overlay {
      position: absolute; inset: 0; z-index: 2;
      display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
      padding: 10px 6px;
      background: linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 55%);
    }
    .co-number { font-size: .55rem; color: rgba(201,168,76,.70); letter-spacing: .15em; }
    .co-glyph  { font-size: .85rem; color: rgba(201,168,76,.45); margin: 2px 0; }
    .co-name   { font-size: .68rem; color: #f0d87a; letter-spacing: .06em; text-align: center; text-shadow: 0 1px 4px rgba(0,0,0,.8); }

    /* ─── Meanings panel ──────────────────────────────────────────── */
    .re-meanings {
      flex: 1; min-width: 0;
      opacity: 0; transform: translateX(10px);
      transition: opacity .55s ease .75s, transform .55s ease .75s;
      pointer-events: none;
    }
    .re-meanings.visible { opacity: 1; transform: none; pointer-events: auto; }

    .rm-name {
      font-family: 'Cinzel Decorative', serif; font-size: .95rem;
      color: #f0d87a; letter-spacing: .10em; margin-bottom: 6px;
    }
    .rm-orient {
      font-size: .65rem; letter-spacing: .12em; color: rgba(232,216,180,.50); margin-bottom: 6px;
    }
    .rm-orient.rev { color: rgba(201,168,76,.65); }
    .rm-keywords {
      font-size: .65rem; color: rgba(201,168,76,.45); letter-spacing: .06em;
      font-style: italic; margin-bottom: 16px;
      padding-bottom: 12px; border-bottom: 1px solid rgba(201,168,76,.12);
    }

    .meaning-block { margin-bottom: 14px; }
    .mb-label {
      font-size: .58rem; letter-spacing: .22em; color: rgba(201,168,76,.45);
      text-transform: uppercase; margin-bottom: 6px;
    }
    .mb-text {
      font-size: .84rem; color: rgba(232,216,180,.80); line-height: 1.65;
      letter-spacing: .02em;
    }
    .ai-text { color: #e8d8b4; }
    .mb-loading {
      font-size: .75rem; color: rgba(201,168,76,.40); letter-spacing: .08em;
      display: flex; align-items: center; gap: 6px;
    }
    .loading-dot {
      display: inline-block; width: 5px; height: 5px; border-radius: 50%;
      background: rgba(201,168,76,.40);
      animation: pulse-dot 1.4s ease-in-out infinite;
    }
    .loading-dot:nth-child(2) { animation-delay: .2s; }
    .loading-dot:nth-child(3) { animation-delay: .4s; }
    @keyframes pulse-dot {
      0%, 80%, 100% { transform: scale(0.6); opacity: .4; }
      40%            { transform: scale(1.0); opacity: 1;  }
    }

    /* ─── After-reveal actions ────────────────────────────────────── */
    .after-reveal {
      display: flex; flex-direction: column; align-items: center;
      gap: 14px; padding: 32px 0 16px;
    }
    .ar-rule {
      width: 100%; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(201,168,76,.25), transparent);
      margin-bottom: 8px;
    }
    .save-btn {
      font-family: 'Cormorant Garamond', serif; font-size: .78rem;
      letter-spacing: .16em; color: #0b0714;
      background: linear-gradient(135deg, #b8922e, #f0d87a, #b8922e);
      border: none; border-radius: 50px; padding: 12px 36px;
      cursor: pointer; box-shadow: 0 4px 18px rgba(201,168,76,.30);
      transition: box-shadow .3s, transform .2s; text-transform: uppercase;
    }
    .save-btn:hover { box-shadow: 0 6px 28px rgba(201,168,76,.50); transform: translateY(-1px); }
    .saved-msg { font-size: .78rem; color: rgba(201,168,76,.70); letter-spacing: .14em; }
    .reset-btn {
      font-family: 'Cormorant Garamond', serif; font-size: .72rem;
      letter-spacing: .14em; color: rgba(232,216,180,.45); background: none;
      border: 1px solid rgba(255,255,255,.10); border-radius: 20px;
      padding: 8px 22px; cursor: pointer; transition: all .25s;
    }
    .reset-btn:hover { color: #c9a84c; border-color: rgba(201,168,76,.35); }
  `],
})
export class ReadingComponent implements OnInit {
  @ViewChild(CardDeckComponent) deckRef!: CardDeckComponent;

  private api  = inject(ApiService);
  private auth = inject(AuthService);

  // ── Card data ───────────────────────────────────────────────────────────
  allCards = signal<TarotCard[]>([]);

  // ── Zone 1: Spread + question ───────────────────────────────────────────
  spreadType = signal('three_card');
  spreadSize = computed(() => SPREAD_CONFIGS[this.spreadType()]?.size ?? 1);
  question   = '';

  // ── Zone 2: Selection ───────────────────────────────────────────────────
  selectedItems = signal<CardSelectionItem[]>([]);

  // ── Zone 3: Reveal ──────────────────────────────────────────────────────
  revealedSet      = signal<Set<number>>(new Set());
  isRevealing      = signal(false);
  questionMeanings = signal<Record<string, string>>({});
  isSaved          = signal(false);

  allRevealed = computed(() =>
    this.revealedSet().size >= this.selectedItems().length &&
    this.selectedItems().length > 0
  );

  progressDots = computed(() =>
    Array.from({ length: this.spreadSize() }, (_, i) => i)
  );

  // ── UI ──────────────────────────────────────────────────────────────────
  menuOpen    = signal(false);
  /** Active card art theme — matches folder under /assets/cards/{theme}/ */
  cardTheme   = signal<string>('original');

  readonly spreads: SpreadDef[] = [
    { key: 'single',       label: 'Single Card',             size: 1,  icon: '✦'    },
    { key: 'three_card',   label: 'Past · Present · Future', size: 3,  icon: '◈◈◈'  },
    { key: 'horseshoe',    label: 'Horseshoe',               size: 7,  icon: '◐◑◐'  },
    { key: 'celtic_cross', label: 'Celtic Cross',            size: 10, icon: '✚'    },
  ];

  currentSpreadLabel = computed(() =>
    SPREAD_CONFIGS[this.spreadType()]?.label ?? 'Select Style'
  );

  // ── Lifecycle ───────────────────────────────────────────────────────────
  ngOnInit() {
    this.api.getAllCards().subscribe({
      next: cards => this.allCards.set(cards),
      error: () => console.error('Could not load cards'),
    });
    this.initBG();
  }

  // ── Spread selection: reset everything ──────────────────────────────────
  selectSpread(key: string) {
    this.spreadType.set(key);
    this.selectedItems.set([]);
    this.revealedSet.set(new Set());
    this.isRevealing.set(false);
    this.questionMeanings.set({});
    this.isSaved.set(false);
    // card-deck resets automatically via ngOnChanges([spreadSize])
  }

  onSelectionChange(items: CardSelectionItem[]) {
    this.selectedItems.set(items);
    // Reset reveal if they change their selection
    if (this.revealedSet().size > 0 || this.isRevealing()) {
      this.revealedSet.set(new Set());
      this.isRevealing.set(false);
      this.questionMeanings.set({});
      this.isSaved.set(false);
    }
  }

  returnCard(i: number) {
    this.deckRef?.returnCard(i);
  }

  spreadPosition(i: number): string {
    return SPREAD_CONFIGS[this.spreadType()]?.positions[i] ?? `Card ${i + 1}`;
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  // ── Reveal sequence ─────────────────────────────────────────────────────
  startReveal() {
    if (this.isRevealing()) return;
    this.isRevealing.set(true);
    this.revealedSet.set(new Set());

    this.selectedItems().forEach((item, i) => {
      setTimeout(() => {
        this.revealedSet.update(s => new Set([...s, i]));
        if (this.question.trim()) {
          this.fetchInterpretation(item, i);
        }
      }, i * 1500 + 350);
    });
  }

  private fetchInterpretation(item: CardSelectionItem, i: number) {
    this.api.interpretCard({
      question: this.question,
      card_id:  item.card.card_id,
      position: this.spreadPosition(i),
      reversed: item.reversed,
    }).subscribe({
      next: (res) => {
        this.questionMeanings.update(m => ({ ...m, [item.card.card_id]: res.meaning }));
      },
      error: () => {
        const kws = item.reversed ? item.card.keywords_rev : item.card.keywords_up;
        this.questionMeanings.update(m => ({
          ...m,
          [item.card.card_id]: `Key themes in this position: ${kws.join(', ')}.`,
        }));
      },
    });
  }

  /** Build the card image URL for the current theme */
  cardImageUrl(cardId: string): string {
    return `/assets/cards/${this.cardTheme()}/${cardId}.webp`;
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }

  // ── Save ────────────────────────────────────────────────────────────────
  saveReading() {
    if (this.isSaved()) return;
    const items = this.selectedItems();
    const payload = {
      question:    this.question || undefined,
      spread_type: this.spreadType(),
      drawn_cards: items.map((item, i) => ({
        card_id:  item.card.card_id,
        position: this.spreadPosition(i),
        reversed: item.reversed,
      })),
    };
    this.api.createReading(payload).subscribe({
      next: () => this.isSaved.set(true),
      error: (e) => console.error('Save failed', e),
    });
  }

  // ── Reset ───────────────────────────────────────────────────────────────
  resetAll() {
    this.selectedItems.set([]);
    this.revealedSet.set(new Set());
    this.isRevealing.set(false);
    this.questionMeanings.set({});
    this.isSaved.set(false);
    this.question = '';
    this.deckRef?.resetDeck();
    this.scrollTo('zone-start');
  }

  logout() { this.auth.logout(); }

  // ── WebGL background ────────────────────────────────────────────────────
  private initBG() {
    setTimeout(() => {
      const c = document.getElementById('bg') as HTMLCanvasElement;
      if (!c) return;
      c.width = window.innerWidth; c.height = window.innerHeight;
      const gl = c.getContext('webgl');
      if (!gl) return;

      const vs = `attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
      const fs = `
        precision mediump float; varying vec2 v; uniform float t;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5); }
        float noise(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y); }
        float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.1;a*=.48;} return v; }
        void main(){
          float tt=t*0.008, bt=sin(t*.018)*.5+.5, bt2=sin(t*.011+1.3)*.5+.5;
          vec2 uv=v;
          float a=fbm(uv*1.8+vec2(tt,tt*.55))*.65+fbm(uv*3.5-vec2(tt*.4,tt))*.35;
          vec3 col=mix(vec3(.03,.01,.06),vec3(.07,.02,.17),a);
          col=mix(col,vec3(.11,.04,.28),smoothstep(.42,.70,a)*.6);
          col=mix(col,vec3(.18,.07,.40),smoothstep(.60,.85,a)*bt*.45);
          float d=length(uv-.5), pu=exp(-d*6.5)*bt2*.22;
          col+=vec3(.30,.12,.55)*pu; col+=vec3(.55,.38,.10)*pu*.35;
          col+=vec3(.50,.36,.10)*noise(uv*7.+vec2(tt*1.2,-tt))*bt*.018;
          col*=(1.-smoothstep(.22,1.05,d*2.0))*(0.82+bt*.18);
          gl_FragColor=vec4(col,1.);
        }`;

      const mk = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh,s); gl.compileShader(sh); return sh; };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, mk(gl.VERTEX_SHADER, vs));
      gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(pr); gl.useProgram(pr);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(pr, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const uT = gl.getUniformLocation(pr, 't');
      const start = performance.now();
      const loop = () => { gl.uniform1f(uT, (performance.now()-start)/1000); gl.drawArrays(gl.TRIANGLE_STRIP,0,4); requestAnimationFrame(loop); };
      loop();
    }, 100);
  }
}
