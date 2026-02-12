import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Order {
  id: number;
  userId: number;
  clientName: string;
  address: string;
  restaurant: string;
  total: number;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrderDataService {
  private ordersSig = signal<Order[]>([]);
  orders = computed(() => this.ordersSig());

  constructor(private http: HttpClient) {
    this.load();
  }

  load(): void {
    this.http.get<Order[]>('assets/mock/orders.json').subscribe(list => this.ordersSig.set(list));
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('assets/mock/orders.json').pipe(tap(list => this.ordersSig.set(list)));
  }

  updateStatus(id: number, status: string): void {
    this.ordersSig.update(list => list.map(o => (o.id === id ? { ...o, status } : o)));
  }
}
