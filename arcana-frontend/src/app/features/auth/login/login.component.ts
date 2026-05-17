import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <canvas id="bg"></canvas>
      <div class="auth-card">
        <div class="hdr-title">Arcana</div>
        <div class="hdr-sub">Tarot · Major Arcana</div>
        <div class="hdr-rule"></div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="field">
            <label>อีเมล</label>
            <input type="email" formControlName="email" placeholder="your@email.com" autocomplete="email">
          </div>
          <div class="field">
            <label>รหัสผ่าน</label>
            <input type="password" formControlName="password" placeholder="••••••••" autocomplete="current-password">
          </div>

          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }

          <button type="submit" class="draw-btn" [disabled]="loading() || form.invalid">
            {{ loading() ? 'กำลังเข้าสู่ระบบ…' : '✦ เข้าสู่ระบบ ✦' }}
          </button>
        </form>

        <p class="auth-link">ยังไม่มีบัญชี? <a routerLink="/register">สมัครสมาชิก</a></p>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
    :host { display:block; }
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:#0b0714; font-family:'Cormorant Garamond',serif; color:#e8d8b4; }
    .auth-card { background:rgba(19,13,36,.95); border:1px solid rgba(201,168,76,.22);
      border-radius:18px; padding:40px 36px; width:min(400px,92vw); text-align:center;
      box-shadow:0 0 60px rgba(123,47,191,.3); }
    .hdr-title { font-family:'Cinzel Decorative',serif; font-size:1.55rem; color:#f0d87a;
      letter-spacing:.14em; text-shadow:0 0 28px rgba(201,168,76,.55); }
    .hdr-sub { font-size:.65rem; letter-spacing:.4em; color:rgba(201,168,76,.35); text-transform:uppercase; margin-top:5px; }
    .hdr-rule { width:120px; height:1px; background:linear-gradient(90deg,transparent,#c9a84c,transparent);
      margin:10px auto 28px; opacity:.45; }
    .auth-form { display:flex; flex-direction:column; gap:16px; }
    .field { display:flex; flex-direction:column; gap:6px; text-align:left; }
    .field label { font-size:.68rem; letter-spacing:.2em; color:rgba(201,168,76,.6); text-transform:uppercase; }
    .field input { background:rgba(255,255,255,.04); border:1px solid rgba(201,168,76,.22);
      border-radius:10px; padding:10px 14px; font-family:'Cormorant Garamond',serif;
      font-size:.95rem; color:#e8d8b4; outline:none; transition:border-color .3s; }
    .field input:focus { border-color:rgba(201,168,76,.5); }
    .draw-btn { font-family:'Cinzel Decorative',serif; font-size:.78rem; letter-spacing:.18em;
      color:#0b0714; background:linear-gradient(135deg,#b8922e,#f0d87a,#b8922e);
      border:none; padding:14px; border-radius:50px; cursor:pointer;
      box-shadow:0 4px 22px rgba(201,168,76,.35); transition:all .3s; margin-top:8px; }
    .draw-btn:disabled { opacity:.45; cursor:default; }
    .draw-btn:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 6px 32px rgba(201,168,76,.55); }
    .error-msg { color:#ff6b6b; font-size:.85rem; text-align:center; }
    .auth-link { margin-top:20px; font-size:.85rem; color:rgba(232,216,180,.5); }
    .auth-link a { color:#c9a84c; text-decoration:none; }
    .auth-link a:hover { color:#f0d87a; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = signal(false);
  error = signal('');

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/reading']),
      error: (err) => {
        this.error.set(err.error?.detail || 'เข้าสู่ระบบไม่สำเร็จ');
        this.loading.set(false);
      },
    });
  }
}
