import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSignupMainComponent } from './login-signup-main.component';

describe('LoginSignupMainComponent', () => {
  let component: LoginSignupMainComponent;
  let fixture: ComponentFixture<LoginSignupMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginSignupMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSignupMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
