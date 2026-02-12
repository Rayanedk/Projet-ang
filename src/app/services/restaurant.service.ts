import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  cuisine?: string;
  country: string;
  countryCode: string;
  city: string;
  featured?: boolean;
  addedAt?: string;
  rating: number;
  deliveryTime: string;
  totalOrders?: number;
  createdAt?: string;
  menu?: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private restaurantsSig = signal<Restaurant[]>([]);
  restaurants = computed(() => this.restaurantsSig());

  constructor(private http: HttpClient) {
    this.load();
  }

  private load(): void {
    this.http.get<Restaurant[]>('assets/mock/restaurants.json').subscribe(list => {
      this.restaurantsSig.set(list);
    });
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('assets/mock/restaurants.json').pipe(
      tap(list => this.restaurantsSig.set(list))
    );
  }

  getRestaurant(id: number): Observable<Restaurant | undefined> {
    return this.getRestaurants().pipe(map(list => list.find(r => r.id === id)));
  }

  addRestaurant(payload: Omit<Restaurant, 'id'>): void {
    const list = this.restaurantsSig();
    const next: Restaurant = { ...payload, id: Date.now() };
    this.restaurantsSig.set([...list, next]);
  }

  updateRestaurant(id: number, patch: Partial<Restaurant>): void {
    this.restaurantsSig.update(list =>
      list.map(r => (r.id === id ? { ...r, ...patch } : r))
    );
  }

  deleteRestaurant(id: number): void {
    this.restaurantsSig.set(this.restaurantsSig().filter(r => r.id !== id));
  }
}
