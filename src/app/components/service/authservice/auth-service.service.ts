import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('AuthToken');
    return authToken ? true : false;
  }
}
