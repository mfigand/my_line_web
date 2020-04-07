import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiEndpoint: string = 'http://localhost:4200/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.apiEndpoint}/v1/users`;

    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.apiEndpoint}/v1/authenticate`, user)
      .subscribe((res: any) => {
        let tokenInfo = this.getDecodedAccessToken(res.data)
        localStorage.setItem('access_token', res.data)

        this.getUserProfile(tokenInfo.user_id).subscribe((res) => {
          this.currentUser = res.data;
          this.router.navigate(['users/' + res.data.id]);
        })
      })
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

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  logout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    let api = `${this.apiEndpoint}/v1/users/${id}`;
    let authHeaders = this.headers.append('Authentication', this.getToken())

    return this.http.get(api, { headers: authHeaders }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(this.handleError)
    )
  }

  // Error 
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
