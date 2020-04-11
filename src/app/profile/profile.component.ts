import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  createLineForm: FormGroup;
  loading = false;
  showCreateLine = false;
  submitted = false;
  currentUser: User = { id: '',
                        name: '',
                        lastname: '',
                        email: '',
                        password: '' };

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) { 
    this.authService.currentUser.subscribe(res => {
        if (res) { this.currentUser = res }
      });
  }

  ngOnInit(): void {
    this.createLineForm = this.formBuilder.group({
      title: ['', Validators.required],
      protagonist: ['']
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createLineForm.controls; }

  toggleCreateLineForm(){
    this.showCreateLine = this.showCreateLine ? false : true;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.createLineForm.invalid) {
        return;
    }

    this.loading = true;

    // this.authService.signIn(this.createLineForm.value).subscribe((res) => {
    //   localStorage.setItem('access_token', res.data)
    //   let tokenInfo = this.authService.getDecodedAccessToken(res.data)
    //   this.authService.getUserProfile(tokenInfo.user_id).subscribe((res) => {
    //     this.router.navigate(['profile']);
    //   })
    // })

    this.loading = false;
  }
}
