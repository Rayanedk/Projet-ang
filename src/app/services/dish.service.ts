import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface Dish {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class DishService {
  private dishesSig = signal<Dish[]>([]);
  dishes = computed(() => this.dishesSig());

  constructor(private http: HttpClient) {
    this.load();
  }

  private load(): void {
    this.http.get<Dish[]>('assets/mock/dishes.json').subscribe(list => this.dishesSig.set(list));
  }

  getByRestaurant(restaurantId: number): Observable<Dish[]> {
    return this.http.get<Dish[]>('assets/mock/dishes.json').pipe(
      tap(list => this.dishesSig.set(list)),
      map(list => list.filter(d => d.restaurantId === restaurantId))
    );
  }

  addDish(payload: Omit<Dish, 'id'>): void {
    const next: Dish = { ...payload, id: Date.now() };
    this.dishesSig.set([...this.dishesSig(), next]);
  }

  updateDish(id: number, patch: Partial<Dish>): void {
    this.dishesSig.update(list => list.map(d => (d.id === id ? { ...d, ...patch } : d)));
  }

  deleteDish(id: number): void {
    this.dishesSig.set(this.dishesSig().filter(d => d.id !== id));
  }
}
