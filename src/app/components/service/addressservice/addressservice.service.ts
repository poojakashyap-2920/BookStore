import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpServiceService } from '../httpService/http-service.service';
import { AddressObj } from 'src/assets/type';

@Injectable({
  providedIn: 'root'
})
export class AddressserviceService {

  constructor(private httpservice:HttpServiceService) { }

  getAddressApiCall(): Observable<any> {
    return this.httpservice.getAllAddress(); // Return the Observable returned by getAllAddress
  }

  // editAddressApiCall(phoneNumber: number, address: string):Observable<any>
  // {
  //   return this.httpservice.editAddress(phoneNumber,address)
  // }
  
  addCustomerAddressApiCall(address:AddressObj)
  {
    return this.httpservice.addCustomerAddress(address);
  }

  removeAddressApiCall(phoneNumber:number)
  {
    return this.httpservice.removeCustomerAddress(phoneNumber);
  }
}
