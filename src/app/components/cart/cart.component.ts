import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatTableModule, MatIconModule, MatButtonModule]
})
export class CartComponent {
  constructor(
    public orders: OrderService,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  onQtyChange(event: Event, dishId: number): void {
    const input = event.target as HTMLInputElement | null;
    const qty = Math.max(1, Number(input?.value || 1));
    this.orders.updateQty(dishId, qty);
  }

  incrementQty(dishId: number, currentQty: number): void {
    this.orders.updateQty(dishId, currentQty + 1);
  }

  decrementQty(dishId: number, currentQty: number): void {
    if (currentQty > 1) {
      this.orders.updateQty(dishId, currentQty - 1);
    }
  }

  confirm(): void {
    if (!this.auth.isLoggedIn()) {
      this.dialog.open(LoginDialogComponent, { width: '420px' });
      return;
    }
    alert('Order confirmed! (mock)');
    this.orders.clear();
  }
}
