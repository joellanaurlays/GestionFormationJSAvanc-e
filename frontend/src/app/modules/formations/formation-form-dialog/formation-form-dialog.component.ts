import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormationService } from '../../../core/services/formation.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-formation-form-dialog',
  templateUrl: './formation-form-dialog.component.html',
  styleUrls: ['./formation-form-dialog.component.scss']
})
export class FormationFormDialogComponent implements OnInit {
  formationForm: FormGroup;
  formateurs: any[] = [];
  isLoading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private userService: UserService,
    private dialogRef: MatDialogRef<FormationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    this.isEdit = !!data;
    this.formationForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dateDebut: ['', [Validators.required]],
      dateFin: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
      formateurId: ['', [Validators.required]],
      statut: ['planifiee']
    });

    if (data) {
      this.formationForm.patchValue({
        titre: data.titre,
        description: data.description,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        lieu: data.lieu,
        formateurId: data.formateurId,
        statut: data.statut
      });
    }
  }

  ngOnInit() {
    this.loadFormateurs();
  }

  loadFormateurs() {
    this.userService.findFormateurs().subscribe({
      next: (data) => {
        this.formateurs = data;
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des formateurs', 'Fermer', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.formationForm.invalid) {
      this.formationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formData = { ...this.formationForm.value };
    formData.dateDebut = new Date(formData.dateDebut).toISOString().split('T')[0];
    formData.dateFin = new Date(formData.dateFin).toISOString().split('T')[0];

    const operation = this.isEdit
      ? this.formationService.update(this.data.id, formData)
      : this.formationService.create(formData);

    operation.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.snackBar.open(
          `Formation ${this.isEdit ? 'modifiée' : 'créée'} avec succès !`,
          'Fermer',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open(
          error.error?.message || `Erreur lors de la ${this.isEdit ? 'modification' : 'création'}`,
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}