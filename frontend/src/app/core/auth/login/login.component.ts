import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-wrapper">
        <mat-card class="login-card">
          <div class="login-header">
            <div class="logo-icon">
              <mat-icon>school</mat-icon>
            </div>
            <h1>Gestion Formation</h1>
            <p>Continue des Enseignants</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="exemple@email.com">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  L'email est requis
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Email invalide
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mot de passe</mat-label>
                <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Le mot de passe est requis
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  Minimum 6 caractères
                </mat-error>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" class="btn-login"
                      [disabled]="loginForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Se connecter</span>
              </button>

              <div class="register-link">
                <span>Pas encore de compte ?</span>
                <a routerLink="/register">Créer un compte</a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
        
        <div class="login-footer">
          <p>© 2026 - DREN Formation Continue</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7f5 0%, #CDE8D4 100%);
      
      .login-wrapper {
        width: 100%;
        max-width: 420px;
        padding: 20px;
        
        .login-card {
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(101, 126, 71, 0.2);
          
          .login-header {
            text-align: center;
            margin-bottom: 32px;
            
            .logo-icon {
              width: 72px;
              height: 72px;
              margin: 0 auto 16px;
              background: linear-gradient(135deg, #657E47, #6C9B76);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              
              mat-icon {
                font-size: 40px;
                width: 40px;
                height: 40px;
                color: white;
              }
            }
            
            h1 {
              color: #657E47;
              font-weight: 600;
              margin: 0;
              font-size: 24px;
            }
            
            p {
              color: #666;
              margin: 4px 0 0;
            }
          }
          
          .full-width {
            width: 100%;
            margin-bottom: 16px;
          }
          
          .btn-login {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            background: linear-gradient(135deg, #657E47, #6C9B76) !important;
            color: white !important;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(101, 126, 71, 0.3);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
          }
          
          .register-link {
            text-align: center;
            margin-top: 20px;
            
            span {
              color: #666;
              margin-right: 8px;
            }
            
            a {
              color: #657E47;
              text-decoration: none;
              font-weight: 500;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        
        .login-footer {
          text-align: center;
          margin-top: 24px;
          
          p {
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Connexion réussie !', 'Fermer', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error?.message || '❌ Erreur de connexion', 'Fermer', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
