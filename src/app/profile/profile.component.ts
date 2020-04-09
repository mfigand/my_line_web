import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User = { id: '',
                        name: '',
                        lastname: '',
                        email: '',
                        password: '' };

  constructor(
    private authService: AuthService
  ) { 
    this.authService.currentUser.subscribe(res => {
        if (res) { this.currentUser = res }
      });
  }

  ngOnInit(): void {
  }

}
