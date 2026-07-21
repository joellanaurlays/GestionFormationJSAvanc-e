import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormationsComponent } from './formations.component';

const routes: Routes = [{ path: '', component: FormationsComponent }];

@NgModule({
  declarations: [FormationsComponent],
  imports: [
    CommonModule, RouterModule.forChild(routes), MatButtonModule, MatCardModule,
    MatDialogModule, MatIconModule, MatPaginatorModule, MatSnackBarModule,
    MatSortModule, MatTableModule
  ]
})
export class FormationsModule {}
