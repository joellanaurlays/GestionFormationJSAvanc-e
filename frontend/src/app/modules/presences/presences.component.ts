import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PresenceService } from '../../core/services/presence.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-presences',
  template: `
    <div class="presences-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>check_circle</mat-icon>
          Gestion des Présences
        </h1>
        <button mat-raised-button color="primary" (click)="refresh()">
          <mat-icon>refresh</mat-icon>
          Actualiser
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <ng-container matColumnDef="enseignant">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Enseignant</th>
                <td mat-cell *matCellDef="let presence">
                  {{ presence.utilisateur?.prenom }} {{ presence.utilisateur?.nom }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="formation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Formation</th>
                <td mat-cell *matCellDef="let presence">{{ presence.formation?.titre }}</td>
              </ng-container>
              
              <ng-container matColumnDef="datePresence">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
                <td mat-cell *matCellDef="let presence">{{ presence.datePresence | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="statut">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let presence">
                  <span class="badge" [class.badge-success]="presence.statut === 'present'"
                                    [class.badge-danger]="presence.statut === 'absent'"
                                    [class.badge-warning]="presence.statut === 'retard'">
                    {{ presence.statut }}
                  </span>
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
    
    .presences-container {
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
export class PresencesComponent implements OnInit {
  displayedColumns: string[] = ['enseignant', 'formation', 'datePresence', 'statut'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private presenceService: PresenceService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPresences();
  }

  loadPresences() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'enseignant') {
      this.presenceService.findByUtilisateur(user.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.presenceService.findAll().subscribe({
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

  refresh() {
    this.loadPresences();
  }
}