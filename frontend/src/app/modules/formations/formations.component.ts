import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormationService } from '../../core/services/formation.service';
import { AuthService } from '../../core/services/auth.service';
import { FormationFormDialogComponent } from './formation-form-dialog/formation-form-dialog.component';

@Component({
  selector: 'app-formations',
  template: `
    <div class="formations-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>event_note</mat-icon>
          Gestion des Formations
        </h1>
        <button mat-raised-button color="primary" (click)="openForm()" 
                *ngIf="hasRole(['administrateur', 'formateur'])">
          <mat-icon>add</mat-icon>
          Nouvelle formation
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <!-- Colonnes -->
              <ng-container matColumnDef="titre">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
                <td mat-cell *matCellDef="let formation">
                  <strong>{{ formation.titre }}</strong>
                </td>
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
                  <mat-chip [color]="getStatusColor(formation.statut)" selected>
                    {{ formation.statut }}
                  </mat-chip>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let formation">
                  <button mat-icon-button color="primary" [routerLink]="['/formations', formation.id]" matTooltip="Voir">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="openForm(formation)" 
                          *ngIf="hasRole(['administrateur', 'formateur'])" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteFormation(formation)" 
                          *ngIf="hasRole(['administrateur'])" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            
            <mat-paginator [pageSizeOptions]="[5, 10, 25, 50]" showFirstLastButtons></mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    @import '../../../styles.scss';
    
    .formations-container {
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
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFormations();
  }

  loadFormations() {
    this.formationService.findAll().subscribe({
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

  hasRole(roles: string[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'planifiee': 'primary',
      'en_cours': 'accent',
      'terminee': 'primary',
      'annulee': 'warn'
    };
    return colors[status] || 'primary';
  }

  openForm(formation?: any) {
    const dialogRef = this.dialog.open(FormationFormDialogComponent, {
      width: '550px',
      data: formation || null,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadFormations();
      }
    });
  }

  deleteFormation(formation: any) {
    const confirmDelete = confirm(`Supprimer la formation "${formation.titre}" ?`);
    if (confirmDelete) {
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