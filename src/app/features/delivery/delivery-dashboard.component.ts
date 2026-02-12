import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OrderDataService, Order } from '../../services/order-data.service';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.scss'],
  imports: [CommonModule, MatButtonModule, MatCardModule]
})
export class DeliveryDashboardComponent implements OnInit {
  orders = signal<Order[]>([]);

  pending = computed(() => this.orders().filter(o => o.status !== 'Delivered'));
  delivered = computed(() => this.orders().filter(o => o.status === 'Delivered'));

  constructor(private orderData: OrderDataService) {}

  ngOnInit(): void {
    this.orderData.getOrders().subscribe(list => this.orders.set(list));
  }

  markDelivered(id: number): void {
    this.orderData.updateStatus(id, 'Delivered');
    this.orders.set(this.orderData.orders());
  }
}
