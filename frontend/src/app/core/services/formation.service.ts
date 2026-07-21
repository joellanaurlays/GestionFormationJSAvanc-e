import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Formation {
  id: string;
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
  lieu: string;
  statut: string;
  formateurId: string;
  formateur?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FormationService {
  private apiUrl = `${environment.apiUrl}/formations`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, data);
  }

  findAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  findOne(id: string): Observable<Formation> {
    return this.http.get<Formation>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: any): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}