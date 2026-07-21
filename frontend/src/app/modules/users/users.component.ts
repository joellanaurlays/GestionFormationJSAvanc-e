import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';

@Component({
  selector: 'app-users',
  template: `
    <div class="users-container fade-in">
      <div class="header-actions">
        <h1 class="page-title">
          <mat-icon>people</mat-icon>
          Gestion des Utilisateurs
        </h1>
        <button mat-raised-button color="primary" (click)="openUserForm()">
          <mat-icon>add</mat-icon>
          Ajouter un utilisateur
        </button>
      </div>
      
      <mat-card>
        <mat-card-content>
          <div class="filter-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Rechercher</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Nom, email..." #input>
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Filtrer par rôle</mat-label>
              <mat-select (selectionChange)="filterByRole($event.value)">
                <mat-option value="">Tous</mat-option>
                <mat-option value="administrateur">Administrateur</mat-option>
                <mat-option value="formateur">Formateur</mat-option>
                <mat-option value="enseignant">Enseignant</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="table-container">
            <table mat-table [dataSource]="dataSource" matSort class="custom-table">
              <ng-container matColumnDef="nom">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom complet</th>
                <td mat-cell *matCellDef="let user">{{ user.prenom }} {{ user.nom }}</td>
              </ng-container>
              
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.email }}</td>
              </ng-container>
              
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Rôle</th>
                <td mat-cell *matCellDef="let user">
                  <mat-chip [color]="getRoleColor(user.role)" selected>
                    {{ user.role }}
                  </mat-chip>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
                <td mat-cell *matCellDef="let user">
                  <span class="badge" [class.badge-success]="user.isActive"
                                    [class.badge-danger]="!user.isActive">
                    {{ user.isActive ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="createdAt">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Date d'inscription</th>
                <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'dd/MM/yyyy' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button color="primary" (click)="editUser(user)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteUser(user)" matTooltip="Supprimer">
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
    
    .users-container {
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
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        
        .search-field {
          flex: 1;
          min-width: 200px;
        }
        
        .filter-field {
          min-width: 150px;
        }
      }
    }
  `]
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nom', 'email', 'role', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.userService.findAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        this.snackBar.open(' Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByRole(role: string) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return !filter || data.role === filter;
    };
    this.dataSource.filter = role;
  }

  getRoleColor(role: string): string {
    const colors: {[key: string]: string} = {
      'administrateur': 'warn',
      'formateur': 'primary',
      'enseignant': 'accent'
    };
    return colors[role] || 'primary';
  }

  openUserForm(user?: any) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  editUser(user: any) {
    this.openUserForm(user);
  }

  deleteUser(user: any) {
    if (confirm(`Supprimer l'utilisateur ${user.prenom} ${user.nom} ?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: () => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}