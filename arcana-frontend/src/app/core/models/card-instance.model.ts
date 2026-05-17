import { TarotCard } from './card.model';

// ─── Animation phase ─────────────────────────────────────────────────────────
export type CardAnimPhase =
  | 'idle'       // นิ่งอยู่ในสำรับ
  | 'hover'      // ถูก hover / active โดย slider
  | 'selected'   // ถูกเลือก ลอยขึ้น
  | 'flipping'   // กำลังพลิก (กลางอนิเมชัน)
  | 'revealed';  // เปิดหน้าแล้ว

// ─── TarotCardInstance ────────────────────────────────────────────────────────
/**
 * Object แทนการ์ดไพ่ 1 ใบในสำรับ
 *
 * - id             : หมายเลขลำดับจริงของไพ่ (0–77)
 * - name           : ชื่อไพ่
 * - indexInDeck    : ลำดับที่ในการวางเรียง (0 = ใบซ้ายสุด)
 * - position       : [x, y] จุดกึ่งกลางการ์ดในพิกเซล (relative to stage)
 * - offset         : [x, y] ระยะขยับเพิ่ม เพื่อเลียนแบบการกรีดไพ่จริง
 * - rotation       : องศาหมุน (deg) เพื่อ fan effect
 * - elevation      : การลอยตัว (px) เมื่อ hover / selected
 * - zIndex         : ลำดับ z (ใบที่ active จะอยู่บนสุด)
 * - scale          : ขนาด เริ่มต้น 1.0
 * - isSelected     : ถูกเลือกหรือไม่
 * - isRevealed     : เปิดหน้าแล้วหรือยัง
 * - isReversed     : กลับหัว (reversed reading)
 * - animPhase      : ขั้นตอน animation ปัจจุบัน
 * - cardData       : ข้อมูลไพ่จาก dataset (TarotCard)
 */
export class TarotCardInstance {
  // ── Core identity ───────────────────────────────────────────────────────────
  readonly id: number;
  readonly name: string;
  readonly cardData: TarotCard;

  // ── Deck layout ─────────────────────────────────────────────────────────────
  indexInDeck: number;          // ลำดับในสำรับ (เปลี่ยนได้เมื่อ reshuffle)
  position: [number, number];   // [x, y] ตำแหน่งจริงบน stage (px)
  offset: [number, number];     // [x, y] drift เพิ่มเพื่อความสมจริง

  // ── Visual state ────────────────────────────────────────────────────────────
  rotation: number;             // องศา fan (deg)
  elevation: number;            // px ยกสูง เมื่อ selected / hover
  zIndex: number;               // z-order
  scale: number;                // 1.0 = ขนาดปกติ

  // ── Interaction state ───────────────────────────────────────────────────────
  isSelected: boolean;
  isRevealed: boolean;
  isReversed: boolean;
  animPhase: CardAnimPhase;

  // ── Constructor ─────────────────────────────────────────────────────────────
  constructor(cardData: TarotCard, indexInDeck: number) {
    this.cardData     = cardData;
    this.id           = TarotCardInstance.parseNumericId(cardData.card_id);
    this.name         = cardData.name;
    this.indexInDeck  = indexInDeck;
    this.position     = [0, 0];
    this.offset       = [0, 0];
    this.rotation     = 0;
    this.elevation    = 0;
    this.zIndex       = indexInDeck;
    this.scale        = 1.0;
    this.isSelected   = false;
    this.isRevealed   = false;
    this.isReversed   = false;
    this.animPhase    = 'idle';
  }

  // ── Static helpers ──────────────────────────────────────────────────────────

  /**
   * แปลง card_id (e.g. "major_0", "cups_ace") → numeric index 0–77
   * Major 0–21, Cups 22–35, Wands 36–49, Swords 50–63, Pentacles 64–77
   */
  static parseNumericId(cardId: string): number {
    const SUIT_OFFSET: Record<string, number> = {
      major: 0, cups: 22, wands: 36, swords: 50, pentacles: 64,
    };
    const RANK_ORDER: Record<string, number> = {
      ace: 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
      '7': 6, '8': 7, '9': 8, '10': 9, page: 10, knight: 11, queen: 12, king: 13,
    };
    const [suit, rank] = cardId.split('_');
    if (suit === 'major') return parseInt(rank, 10);
    return (SUIT_OFFSET[suit] ?? 22) + (RANK_ORDER[rank] ?? 0);
  }

  /**
   * คำนวณตำแหน่งและ rotation สำหรับ fan spread
   * @param rowSize    จำนวนการ์ดต่อแถว
   * @param cardW      ความกว้างการ์ด (px)
   * @param cardH      ความสูงการ์ด (px)
   * @param overlap    ระยะซ้อนทับกัน (px) เลียนแบบการกรีดไพ่จริง
   */
  placeInFan(rowSize: number, cardW = 72, cardH = 116, overlap = 52): void {
    const row    = Math.floor(this.indexInDeck / rowSize);
    const col    = this.indexInDeck % rowSize;
    const rowMid = (rowSize - 1) / 2;

    // ── x: วางทับกัน overlap ───────────────────────────────────────────────
    const baseX = col * (cardW - overlap);
    // offset drift: เพิ่มการสั่นเล็กน้อยเหมือนกรีดมือจริง (deterministic ตาม index)
    const driftX = Math.sin(this.indexInDeck * 1.7) * 2.5;
    const driftY = Math.cos(this.indexInDeck * 2.3) * 1.8;

    this.position = [baseX, row * (cardH + 8)];
    this.offset   = [driftX, driftY];

    // ── rotation: พัดออกจากจุดกึ่งกลาง ──────────────────────────────────────
    this.rotation = (col - rowMid) * 2.4;

    this.zIndex = this.indexInDeck;
  }

  // ── State transitions ───────────────────────────────────────────────────────

  /** เลื่อน hover — ยกขึ้นเล็กน้อย */
  hover(): void {
    if (this.animPhase === 'idle') {
      this.elevation  = 12;
      this.scale      = 1.04;
      this.animPhase  = 'hover';
    }
  }

  /** ยกเลิก hover */
  unhover(): void {
    if (this.animPhase === 'hover') {
      this.elevation = 0;
      this.scale     = 1.0;
      this.animPhase = 'idle';
    }
  }

  /** เลือกการ์ดใบนี้ — ยกสูงขึ้น, scale ใหญ่ขึ้น, zIndex สูงสุด */
  select(totalCards: number): void {
    this.isSelected = true;
    this.elevation  = 24;
    this.scale      = 1.08;
    this.zIndex     = totalCards + 10;
    this.animPhase  = 'selected';
  }

  /** ยกเลิกการเลือก */
  deselect(): void {
    this.isSelected = false;
    this.elevation  = 0;
    this.scale      = 1.0;
    this.zIndex     = this.indexInDeck;
    this.animPhase  = 'idle';
  }

  /** เริ่ม flip — transition ไปสู่ revealed */
  flip(reversed: boolean): void {
    this.isReversed = reversed;
    this.animPhase  = 'flipping';
  }

  /** เสร็จสิ้น flip */
  reveal(): void {
    this.isRevealed = true;
    this.animPhase  = 'revealed';
  }

  /** รีเซ็ตทุกอย่างกลับสู่สถานะเริ่มต้น */
  reset(): void {
    this.isSelected = false;
    this.isRevealed = false;
    this.isReversed = false;
    this.elevation  = 0;
    this.scale      = 1.0;
    this.zIndex     = this.indexInDeck;
    this.animPhase  = 'idle';
  }

  // ── Computed CSS ────────────────────────────────────────────────────────────

  /** CSS transform string สำหรับ bind ใน template โดยตรง */
  get transform(): string {
    const tx = this.position[0] + this.offset[0];
    const ty = this.position[1] + this.offset[1] - this.elevation;
    const rev = this.isRevealed && this.isReversed ? ' rotateZ(180deg)' : '';
    return `translate(${tx}px, ${ty}px) rotate(${this.rotation}deg) scale(${this.scale})${rev}`;
  }

  /** ข้อความแสดงผล (debug / aria-label) */
  toString(): string {
    const orient  = this.isReversed ? 'Reversed' : 'Upright';
    const state   = this.animPhase.toUpperCase();
    return `[${this.id}] ${this.name} (idx:${this.indexInDeck} | ${orient} | ${state})`;
  }

  /** ความหมายที่ถูกต้องตาม orientation */
  get activeMeaning(): string {
    return this.isReversed ? this.cardData.meaning_rev : this.cardData.meaning_up;
  }

  /** keywords ที่ถูกต้องตาม orientation */
  get activeKeywords(): string[] {
    return this.isReversed ? this.cardData.keywords_rev : this.cardData.keywords_up;
  }
}
