import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../core/services/formation.service';
import { InscriptionService } from '../../core/services/inscription.service';
import { AuthService } from '../../core/services/auth.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard fade-in">
      <h1 class="page-title">Tableau de bord</h1>
      
      <!-- Statistiques -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-aquadulce">
              <mat-icon>event_note</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.formations }}</span>
              <span class="stat-label">Formations</span>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-tarragon">
              <mat-icon>people</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.inscriptions }}</span>
              <span class="stat-label">Inscriptions</span>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-aroma">
              <mat-icon>assessment</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.resultats }}</span>
              <span class="stat-label">Résultats</span>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon bg-antique-moss">
              <mat-icon>receipt</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats.attestations }}</span>
              <span class="stat-label">Attestations</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Graphiques -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Formations par mois</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="formationsChart"></canvas>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Taux de satisfaction</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <canvas id="satisfactionChart"></canvas>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Dernières inscriptions -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Dernières inscriptions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Enseignant</th>
                  <th>Formation</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let inscription of recentInscriptions">
                  <td>{{ inscription.utilisateur?.nom }} {{ inscription.utilisateur?.prenom }}</td>
                  <td>{{ inscription.formation?.titre }}</td>
                  <td>{{ inscription.dateInscription | date }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="inscription.statut === 'validee'"
                                         [class.badge-warning]="inscription.statut === 'en_attente'"
                                         [class.badge-danger]="inscription.statut === 'rejetee'">
                      {{ inscription.statut }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
      
      .page-title {
        color: #657E47;
        margin-bottom: 24px;
        font-weight: 500;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
        
        .stat-card {
          border-radius: 12px;
          transition: transform 0.3s ease;
          
          &:hover {
            transform: translateY(-4px);
          }
          
          mat-card-content {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            
            .stat-icon {
              width: 60px;
              height: 60px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              
              mat-icon {
                font-size: 32px;
                width: 32px;
                height: 32px;
              }
            }
            
            .stat-info {
              display: flex;
              flex-direction: column;
              
              .stat-value {
                font-size: 28px;
                font-weight: 600;
                color: #657E47;
              }
              
              .stat-label {
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
      }
      
      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
        
        .chart-card {
          border-radius: 12px;
          
          canvas {
            max-height: 300px;
          }
        }
      }
      
      .table-card {
        border-radius: 12px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = {
    formations: 0,
    inscriptions: 0,
    resultats: 0,
    attestations: 0
  };
  
  recentInscriptions: any[] = [];

  constructor(
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentInscriptions();
    setTimeout(() => this.initCharts(), 500);
  }

  loadStats() {
    this.formationService.findAll().subscribe(data => {
      this.stats.formations = data.length;
    });
    
    this.inscriptionService.findAll().subscribe(data => {
      this.stats.inscriptions = data.length;
    });
  }

  loadRecentInscriptions() {
    this.inscriptionService.findAll().subscribe(data => {
      this.recentInscriptions = data.slice(0, 5);
    });
  }

  initCharts() {
    // Chart formations
    new Chart('formationsChart', {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Formations',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: '#6C9B76',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });

    // Chart satisfaction
    new Chart('satisfactionChart', {
      type: 'doughnut',
      data: {
        labels: ['Très satisfait', 'Satisfait', 'Neutre', 'Insatisfait'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#657E47', '#6C9B76', '#97C49E', '#CDE8D4']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}
