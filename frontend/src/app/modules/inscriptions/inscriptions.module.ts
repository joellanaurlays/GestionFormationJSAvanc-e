import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturePageModule } from '../shared/feature-page.module';
import { FeaturePageComponent } from '../shared/feature-page.component';
const routes: Routes = [{ path: '', component: FeaturePageComponent, data: { title: 'Inscriptions' } }];
@NgModule({ imports: [FeaturePageModule, RouterModule.forChild(routes)] })
export class InscriptionsModule {}
