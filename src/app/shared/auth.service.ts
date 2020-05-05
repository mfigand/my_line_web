import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user';

import { AlertService } from '../shared/alert.service';

import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  apiEndpoint: string = 'http://localhost:4200/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    public alertService: AlertService,
    public router: Router
  ) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getDecodedAccessToken(token: string): any {
    try{
        return jwt_decode(token);
    }
    catch(Error){
        return null;
    }
  }

  signUp(user: User): Observable<any> {
    let api = `${this.apiEndpoint}/v1/users`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  signIn(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}/v1/authenticate`, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  logout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      // remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['login']);
    }
  }

  getUserProfile(id): Observable<any> {
    let api = `${this.apiEndpoint}/v1/users/${id}`;
    let authHeaders = this.headers.append('Authentication', this.getToken())

    return this.http.get(api, { headers: authHeaders }).pipe(
      map((res: any) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(res.data));
        this.currentUserSubject.next(res.data);
        return res.data || {}
      }),
      catchError(this.handleError)
    )
  }

  // Error 
  handleError = (error: HttpErrorResponse) => {
    let msg = '';
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
