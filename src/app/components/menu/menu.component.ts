import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Dish, DishService } from '../../services/dish.service';
import { Restaurant, RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatButtonModule]
})
export class MenuComponent implements OnInit {
  restaurant?: Restaurant;
  grouped: { category: string; items: Dish[] }[] = [];

  constructor(
    private route: ActivatedRoute,
    private dishService: DishService,
    private restaurantService: RestaurantService,
    private orders: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.restaurantService.getRestaurant(id).subscribe(r => {
      this.restaurant = r;
      if (r?.menu?.length) {
        const items: Dish[] = r.menu.map(m => ({
          id: m.id,
          restaurantId: r.id,
          name: m.name,
          description: m.description,
          price: m.price,
          category: 'Spécialités',
          image: m.image
        }));
        this.grouped = [{ category: 'Spécialités', items }];
      } else {
        this.dishService.getByRestaurant(id).subscribe(list => {
          const map = new Map<string, Dish[]>();
          list.forEach(d => {
            if (!map.has(d.category)) map.set(d.category, []);
            map.get(d.category)!.push(d);
          });
          this.grouped = Array.from(map.entries()).map(([category, items]) => ({ category, items }));
        });
      }
    });
  }

  add(dish: Dish): void {
    this.orders.addToCart(dish);
  }
}
