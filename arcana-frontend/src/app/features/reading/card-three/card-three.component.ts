import {
  Component, Input, Output, EventEmitter,
  OnChanges, SimpleChanges, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, signal, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

/**
 * CardThreeComponent
 * Renders a single tarot card as a 3D flip animation using Three.js directly
 * (via a <canvas> hosted inside the component).
 *
 * Inputs:
 *   frontImage  – URL of the card face image
 *   backImage   – URL of the card back image
 *   revealed    – trigger the flip animation (false → back, true → front)
 *   reversed    – rotate the front 180° on Z-axis when upside-down
 *
 * Output:
 *   flipDone    – emits after the flip completes
 */
@Component({
  selector: 'app-card-three',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-canvas-wrap" [class.revealed]="revealed">
      <canvas #canvasEl></canvas>
    </div>
  `,
  styles: [`
    :host { display:block; }
    .card-canvas-wrap { width:130px; height:210px; display:block; }
    canvas { width:100% !important; height:100% !important; border-radius:14px;
      box-shadow:0 0 50px rgba(123,47,191,.5), 0 24px 50px rgba(0,0,0,.7); }
  `],
})
export class CardThreeComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() frontImage = '';
  @Input() backImage  = 'assets/cards/back.jpg';
  @Input() revealed   = false;
  @Input() reversed   = false;
  @Output() flipDone  = new EventEmitter<void>();

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private card!: THREE.Mesh;
  private animFrameId = 0;
  private targetRotY = 0;
  private currentRotY = 0;

  ngAfterViewInit() {
    this.initThree();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['revealed'] && this.card) {
      this.targetRotY = this.revealed ? Math.PI : 0;
    }
    if (changes['frontImage'] && this.card) {
      this.updateFrontTexture();
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrameId);
    this.renderer?.dispose();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const W = 130, H = 210;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(W, H, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    this.camera.position.z = 3.5;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const dir = new THREE.DirectionalLight(0xffeebb, 0.8);
    dir.position.set(2, 3, 4);
    this.scene.add(ambient, dir);

    // Card geometry (slightly rounded via a plane)
    const geo = new THREE.PlaneGeometry(1.8, 2.9);

    // Back material
    const backTex = this.makeBackTexture();
    const frontTex = this.frontImage
      ? new THREE.TextureLoader().load(this.frontImage)
      : this.makePlaceholderTexture();

    const backMat  = new THREE.MeshStandardMaterial({ map: backTex,  side: THREE.FrontSide });
    const frontMat = new THREE.MeshStandardMaterial({ map: frontTex, side: THREE.BackSide });

    // Two-sided card: back (face +Z) + front (face -Z, flipped by PI)
    this.card = new THREE.Group() as any;
    const backMesh  = new THREE.Mesh(geo, backMat);
    const frontMesh = new THREE.Mesh(geo, frontMat);
    (this.card as any as THREE.Group).add(backMesh, frontMesh);
    this.scene.add(this.card as any);

    this.animate();
  }

  private animate() {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.targetRotY - this.currentRotY;
    if (Math.abs(delta) > 0.001) {
      this.currentRotY += delta * 0.08;
      (this.card as any as THREE.Group).rotation.y = this.currentRotY;
    } else if (Math.abs(delta) > 0 && Math.abs(delta) <= 0.001) {
      this.currentRotY = this.targetRotY;
      (this.card as any as THREE.Group).rotation.y = this.targetRotY;
      if (this.revealed) this.flipDone.emit();
    }

    // Subtle float
    const t = Date.now() * 0.001;
    (this.card as any as THREE.Group).position.y = Math.sin(t) * 0.04;

    this.renderer.render(this.scene, this.camera);
  }

  private updateFrontTexture() {
    const loader = new THREE.TextureLoader();
    const group = this.card as any as THREE.Group;
    const frontMesh = group.children[1] as THREE.Mesh;
    const mat = frontMesh.material as THREE.MeshStandardMaterial;
    mat.map = loader.load(this.frontImage);
    mat.needsUpdate = true;
  }

  private makeBackTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    // Dark purple gradient
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, '#1c0d3a');
    grad.addColorStop(1, '#0b0714');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    // Diamond pattern
    ctx.strokeStyle = 'rgba(201,168,76,0.15)';
    ctx.lineWidth = 1;
    for (let i = -256; i < 512; i += 18) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 256, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - 256, 256); ctx.stroke();
    }
    // Center star
    ctx.fillStyle = 'rgba(201,168,76,0.3)';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦', 128, 128);
    // Border
    ctx.strokeStyle = 'rgba(201,168,76,0.35)';
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 248, 248);
    return new THREE.CanvasTexture(canvas);
  }

  private makePlaceholderTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 412;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 256, 412);
    grad.addColorStop(0, '#1c0d3a'); grad.addColorStop(1, '#100820');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 412);
    ctx.strokeStyle = 'rgba(201,168,76,0.4)'; ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 406);
    ctx.fillStyle = 'rgba(201,168,76,0.5)';
    ctx.font = 'bold 64px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('✦', 128, 206);
    return new THREE.CanvasTexture(canvas);
  }
}
