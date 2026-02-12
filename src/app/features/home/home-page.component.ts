import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Restaurant, RestaurantService } from '../../services/restaurant.service';
import { OrderDataService, Order } from '../../services/order-data.service';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [CommonModule, RouterModule, MatButtonModule, RestaurantCardComponent]
})
export class HomePageComponent implements OnInit {
  restaurants = signal<Restaurant[]>([]);
  orders = signal<Order[]>([]);

  featured = computed(() => {
    const counts = new Map<string, number>();
    this.orders().forEach(o => counts.set(o.restaurant, (counts.get(o.restaurant) || 0) + 1));
    return [...this.restaurants()]
      .map(r => ({ ...r, orders: counts.get(r.name) || 0 }))
      .sort((a, b) => (b.orders || 0) - (a.orders || 0))
      .slice(0, 6);
  });

  newest = computed(() =>
    [...this.restaurants()].sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || '')).slice(0, 6)
  );

  constructor(private restaurantService: RestaurantService, private orderData: OrderDataService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(list => this.restaurants.set(list));
    this.orderData.getOrders().subscribe(list => this.orders.set(list));
  }
}
