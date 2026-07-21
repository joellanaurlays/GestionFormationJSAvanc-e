import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from '../../core/services/examen.service';
import { AuthService } from '../../core/services/auth.service';
import { ExamenFormDialogComponent } from './examen-form-dialog/examen-form-dialog.component';

@Component({
  selector: 'app-examens',
  template: `
    <div class="examens-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>quiz</mat-icon>
          Gestion des Examens
        </h1>
        <button mat-raised-button color="primary" (click)="openForm()" *ngIf="hasRole(['administrateur', 'formateur'])">
          <mat-icon>add</mat-icon>
          Créer un examen
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <ng-container matColumnDef="titreExamen">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Titre</th>
                <td mat-cell *matCellDef="let examen">{{ examen.titreExamen }}</td>
              </ng-container>
              
              <ng-container matColumnDef="type">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
                <td mat-cell *matCellDef="let examen">{{ examen.type }}</td>
              </ng-container>
              
              <ng-container matColumnDef="formation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Formation</th>
                <td mat-cell *matCellDef="let examen">{{ examen.formation?.titre }}</td>
              </ng-container>
              
              <ng-container matColumnDef="dateExamen">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell *matCellDef="let examen">{{ examen.dateExamen | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let examen">
                  <button mat-icon-button color="primary" (click)="viewExamen(examen)" matTooltip="Voir">
                    <mat-icon>visibility</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="editExamen(examen)" 
                          *ngIf="hasRole(['administrateur', 'formateur'])">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteExamen(examen)" 
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
    .examens-container {
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
          color: #657E47;
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
export class ExamensComponent implements OnInit {
  displayedColumns: string[] = ['titreExamen', 'type', 'formation', 'dateExamen', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private examenService: ExamenService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadExamens();
  }

  loadExamens() {
    this.examenService.findAll().subscribe({
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

  openForm(examen?: any) {
    const dialogRef = this.dialog.open(ExamenFormDialogComponent, {
      width: '500px',
      data: examen || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadExamens();
      }
    });
  }

  viewExamen(examen: any) {
    // TODO: Implémenter la vue détaillée
    this.snackBar.open(`${examen.titreExamen}`, 'Fermer', { duration: 2000 });
  }

  editExamen(examen: any) {
    this.openForm(examen);
  }

  deleteExamen(examen: any) {
    if (confirm(`Supprimer l'examen "${examen.titreExamen}" ?`)) {
      this.examenService.delete(examen.id).subscribe({
        next: () => {
          this.snackBar.open('Examen supprimé', 'Fermer', { duration: 3000 });
          this.loadExamens();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
