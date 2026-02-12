import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dish } from './dish.service';

export interface CartItem {
  dish: Dish;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private cart: CartItem[] = [];
  private cartCount = new BehaviorSubject<number>(0);
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  cartCount$ = this.cartCount.asObservable();
  cartItems$ = this.cartItems.asObservable();

  addToCart(dish: Dish): void {
    const existing = this.cart.find(c => c.dish.id === dish.id);
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({ dish, qty: 1 });
    }
    this.syncCount();
  }

  removeFromCart(dishId: number): void {
    this.cart = this.cart.filter(c => c.dish.id !== dishId);
    this.syncCount();
  }

  updateQty(dishId: number, qty: number): void {
    const item = this.cart.find(c => c.dish.id === dishId);
    if (item) item.qty = qty;
    this.syncCount();
  }

  getCart(): CartItem[] {
    return [...this.cart];
  }

  clear(): void {
    this.cart = [];
    this.syncCount();
  }

  total(): number {
    return this.cart.reduce((sum, c) => sum + c.dish.price * c.qty, 0);
  }

  private syncCount(): void {
    const count = this.cart.reduce((s, c) => s + c.qty, 0);
    this.cartCount.next(count);
    this.cartItems.next([...this.cart]);
  }
}
