import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamenService } from '../../../core/services/examen.service';
import { Formation, FormationService } from '../../../core/services/formation.service';

@Component({
  selector: 'app-examen-form-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Modifier' : 'Créer' }} un examen</h2>
    <mat-dialog-content>
      <form [formGroup]="examenForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Titre</mat-label>
          <input matInput formControlName="titreExamen">
          <mat-error *ngIf="examenForm.get('titreExamen')?.hasError('required')">Titre requis</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="descExamen" rows="3"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Type</mat-label>
          <input matInput formControlName="type" placeholder="Ex. QCM, écrit, oral">
          <mat-error *ngIf="examenForm.get('type')?.hasError('required')">Type requis</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Date de l'examen</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateExamen">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="examenForm.get('dateExamen')?.hasError('required')">Date requise</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Formation</mat-label>
          <mat-select formControlName="formationId">
            <mat-option *ngFor="let formation of formations" [value]="formation.id">{{ formation.titre }}</mat-option>
          </mat-select>
          <mat-error *ngIf="examenForm.get('formationId')?.hasError('required')">Formation requise</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="examenForm.invalid || isLoading">
        <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
        <span *ngIf="!isLoading">{{ data ? 'Modifier' : 'Créer' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { display: block; width: 100%; } mat-dialog-content { min-width: 400px; }']
})
export class ExamenFormDialogComponent implements OnInit {
  formations: Formation[] = [];
  isLoading = false;
  examenForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly examenService: ExamenService,
    private readonly formationService: FormationService,
    private readonly dialogRef: MatDialogRef<ExamenFormDialogComponent>,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public readonly data: any
  ) {
    this.examenForm = this.fb.group({
      titreExamen: [data?.titreExamen || '', Validators.required],
      descExamen: [data?.descExamen || ''],
      type: [data?.type || '', Validators.required],
      dateExamen: [data?.dateExamen ? new Date(data.dateExamen) : '', Validators.required],
      formationId: [data?.formationId || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.formationService.findAll().subscribe({
      next: formations => this.formations = formations,
      error: () => this.snackBar.open('Impossible de charger les formations', 'Fermer', { duration: 3000 })
    });
  }

  onSubmit(): void {
    if (this.examenForm.invalid) return;

    this.isLoading = true;
    const value = { ...this.examenForm.value, dateExamen: new Date(this.examenForm.value.dateExamen).toISOString().slice(0, 10) };
    const request = this.data ? this.examenService.update(this.data.id, value) : this.examenService.create(value);
    request.subscribe({
      next: () => this.dialogRef.close(true),
      error: error => {
        this.isLoading = false;
        this.snackBar.open(error.error?.message || 'Impossible d’enregistrer l’examen', 'Fermer', { duration: 3000 });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
