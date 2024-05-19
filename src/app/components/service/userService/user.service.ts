import { Injectable } from '@angular/core';
import { HttpServiceService } from '../httpService/http-service.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService:HttpServiceService) { }
  loginApiCall(email: string, password: string)
  {
    return this.httpService.loginApi(email, password);
  }

  signupApiCall(userData: object)
  {
    return this.httpService.signupApi(userData);
  }
}
