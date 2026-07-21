import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm">
        <div class="row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="nom">
            <mat-error *ngIf="userForm.get('nom')?.hasError('required')">Nom requis</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="prenom">
            <mat-error *ngIf="userForm.get('prenom')?.hasError('required')">Prénom requis</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="userForm.get('email')?.hasError('required')">Email requis</mat-error>
          <mat-error *ngIf="userForm.get('email')?.hasError('email')">Email invalide</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="!data">
          <mat-label>Mot de passe</mat-label>
          <input matInput formControlName="motDePass" type="password">
          <mat-error *ngIf="userForm.get('motDePass')?.hasError('required')">Mot de passe requis</mat-error>
          <mat-error *ngIf="userForm.get('motDePass')?.hasError('minlength')">Minimum 6 caractères</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rôle</mat-label>
          <mat-select formControlName="role">
            <mat-option value="enseignant">Enseignant</mat-option>
            <mat-option value="formateur">Formateur</mat-option>
            <mat-option value="administrateur">Administrateur</mat-option>
          </mat-select>
          <mat-error *ngIf="userForm.get('role')?.hasError('required')">Rôle requis</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="userForm.invalid || isLoading">
        <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
        <span *ngIf="!isLoading">{{ data ? 'Modifier' : 'Ajouter' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .row {
      display: flex;
      gap: 16px;
    }
    .half-width {
      flex: 1;
    }
    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
    @media (max-width: 600px) {
      .row {
        flex-direction: column;
        gap: 0;
      }
      mat-dialog-content {
        min-width: auto;
      }
    }
  `]
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      motDePass: ['', !data ? [Validators.required, Validators.minLength(6)] : []],
      role: ['enseignant', [Validators.required]]
    });

    if (data) {
      this.userForm.patchValue({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        role: data.role
      });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) return;
    this.isLoading = true;

    const operation = this.data 
      ? this.userService.update(this.data.id, this.userForm.value)
      : this.userService.create(this.userForm.value);

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(`Utilisateur ${this.data ? 'modifié' : 'ajouté'} avec succès`, 'Fermer', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(error.error?.message || 'Erreur', 'Fermer', { duration: 3000 });
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}