import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page.component';
import { CatalogPageComponent } from './features/catalog/catalog-page.component';
import { MenuComponent } from './components/menu/menu.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { DeliveryDashboardComponent } from './features/delivery/delivery-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'catalogue', component: CatalogPageComponent },
  { path: 'restaurant/:id', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'livreur', component: DeliveryDashboardComponent, canActivate: [AuthGuard], data: { roles: ['LIVREUR'] } },
  { path: '**', redirectTo: '' }
];
