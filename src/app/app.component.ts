import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './shared/auth.service';
import { User } from './shared/user';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-line';
  currentUser: User = { id: '',
                        name: '',
                        lastname: '',
                        email: '',
                        password: '' };

    constructor(
        private router: Router,
        private authService: AuthService
    ) {
        this.authService.currentUser.subscribe(res => {
          if (res) { this.currentUser = res }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
