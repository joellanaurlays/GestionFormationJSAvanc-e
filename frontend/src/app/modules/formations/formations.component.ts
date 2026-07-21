import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormationService } from '../../core/services/formation.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-formations',
  template: `
    <div class="formations-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>event_note</mat-icon>
          Gestion des Formations
        </h1>
        <button mat-raised-button color="primary" (click)="openFormModal()" *ngIf="hasRole(['administrateur', 'formateur'])">
          <mat-icon>add</mat-icon>
          Nouvelle formation
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <ng-container matColumnDef="titre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
                <td mat-cell *matCellDef="let formation">{{ formation.titre }}</td>
              </ng-container>
              
              <ng-container matColumnDef="formateur">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Formateur</th>
                <td mat-cell *matCellDef="let formation">
                  {{ formation.formateur?.prenom }} {{ formation.formateur?.nom }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="dateDebut">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date début</th>
                <td mat-cell *matCellDef="let formation">{{ formation.dateDebut | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="dateFin">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date fin</th>
                <td mat-cell *matCellDef="let formation">{{ formation.dateFin | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="statut">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let formation">
                  <span class="badge" [class.badge-success]="formation.statut === 'terminee'"
                                    [class.badge-warning]="formation.statut === 'planifiee'"
                                    [class.badge-info]="formation.statut === 'en_cours'">
                    {{ formation.statut }}
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let formation">
                  <button mat-icon-button color="primary" (click)="viewFormation(formation)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="editFormation(formation)" 
                          *ngIf="hasRole(['administrateur', 'formateur'])">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteFormation(formation)" 
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
    .formations-container {
      padding: 20px;
      
      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        
        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #657E47;
          font-weight: 500;
          
          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
      }
    }
  `]
})
export class FormationsComponent implements OnInit {
  displayedColumns: string[] = ['titre', 'formateur', 'dateDebut', 'dateFin', 'statut', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private formationService: FormationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.findAll().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  openFormModal() {
    // Implémenter le dialogue de création
  }

  viewFormation(formation: any) {
    // Implémenter la vue
  }

  editFormation(formation: any) {
    // Implémenter l'édition
  }

  deleteFormation(formation: any) {
    if (confirm(`Supprimer la formation "${formation.titre}" ?`)) {
      this.formationService.delete(formation.id).subscribe({
        next: () => {
          this.snackBar.open('Formation supprimée', 'Fermer', { duration: 3000 });
          this.loadFormations();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
