import { TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import {Location} from "@angular/common";
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login/login.component';

import { AppComponent } from './app.component';
import { AuthService } from './shared/auth.service';

describe('AppComponent', () => {
  // class MockAuthService extends AuthService {
  //   logout() {
  //     return false;
  //   }
  // }
  // class MockRouter extends RouterTestingModule {
  //   navigate() {
  //     jasmine.createSpy("navigate"); 
  //   }
  // }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [{ path: 'login', component: LoginComponent }]
        ),
        HttpClientModule
      ],
      providers: [
        // AuthService
        {
          provide: AuthService
          // useClass: MockAuthService
        },
        // {
        //   provide: RouterTestingModule,
        //   useClass: MockRouter
        // },
        // {
        //   provide: Router,
        //   useClass: class { 
        //       navigate = jasmine.createSpy("navigate"); 
        //   }
        // }
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'my-line'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-line');
  });

  it('should render Home link', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.nav-link').textContent).toContain('Home');
  });

  // it('should call logout', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   let service = fixture.debugElement.injector.get(AuthService);
  //   service.logout();
  //   // expect(service.logout()).toBeFalse;
  //   spyOn(service, 'logout').and.returnValue('d')
  // });
  
  // it('should navigate to /login', () => {
  //   let router: Router;
  //   let location: Location;
  //   router = TestBed.get(Router);
  //   location = TestBed.get(Location);
  //   router.initialNavigation();
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   app.logout()
    // let router = fixture.debugElement.injector.get(Router);
    // let router = fixture.debugElement.injector.get(RouterTestingModule);
    // expect(router.navigate).toHaveBeenCalledWith(["/login"]);
    // expect(router.navigate(['/login'])).toBe('/');
  // });
});
