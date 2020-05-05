import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { ApiService } from '../shared/api.service';
import { Timeline } from '../shared/timeline';
import { Story } from '../shared/story';
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
  currentUser = this.authService.currentUserValue;
  createdTimelines = [];
  selectedCreatedTimeline: Timeline;
  currentStories = [];
  selectedStory: Story;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    public apiService: ApiService,
    public router: Router
  ) { 
    this.authService.currentUser.subscribe(res => {
        if (res) { this.currentUser = res }
      });
  }

  ngOnInit(): void {
    this.createLineForm = this.formBuilder.group({
      title: ['', Validators.required],
      protagonist_email: [''],
      author_id: [this.currentUser.id.toString()]
    });
    this.authorIndex();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   debugger
  //   // changes.prop contains the old and the new value...
  // }

  // convenience getter for easy access to form fields
  get f() { return this.createLineForm.controls; }

  toggleCreateLineForm(){
    this.showCreateLine = this.showCreateLine ? false : true;
  }

  createTimeline() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.createLineForm.invalid) {
        return;
    }
    this.loading = true;
    this.apiService.createTimeline(this.createLineForm.value).subscribe((res) => {
      // localStorage.setItem('access_token', res.data)
      // let tokenInfo = this.authService.getDecodedAccessToken(res.data)
      // this.authService.getUserProfile(tokenInfo.user_id).subscribe((res) => {
      //   this.router.navigate(['profile']);
      // })
    })
    this.loading = false;
  }

  authorIndex() {
    this.apiService.authorIndex().subscribe((res) => {
      this.createdTimelines = res.data
      this.selectedCreatedTimeline = res.data[0]      
      this.stories(this.selectedCreatedTimeline.id);
      return res;
    })
  }

  stories(timeline_id: String){
    this.apiService.stories(timeline_id).subscribe((res) => {
      this.currentStories = res.data
      this.selectedStory = res.data[0]
      return res;
    })
  }
}
