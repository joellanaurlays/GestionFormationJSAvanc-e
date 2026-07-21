import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <div class="register-wrapper">
        <mat-card class="register-card">
          <div class="register-header">
            <div class="logo-icon">
              <mat-icon>school</mat-icon>
            </div>
            <h1>Créer un compte</h1>
            <p>Gestion Formation Continue des Enseignants</p>
          </div>
          
          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Nom</mat-label>
                  <input matInput formControlName="nom" placeholder="Votre nom">
                  <mat-error *ngIf="registerForm.get('nom')?.hasError('required')">
                    Le nom est requis
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="half-width">
                  <mat-label>Prénom</mat-label>
                  <input matInput formControlName="prenom" placeholder="Votre prénom">
                  <mat-error *ngIf="registerForm.get('prenom')?.hasError('required')">
                    Le prénom est requis
                  </mat-error>
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" placeholder="exemple@email.com">
                <mat-icon matPrefix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  L'email est requis
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Email invalide
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mot de passe</mat-label>
                <input matInput formControlName="motDePass" [type]="hidePassword ? 'password' : 'text'" placeholder="Minimum 6 caractères">
                <mat-icon matPrefix>lock</mat-icon>
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('motDePass')?.hasError('required')">
                  Le mot de passe est requis
                </mat-error>
                <mat-error *ngIf="registerForm.get('motDePass')?.hasError('minlength')">
                  Minimum 6 caractères
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Rôle</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="enseignant">Enseignant</mat-option>
                  <mat-option value="formateur">Formateur</mat-option>
                  <mat-option value="administrateur">Administrateur</mat-option>
                </mat-select>
                <mat-error *ngIf="registerForm.get('role')?.hasError('required')">
                  Le rôle est requis
                </mat-error>
              </mat-form-field>

              <button mat-raised-button color="primary" type="submit" class="btn-register"
                      [disabled]="registerForm.invalid || isLoading">
                <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                <span *ngIf="!isLoading">Créer mon compte</span>
              </button>

              <div class="login-link">
                <span>Déjà un compte ?</span>
                <a routerLink="/login">Se connecter</a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
        
        <div class="register-footer">
          <p>© 2026 - DREN Formation Continue</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../styles.scss';
    
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7f5 0%, #CDE8D4 100%);
      padding: 20px;
      
      .register-wrapper {
        width: 100%;
        max-width: 520px;
        
        .register-card {
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 20px 60px rgba(101, 126, 71, 0.2);
          
          .register-header {
            text-align: center;
            margin-bottom: 24px;
            
            .logo-icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 12px;
              background: linear-gradient(135deg, #657E47, #6C9B76);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              
              mat-icon {
                font-size: 36px;
                width: 36px;
                height: 36px;
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
              font-size: 14px;
            }
          }
          
          .row {
            display: flex;
            gap: 16px;
            
            .half-width {
              flex: 1;
            }
          }
          
          .full-width {
            width: 100%;
            margin-bottom: 8px;
          }
          
          .btn-register {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            margin-top: 8px;
            background: linear-gradient(135deg, #657E47, #6C9B76) !important;
            color: white !important;
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(101, 126, 71, 0.3);
            }
            
            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
              transform: none;
            }
          }
          
          .login-link {
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
        
        .register-footer {
          text-align: center;
          margin-top: 20px;
          
          p {
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
    
    @media (max-width: 600px) {
      .row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePass: ['', [Validators.required, Validators.minLength(6)]],
      role: ['enseignant', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.snackBar.open('Compte créé avec succès !', 'Fermer', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error?.message || ' Erreur lors de l\'inscription', 'Fermer', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}