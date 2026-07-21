import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultatService {
  private apiUrl = `${environment.apiUrl}/resultats`;

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

  findByExamen(examenId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/examen/${examenId}`);
  }

  getMoyenne(examenId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/examen/${examenId}/moyenne`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}