import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AttestationService } from '../../core/services/attestation.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-attestations',
  template: `
    <div class="attestations-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>receipt</mat-icon>
          Gestion des Attestations
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
                <td mat-cell *matCellDef="let attestation">
                  {{ attestation.utilisateur?.prenom }} {{ attestation.utilisateur?.nom }}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="formation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Formation</th>
                <td mat-cell *matCellDef="let attestation">{{ attestation.formation?.titre }}</td>
              </ng-container>
              
              <ng-container matColumnDef="typeAttestation">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
                <td mat-cell *matCellDef="let attestation">{{ attestation.typeAttestation }}</td>
              </ng-container>
              
              <ng-container matColumnDef="dateDelivrance">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date de délivrance</th>
                <td mat-cell *matCellDef="let attestation">{{ attestation.dateDelivrance | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let attestation">
                  <button mat-icon-button color="primary" (click)="viewAttestation(attestation)" matTooltip="Télécharger">
                    <mat-icon>download</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAttestation(attestation)" 
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
    
    .attestations-container {
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
export class AttestationsComponent implements OnInit {
  displayedColumns: string[] = ['enseignant', 'formation', 'typeAttestation', 'dateDelivrance', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private attestationService: AttestationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAttestations();
  }

  loadAttestations() {
    const user = this.authService.getCurrentUser();
    if (user?.role === 'enseignant') {
      this.attestationService.findByUtilisateur(user.id).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    } else {
      this.attestationService.findAll().subscribe({
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

  viewAttestation(attestation: any) {
    this.snackBar.open(`Attestation ${attestation.typeAttestation}`, 'Fermer', { duration: 2000 });
    // TODO: Implémenter le téléchargement PDF
  }

  deleteAttestation(attestation: any) {
    if (confirm('Supprimer cette attestation ?')) {
      this.attestationService.delete(attestation.id).subscribe({
        next: () => {
          this.snackBar.open('Attestation supprimée', 'Fermer', { duration: 3000 });
          this.loadAttestations();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  refresh() {
    this.loadAttestations();
  }
}