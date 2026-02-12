import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

interface Order {
  id: number;
  userId: number;
  restaurant: string;
  total: number;
  status: string;
  createdAt: string;
}

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
  standalone: false
})
export class ClientDashboardComponent implements OnInit {
  user?: User | null;
  orders: Order[] = [];

  constructor(private auth: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.auth.currentUser$.subscribe(u => {
      this.user = u;
      if (u) {
        this.http.get<Order[]>('assets/mock/orders.json').subscribe(list => {
          this.orders = list.filter(o => o.userId === u.id);
        });
      }
    });
  }
}
