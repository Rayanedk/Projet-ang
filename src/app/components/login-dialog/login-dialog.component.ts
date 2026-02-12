import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LoginDialogComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;

  constructor(
    private auth: AuthService,
    private snack: MatSnackBar,
    private ref: MatDialogRef<LoginDialogComponent>
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { email, password } = this.form.getRawValue();
    if (!email || !password) {
      this.loading = false;
      return;
    }
    this.auth.login(email, password).subscribe(user => {
      this.loading = false;
      if (user) {
        this.snack.open(`Welcome ${user.name}!`, 'Close', { duration: 2000 });
        this.ref.close(true);
      } else {
        this.snack.open('Invalid credentials', 'Close', { duration: 2000 });
      }
    });
  }
}
