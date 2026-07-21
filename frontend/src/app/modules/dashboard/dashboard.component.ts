import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormationService } from '../../core/services/formation.service';
import { InscriptionService } from '../../core/services/inscription.service';
import { ExamenService } from '../../core/services/examen.service';
import { AttestationService } from '../../core/services/attestation.service';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Chart, ChartConfiguration, ChartItem, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard fade-in">
      <!-- En-tête -->
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">
            <mat-icon>dashboard</mat-icon>
            Tableau de bord
          </h1>
          <p class="subtitle">Bienvenue sur la plateforme de gestion de formation continue</p>
        </div>
        <div class="user-greeting">
          <div class="user-avatar">
            <span>{{ user?.prenom?.charAt(0) }}{{ user?.nom?.charAt(0) }}</span>
          </div>
          <div class="user-info-text">
            <span class="user-name">{{ user?.prenom }} {{ user?.nom }}</span>
            <span class="user-role">{{ user?.role }}</span>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats">
          <div class="stat-icon" [style.background]="stat.color">
            <mat-icon>{{ stat.icon }}</mat-icon>
          </div>
          <div class="stat-content">
            <span class="stat-number">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-change" *ngIf="stat.change">
              <mat-icon>trending_up</mat-icon>
              {{ stat.change }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Graphiques et Alertes -->
      <div class="charts-alerts-grid">
        <!-- Graphiques -->
        <div class="charts-grid">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>bar_chart</mat-icon>
                Formations par mois
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas id="formationsChart" style="height: 250px;"></canvas>
            </mat-card-content>
          </mat-card>

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>
                <mat-icon>pie_chart</mat-icon>
                Répartition des formations
              </mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <canvas id="statusChart" style="height: 250px;"></canvas>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Alertes -->
        <mat-card class="alerts-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications_active</mat-icon>
              Alertes
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="alert-item" *ngFor="let alert of alerts">
              <mat-icon [style.color]="alert.color">{{ alert.icon }}</mat-icon>
              <span>{{ alert.message }}</span>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
            <div *ngIf="alerts.length === 0" class="no-alerts">
              <mat-icon>check_circle</mat-icon>
              <span>Tout est en ordre !</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Dernières inscriptions et Formations à venir -->
      <div class="bottom-grid">
        <!-- Dernières inscriptions -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>assignment_ind</mat-icon>
              Dernières inscriptions
            </mat-card-title>
            <button mat-button color="primary" routerLink="/inscriptions">
              Voir tout <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <div class="table-container">
              <table mat-table [dataSource]="inscriptionsDataSource" matSort>
                <ng-container matColumnDef="enseignant">
                  <th mat-header-cell *matHeaderCellDef>Enseignant</th>
                  <td mat-cell *matCellDef="let inscription">
                    {{ inscription.utilisateur?.prenom }} {{ inscription.utilisateur?.nom }}
                  </td>
                </ng-container>
                
                <ng-container matColumnDef="formation">
                  <th mat-header-cell *matHeaderCellDef>Formation</th>
                  <td mat-cell *matCellDef="let inscription">{{ inscription.formation?.titre }}</td>
                </ng-container>
                
                <ng-container matColumnDef="date">
                  <th mat-header-cell *matHeaderCellDef>Date</th>
                  <td mat-cell *matCellDef="let inscription">{{ inscription.dateInscription | date:'dd/MM/yyyy' }}</td>
                </ng-container>
                
                <ng-container matColumnDef="statut">
                  <th mat-header-cell *matHeaderCellDef>Statut</th>
                  <td mat-cell *matCellDef="let inscription">
                    <mat-chip [color]="getStatusColor(inscription.statut)" selected size="small">
                      {{ inscription.statut }}
                    </mat-chip>
                  </td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="inscriptionColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: inscriptionColumns;"></tr>
              </table>
              <mat-paginator [pageSizeOptions]="[5]" showFirstLastButtons></mat-paginator>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Formations à venir -->
        <mat-card class="table-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>event</mat-icon>
              Formations à venir
            </mat-card-title>
            <button mat-button color="primary" routerLink="/formations">
              Voir tout <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <div class="formation-item" *ngFor="let formation of upcomingFormations">
              <div class="formation-date">
                <span class="day">{{ formation.dateDebut | date:'dd' }}</span>
                <span class="month">{{ formation.dateDebut | date:'MMM' }}</span>
              </div>
              <div class="formation-info">
                <span class="formation-title">{{ formation.titre }}</span>
                <span class="formation-formateur">{{ formation.formateur?.prenom }} {{ formation.formateur?.nom }}</span>
              </div>
              <button mat-icon-button color="primary" [routerLink]="['/formations', formation.id]">
                <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
            <div *ngIf="upcomingFormations.length === 0" class="no-data">
              <mat-icon>event_busy</mat-icon>
              <span>Aucune formation à venir</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../styles.scss';
    
    .dashboard {
      padding: 20px;
      
      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
        
        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          color: $color-chalet;
          font-weight: 600;
          font-size: 28px;
          margin: 0;
          
          mat-icon {
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
        
        .subtitle {
          color: #888;
          margin: 4px 0 0 44px;
        }
        
        .user-greeting {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 8px 16px 8px 8px;
          border-radius: 50px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, $color-chalet, $color-aquadulce);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
          }
          
          .user-info-text {
            display: flex;
            flex-direction: column;
            
            .user-name {
              font-weight: 500;
              font-size: 14px;
            }
            
            .user-role {
              font-size: 12px;
              color: #888;
              text-transform: capitalize;
            }
          }
        }
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
        
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(101, 126, 71, 0.15);
          }
          
          .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
          
          .stat-content {
            display: flex;
            flex-direction: column;
            
            .stat-number {
              font-size: 24px;
              font-weight: 700;
              color: #2c3e2c;
            }
            
            .stat-label {
              font-size: 13px;
              color: #888;
            }
            
            .stat-change {
              font-size: 12px;
              color: $color-aquadulce;
              display: flex;
              align-items: center;
              gap: 4px;
              
              mat-icon {
                font-size: 16px;
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }
      
      .charts-alerts-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 20px;
        margin-bottom: 24px;
        
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          
          .chart-card {
            border-radius: 12px;
            
            mat-card-header {
              padding-bottom: 0;
              
              mat-card-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 16px;
                
                mat-icon {
                  font-size: 20px;
                  width: 20px;
                  height: 20px;
                  color: $color-chalet;
                }
              }
            }
            
            mat-card-content {
              padding-top: 8px;
            }
          }
        }
        
        .alerts-card {
          border-radius: 12px;
          
          mat-card-header {
            padding-bottom: 8px;
            
            mat-card-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              
              mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
              }
            }
          }
          
          .alert-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            border-bottom: 1px solid #f0f4f0;
            
            mat-icon {
              font-size: 20px;
              width: 20px;
              height: 20px;
            }
            
            .alert-time {
              margin-left: auto;
              font-size: 12px;
              color: #999;
            }
          }
          
          .no-alerts {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 20px 0;
            color: $color-aquadulce;
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
        }
      }
      
      .bottom-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        
        .table-card {
          border-radius: 12px;
          
          mat-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 8px;
            
            mat-card-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 16px;
              
              mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
                color: $color-chalet;
              }
            }
          }
          
          .formation-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid #f0f4f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .formation-date {
              text-align: center;
              background: $color-winter-mist;
              padding: 6px 12px;
              border-radius: 8px;
              min-width: 48px;
              
              .day {
                display: block;
                font-size: 20px;
                font-weight: 700;
                color: $color-chalet;
              }
              
              .month {
                font-size: 11px;
                color: #666;
                text-transform: uppercase;
              }
            }
            
            .formation-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              
              .formation-title {
                font-weight: 500;
              }
              
              .formation-formateur {
                font-size: 13px;
                color: #888;
              }
            }
          }
          
          .no-data {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 30px 0;
            color: #999;
            
            mat-icon {
              font-size: 24px;
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
    
    @media (max-width: 1024px) {
      .charts-alerts-grid {
        grid-template-columns: 1fr;
        
        .charts-grid {
          grid-template-columns: 1fr;
        }
      }
      
      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 600px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        
        .page-title {
          font-size: 22px;
        }
        
        .subtitle {
          margin-left: 0;
        }
      }
      
      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  user: any;
  isLoading = true;
  
  stats: any[] = [];
  alerts: any[] = [];
  upcomingFormations: any[] = [];

  inscriptionColumns: string[] = ['enseignant', 'formation', 'date', 'statut'];
  inscriptionsDataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private chartInstances: any[] = [];

  constructor(
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private examenService: ExamenService,
    private attestationService: AttestationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.inscriptionsDataSource.paginator = this.paginator;
    this.inscriptionsDataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.chartInstances.forEach(chart => chart.destroy());
  }

  loadDashboardData() {
    this.isLoading = true;

    this.formationService.findAll().subscribe({
      next: (formations) => {
        const totalFormations = formations.length;
        const planifiees = formations.filter(f => f.statut === 'planifiee').length;
        const enCours = formations.filter(f => f.statut === 'en_cours').length;

        this.stats = [
          { 
            icon: 'event_note', 
            label: 'Formations', 
            value: totalFormations,
            color: '#657E47',
            change: 12
          },
          { 
            icon: 'people', 
            label: 'Inscriptions', 
            value: 0,
            color: '#6C9B76',
            change: 8
          },
          { 
            icon: 'quiz', 
            label: 'Examens', 
            value: 0,
            color: '#97C49E'
          },
          { 
            icon: 'receipt', 
            label: 'Attestations', 
            value: 0,
            color: '#BAD17A'
          }
        ];

        this.upcomingFormations = formations
          .filter(f => f.statut === 'planifiee')
          .slice(0, 5);

        this.alerts = [];
        if (planifiees > 0) {
          this.alerts.push({
            icon: 'event',
            message: `${planifiees} formation(s) à venir`,
            color: '#657E47',
            time: 'À venir'
          });
        }
        if (enCours > 0) {
          this.alerts.push({
            icon: 'play_circle',
            message: `${enCours} formation(s) en cours`,
            color: '#6C9B76',
            time: 'En cours'
          });
        }

        this.loadInscriptions();
        this.loadExamens();
        this.loadAttestations();

        this.isLoading = false;

        setTimeout(() => {
          this.initCharts(formations);
        }, 500);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement du dashboard', 'Fermer', { duration: 3000 });
      }
    });
  }

  loadInscriptions() {
    this.inscriptionService.findAll().subscribe({
      next: (data) => {
        const inscriptionIndex = this.stats.findIndex(s => s.label === 'Inscriptions');
        if (inscriptionIndex !== -1) {
          this.stats[inscriptionIndex].value = data.length;
        }

        const sorted = data.sort((a, b) => 
          new Date(b.dateInscription).getTime() - new Date(a.dateInscription).getTime()
        );
        this.inscriptionsDataSource.data = sorted.slice(0, 5);

        const enAttente = data.filter(i => i.statut === 'en_attente');
        if (enAttente.length > 0) {
          this.alerts.push({
            icon: 'pending',
            message: `${enAttente.length} inscription(s) en attente de validation`,
            color: '#F39C12',
            time: 'Urgent'
          });
        }
      },
      error: () => {
        console.error('Erreur chargement inscriptions');
      }
    });
  }

  loadExamens() {
    this.examenService.findAll().subscribe({
      next: (data) => {
        const examenIndex = this.stats.findIndex(s => s.label === 'Examens');
        if (examenIndex !== -1) {
          this.stats[examenIndex].value = data.length;
        }
      },
      error: () => {
        console.error('Erreur chargement examens');
      }
    });
  }

  loadAttestations() {
    this.attestationService.findAll().subscribe({
      next: (data) => {
        const attestationIndex = this.stats.findIndex(s => s.label === 'Attestations');
        if (attestationIndex !== -1) {
          this.stats[attestationIndex].value = data.length;
        }
      },
      error: () => {
        console.error('Erreur chargement attestations');
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: {[key: string]: string} = {
      'en_attente': 'warn',
      'validee': 'primary',
      'rejetee': 'warn'
    };
    return colors[status] || 'primary';
  }

  initCharts(formations: any[]) {
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];

    const monthCount = this.getFormationsByMonth(formations);
    const ctx1 = document.getElementById('formationsChart') as HTMLCanvasElement;
    if (ctx1) {
      const chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: Object.keys(monthCount),
          datasets: [{
            label: 'Formations',
            data: Object.values(monthCount),
            backgroundColor: ['#657E47', '#6C9B76', '#97C49E', '#BAD17A', '#CDE8D4'],
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }
      } as ChartConfiguration);
      this.chartInstances.push(chart1);
    }

    const statusCount = this.getFormationsByStatus(formations);
    const ctx2 = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx2) {
      const chart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusCount),
          datasets: [{
            data: Object.values(statusCount),
            backgroundColor: ['#CDE8D4', '#BAD17A', '#97C49E', '#657E47'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 16
              }
            }
          },
          cutout: '70%'
        }
      } as ChartConfiguration);
      this.chartInstances.push(chart2);
    }
  }

  getFormationsByMonth(formations: any[]): {[key: string]: number} {
    const months: {[key: string]: number} = {};
    formations.forEach(f => {
      const date = new Date(f.dateDebut);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });
    return months;
  }

  getFormationsByStatus(formations: any[]): {[key: string]: number} {
    const status: {[key: string]: number} = {};
    formations.forEach(f => {
      status[f.statut] = (status[f.statut] || 0) + 1;
    });
    return status;
  }
}