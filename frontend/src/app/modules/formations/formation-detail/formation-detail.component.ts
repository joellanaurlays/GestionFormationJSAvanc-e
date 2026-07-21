import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../../../core/services/formation.service';
import { InscriptionService } from '../../../core/services/inscription.service';
import { ExamenService } from '../../../core/services/examen.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-formation-detail',
  template: `
    <div class="detail-container fade-in" *ngIf="formation">
      <div class="header-actions">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">{{ formation.titre }}</h1>
        <span class="spacer"></span>
        <button mat-raised-button color="primary" (click)="editFormation()">
          <mat-icon>edit</mat-icon>
          Modifier
        </button>
      </div>

      <div class="detail-grid">
        <mat-card class="info-card">
          <mat-card-header>
            <mat-card-title>Informations générales</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="info-item">
              <span class="label">Description</span>
              <span>{{ formation.description || 'Aucune description' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Formateur</span>
              <span>{{ formation.formateur?.prenom }} {{ formation.formateur?.nom }}</span>
            </div>
            <div class="info-item">
              <span class="label">Lieu</span>
              <span>{{ formation.lieu || 'Non défini' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Période</span>
              <span>{{ formation.dateDebut | date:'dd/MM/yyyy' }} - {{ formation.dateFin | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Statut</span>
              <span class="badge" [class.badge-success]="formation.statut === 'terminee'"
                                  [class.badge-warning]="formation.statut === 'planifiee'"
                                  [class.badge-info]="formation.statut === 'en_cours'"
                                  [class.badge-danger]="formation.statut === 'annulee'">
                {{ formation.statut }}
              </span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stats-card">
          <mat-card-header>
            <mat-card-title>Statistiques</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">{{ inscriptions.length }}</span>
                <span class="stat-label">Inscriptions</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ examens.length }}</span>
                <span class="stat-label">Examens</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>Inscriptions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container" *ngIf="inscriptions.length > 0">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Enseignant</th>
                  <th>Date d'inscription</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let inscription of inscriptions">
                  <td>{{ inscription.utilisateur?.prenom }} {{ inscription.utilisateur?.nom }}</td>
                  <td>{{ inscription.dateInscription | date:'dd/MM/yyyy' }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="inscription.statut === 'validee'"
                                      [class.badge-warning]="inscription.statut === 'en_attente'"
                                      [class.badge-danger]="inscription.statut === 'rejetee'">
                      {{ inscription.statut }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p *ngIf="inscriptions.length === 0" class="empty-message">Aucune inscription pour cette formation</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import '../../../../styles.scss';
    
    .detail-container {
      padding: 20px;
      
      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
        
        .page-title {
          color: $color-chalet;
          font-weight: 500;
          margin: 0;
        }
        
        .spacer {
          flex: 1;
        }
      }
      
      .detail-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 24px;
        
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e8f0e8;
          
          .label {
            color: #888;
            font-weight: 500;
          }
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          
          .stat-item {
            text-align: center;
            padding: 16px;
            background: #f8faf8;
            border-radius: 8px;
            
            .stat-number {
              font-size: 28px;
              font-weight: 600;
              color: $color-chalet;
              display: block;
            }
            
            .stat-label {
              color: #888;
              font-size: 14px;
            }
          }
        }
      }
      
      .empty-message {
        text-align: center;
        color: #999;
        padding: 20px;
      }
    }
    
    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FormationDetailComponent implements OnInit {
  formation: any;
  inscriptions: any[] = [];
  examens: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private examenService: ExamenService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFormation(id);
      this.loadInscriptions(id);
      this.loadExamens(id);
    }
  }

  loadFormation(id: string) {
    this.formationService.findOne(id).subscribe({
      next: (data) => {
        this.formation = data;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadInscriptions(formationId: string) {
    this.inscriptionService.findByFormation(formationId).subscribe({
      next: (data) => {
        this.inscriptions = data;
      }
    });
  }

  loadExamens(formationId: string) {
    this.examenService.findByFormation(formationId).subscribe({
      next: (data) => {
        this.examens = data;
      }
    });
  }

  goBack() {
    this.router.navigate(['/formations']);
  }

  editFormation() {
    // Ouvrir le dialogue de modification
  }
}