import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule]
})
export class RegisterDialogComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['CLIENT', Validators.required]
  });

  constructor(
    private auth: AuthService,
    private ref: MatDialogRef<RegisterDialogComponent>
  ) {}

  submit(): void {
    if (this.form.invalid) return;
    const { name, email, password, role } = this.form.getRawValue();
    this.auth
      .register({
        name: name || '',
        email: email || '',
        password: password || '',
        role: (role as 'CLIENT' | 'RESTAURATEUR') || 'CLIENT'
      })
      .subscribe(() => this.ref.close(true));
  }
}
