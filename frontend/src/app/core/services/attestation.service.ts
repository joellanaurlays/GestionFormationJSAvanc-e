import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttestationService {
  private apiUrl = `${environment.apiUrl}/attestations`;

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  generate(utilisateurId: string, formationId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate?utilisateurId=${utilisateurId}&formationId=${formationId}`, {});
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

  findOne(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}