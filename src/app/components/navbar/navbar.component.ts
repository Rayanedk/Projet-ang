import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatBadgeModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartCount = 0;

  constructor(private orders: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.orders.cartCount$.subscribe(count => (this.cartCount = count));
  }

  go(path: string): void {
    this.router.navigate([path]);
  }
}
