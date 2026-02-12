import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { Restaurant, RestaurantService } from '../../services/restaurant.service';
import { Dish, DishService } from '../../services/dish.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule
  ]
})
export class AdminDashboardComponent {
  restaurants = computed(() => this.restaurantService.restaurants());
  dishes = computed(() => this.dishService.dishes());
  selectedRestaurant = signal<number | null>(null);

  private fb = inject(FormBuilder);
  restaurantForm = this.fb.group({
    name: ['', Validators.required],
    country: ['', Validators.required],
    description: ['', Validators.required],
    image: ['', Validators.required],
    cuisine: [''],
    featured: [false],
    addedAt: [new Date().toISOString().slice(0, 10)]
  });

  dishForm = this.fb.group({
    restaurantId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    image: ['', Validators.required],
    category: ['', Validators.required]
  });

  constructor(
    private restaurantService: RestaurantService,
    private dishService: DishService
  ) {}

  saveRestaurant(): void {
    if (this.restaurantForm.invalid) return;
    this.restaurantService.addRestaurant(this.restaurantForm.value as Omit<Restaurant, 'id'>);
    this.restaurantForm.reset({
      featured: false,
      addedAt: new Date().toISOString().slice(0, 10)
    });
  }

  deleteRestaurant(id: number): void {
    this.restaurantService.deleteRestaurant(id);
  }

  saveDish(): void {
    if (this.dishForm.invalid) return;
    this.dishService.addDish(this.dishForm.value as Omit<Dish, 'id'>);
    this.dishForm.reset({ restaurantId: null, price: 0 });
  }

  deleteDish(id: number): void {
    this.dishService.deleteDish(id);
  }
}
