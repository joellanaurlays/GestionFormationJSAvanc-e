import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon-wrapper">
          <mat-icon>block</mat-icon>
        </div>
        <h1>Accès non autorisé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Retour
          </button>
          <button mat-raised-button (click)="goHome()">
            <mat-icon>home</mat-icon>
            Accueil
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../styles.scss';
    
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7f5 0%, #CDE8D4 100%);
      
      .unauthorized-content {
        text-align: center;
        padding: 40px;
        max-width: 500px;
        
        .icon-wrapper {
          width: 100px;
          height: 100px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          mat-icon {
            font-size: 50px;
            width: 50px;
            height: 50px;
            color: white;
          }
        }
        
        h1 {
          color: #c0392b;
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        
        p {
          color: #666;
          font-size: 16px;
          margin-bottom: 24px;
        }
        
        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          
          button {
            min-width: 120px;
            
            mat-icon {
              margin-right: 8px;
            }
          }
        }
      }
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}