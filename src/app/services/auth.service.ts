import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export type UserRole = 'CLIENT' | 'RESTAURATEUR' | 'ADMIN' | 'LIVREUR';
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.restoreUser());
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  constructor(private http: HttpClient) {}

  private restoreUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>('assets/mock/users.json').pipe(
      map(users => {
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
          localStorage.setItem('user', JSON.stringify(found));
          this.currentUserSubject.next(found);
          return found;
        }
        return null;
      })
    );
  }

  register(payload: Partial<User>): Observable<User> {
    const newUser: User = {
      id: Date.now(),
      name: payload.name || 'New User',
      email: payload.email || '',
      password: payload.password || '',
      role: (payload.role as User['role']) || 'CLIENT'
    };
    // Persist locally only; in-memory register
    localStorage.setItem('user', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    return of(newUser);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string | string[]): boolean {
    const u = this.currentUserSubject.value;
    if (!u) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(u.role);
  }
}
