import { Component, OnInit } from '@angular/core';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { Dish, DishService } from '../../services/dish.service';
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
  selector: 'app-restaurateur-dashboard',
  templateUrl: './restaurateur-dashboard.component.html',
  styleUrls: ['./restaurateur-dashboard.component.scss'],
  standalone: false
})
export class RestaurateurDashboardComponent implements OnInit {
  restaurant?: Restaurant;
  menu: Dish[] = [];
  orders: Order[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private dishService: DishService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(rs => {
      // Pick first restaurant for mock restaurateur view
      this.restaurant = rs[0];
      if (this.restaurant) {
        this.dishService.getByRestaurant(this.restaurant.id).subscribe(d => (this.menu = d));
        this.http.get<Order[]>('assets/mock/orders.json').subscribe(list => {
          this.orders = list.filter(o => o.restaurant === this.restaurant!.name);
        });
      }
    });
  }
}
