import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private apiUrl = `${environment.apiUrl}/inscriptions`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  findByUtilisateur(utilisateurId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  findByFormation(formationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/formation/${formationId}`);
  }

  updateStatus(id: string, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { statut });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}