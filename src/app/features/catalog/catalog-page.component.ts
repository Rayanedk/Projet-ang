import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Restaurant, RestaurantService } from '../../services/restaurant.service';
import { RestaurantCardComponent } from '../../components/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.scss'],
  imports: [CommonModule, MatButtonModule, RestaurantCardComponent]
})
export class CatalogPageComponent implements OnInit {
  restaurants = signal<Restaurant[]>([]);
  countries = computed(() =>
    Array.from(
      new Map(this.restaurants().map(r => [r.countryCode, r.country])).entries()
    )
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([code, label]) => ({ code, label }))
  );
  activeCountry = signal<string>('ALL');

  filtered = computed(() => {
    const list = [...this.restaurants()].sort((a, b) => a.name.localeCompare(b.name));
    if (this.activeCountry() === 'ALL') return list;
    return list.filter(r => r.countryCode === this.activeCountry());
  });

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(list => this.restaurants.set(list));
  }

  selectCountry(code: string): void {
    this.activeCountry.set(code);
  }

  flag(code: string): string {
    return `https://flagcdn.com/h40/${code.toLowerCase()}.png`;
  }
}
