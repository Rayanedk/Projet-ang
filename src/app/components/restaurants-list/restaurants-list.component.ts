import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Restaurant, RestaurantService } from '../../services/restaurant.service';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RestaurantCardComponent]
})
export class RestaurantsListComponent implements OnInit {
  restaurants: Restaurant[] = [];

  constructor(private service: RestaurantService) {}

  ngOnInit(): void {
    this.service.getRestaurants().subscribe(data => (this.restaurants = data));
  }
}
