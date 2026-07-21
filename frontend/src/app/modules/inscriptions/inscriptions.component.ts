import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InscriptionService } from '../../core/services/inscription.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inscriptions',
  template: `
    <div class="inscriptions-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>assignment_ind</mat-icon>
          Gestion des Inscriptions
        </h1>
        <button mat-raised-button color="primary" (click)="refresh()">
          <mat-icon>refresh</mat-icon>
          Actualiser
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="filter-section">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrer par statut</mat-label>
              <mat-select (selectionChange)="filterByStatus($event.value)">
                <mat-option value="">Tous</mat-option>
                <mat-option value="en_attente">En attente</mat-option>
                <mat-option value="validee">Validée</mat-option>
                <mat-option value="rejetee">Rejetée</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <ng-container matColumnDef="enseignant">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Enseignant</th>
                <td mat-cell *matCellDef="let inscription">
                  {{ inscription.utilisateur?.prenom }} {{ inscription.utilisateur?.nom }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="formation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Formation</th>
                <td mat-cell *matCellDef="let inscription">{{ inscription.formation?.titre }}</td>
              </ng-container>
              
              <ng-container matColumnDef="dateInscription">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date d'inscription</th>
                <td mat-cell *matCellDef="let inscription">{{ inscription.dateInscription | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="statut">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let inscription">
                  <mat-chip [color]="getStatusColor(inscription.statut)" selected>
                    {{ inscription.statut }}
                  </mat-chip>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let inscription">
                  <button mat-raised-button color="primary" size="small" 
                          (click)="updateStatus(inscription, 'validee')"
                          *ngIf="inscription.statut === 'en_attente' && hasRole(['administrateur', 'formateur'])">
                    Valider
                  </button>
                  <button mat-raised-button color="warn" size="small"
                          (click)="updateStatus(inscription, 'rejetee')"
                          *ngIf="inscription.statut === 'en_attente' && hasRole(['administrateur', 'formateur'])">
                    Rejeter
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteInscription(inscription)"
                          *ngIf="hasRole(['administrateur'])">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            
            <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import '../../../styles.scss';
    
    .inscriptions-container {
      padding: 20px;
      
      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 12px;
        
        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: $color-chalet;
          font-weight: 500;
          margin: 0;
          
          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
      }
      
      .filter-section {
        margin-bottom: 20px;
        
        .filter-field {
          min-width: 200px;
        }
      }
    }
  `]
})
export class InscriptionsComponent implements OnInit {
  displayedColumns: string[] = ['enseignant', 'formation', 'dateInscription', 'statut', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadInscriptions();
  }

  loadInscriptions() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'enseignant') {
      this.inscriptionService.findByUtilisateur(user.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.inscriptionService.findAll().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: () => {
          this.snackBar.open('Erreur lors du chargement', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'en_attente': 'warn',
      'validee': 'primary',
      'rejetee': 'warn'
    };
    return colors[status] || 'primary';
  }

  filterByStatus(status: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return !filter || data.statut === filter;
    };
    this.dataSource.filter = status;
  }

  updateStatus(inscription: any, status: string) {
    this.inscriptionService.updateStatus(inscription.id, status).subscribe({
      next: () => {
        this.snackBar.open(`Inscription ${status === 'validee' ? 'validée' : 'rejetée'}`, 'Fermer', { duration: 3000 });
        this.loadInscriptions();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteInscription(inscription: any) {
    if (confirm('Supprimer cette inscription ?')) {
      this.inscriptionService.delete(inscription.id).subscribe({
        next: () => {
          this.snackBar.open('Inscription supprimée', 'Fermer', { duration: 3000 });
          this.loadInscriptions();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  refresh() {
    this.loadInscriptions();
  }
}