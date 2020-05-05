import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../shared/auth.service';
import { Timeline } from './timeline';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from '../shared/alert.service';
import { throwError } from 'rxjs';

// import { User } from './user';
// import { Router } from '@angular/router';
// import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public timeline: Timeline;
  user = this.authService.currentUserValue;
  apiEndpoint: string = this.authService.apiEndpoint;
  // headers = new HttpHeaders().set('Content-Type', 'application/json');
  httpOptions = {
    headers: this.authService.headers.append('Authentication', this.authService.getToken())
  }

  constructor(
    private http: HttpClient,
    public alertService: AlertService,
    public authService: AuthService
  ) { }

  // Index Created Timelines
  authorIndex(): any {
    let authorIndexEndpoint = `${this.apiEndpoint}/v1/timelines/author_index`;
    return this.http.get(authorIndexEndpoint, this.httpOptions)
      .pipe(catchError(this.handleError))
  }

  // Create New Timeline
  createTimeline(timeline: Timeline): any {
    let createEndpoint = `${this.apiEndpoint}/v1/timelines`;
    return this.http.post(createEndpoint, timeline, this.httpOptions)
      .pipe(catchError(this.handleError))
  }

  // Index Stories
  stories(timeline_id: String): any {
    let storiesEndpoint = `${this.apiEndpoint}/v1/timelines/${timeline_id}/stories`;
    return this.http.get(storiesEndpoint, this.httpOptions)
      .pipe(catchError(this.handleError))
  }

  // Error 
  handleError = (error: HttpErrorResponse) => {
    let msg = '';
    debugger
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
      this.alertService.error(error.error.data);
    }
    return throwError(msg);
  }
}
