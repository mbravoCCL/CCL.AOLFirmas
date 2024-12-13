import { Injectable } from '@angular/core';
import { Firma } from '../interface/firma';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmaStorageService {
  private static readonly STORAGE_KEY = 'firmas';

  static saveFirmas(firmas: Firma[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(firmas));
  }

  static getFirmas(): Firma[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

}
