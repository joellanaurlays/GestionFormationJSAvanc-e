import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feature-page',
  template: `
    <section class="feature-page">
      <h1>{{ title }}</h1>
      <p>Cette rubrique sera bientôt disponible.</p>
    </section>
  `,
  styles: ['.feature-page { padding: 20px; }']
})
export class FeaturePageComponent {
  title = this.route.snapshot.data['title'] || 'Rubrique';

  constructor(private readonly route: ActivatedRoute) {}
}
