import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultatService } from '../../core/services/resultat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-resultats',
  template: `
    <div class="resultats-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>assessment</mat-icon>
          Gestion des Résultats
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
                <td mat-cell *matCellDef="let resultat">
                  {{ resultat.utilisateur?.prenom }} {{ resultat.utilisateur?.nom }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="examen">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Examen</th>
                <td mat-cell *matCellDef="let resultat">{{ resultat.examen?.titreExamen }}</td>
              </ng-container>
              
              <ng-container matColumnDef="note">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Note</th>
                <td mat-cell *matCellDef="let resultat">
                  <span class="note" [class.success]="resultat.note >= 10">
                    {{ resultat.note }}/20
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="mention">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Mention</th>
                <td mat-cell *matCellDef="let resultat">
                  <mat-chip [color]="getMentionColor(resultat.mention)" selected>
                    {{ resultat.mention }}
                  </mat-chip>
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
    
    .resultats-container {
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
      
      .note {
        font-weight: 600;
        font-size: 16px;
        
        &.success {
          color: $color-chalet;
        }
        
        &:not(.success) {
          color: #e74c3c;
        }
      }
    }
  `]
})
export class ResultatsComponent implements OnInit {
  displayedColumns: string[] = ['enseignant', 'examen', 'note', 'mention'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resultatService: ResultatService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadResultats();
  }

  loadResultats() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'enseignant') {
      this.resultatService.findByUtilisateur(user.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.resultatService.findAll().subscribe({
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

  getMentionColor(mention: string): string {
    const colors: {[key: string]: string} = {
      'Très bien': 'primary',
      'Bien': 'accent',
      'Assez bien': 'warn',
      'Passable': 'warn'
    };
    return colors[mention] || 'primary';
  }

  refresh() {
    this.loadResultats();
  }
}