
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AddressObj } from 'src/assets/type';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private token:string ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJwb29qYUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MTg3ODIzNTAsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzQ4LyIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQ0MzQ4LyJ9.cQwfe-uOhvyZWvjdiWiCt8LThJt-aXYl16OFJmhdBGw";

//**token for compare */
private staticTokenHeader = new HttpHeaders({
 'Authorization':`Bearer ${this.token}`
});


  private authHeader = new HttpHeaders({
   
    Authorization: `Bearer ${localStorage.getItem('AuthToken')}`
  }) 
 constructor(private http: HttpClient) { }

/* ******************************** user ********************************************** */
  loginApi(email: string, password: string): Observable<any> {
    return this.http.post(`https://localhost:7142/api/User/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {});
  }

  signupApi(body: object): Observable<any> {
    return this.http.post(`https://localhost:7142/api/User`, body);
  }


  /* ********************************** book ****************************************************** */
  getAllBook(): Observable<any> {
    return this.http.get(`https://localhost:7142/api/Book/GetAll`);
  }


 /* ***************************************** cart ****************************************************** */
  addToCartApiCall(body:{bookId:any,quantity:any}): Observable<any> {
    return this.http.post('https://localhost:7142/api/Cart', body, { headers: this.staticTokenHeader })
      
  }
  updateCartQuantity(bookId: number, quantity: number): Observable<any> {
    return this.http.patch(`https://localhost:7142/api/Cart/UpdateQuantity/${bookId}?quantity=${quantity}`, {}, { headers: this.staticTokenHeader  });
  }
  
  
 
  removeToCartApiCall(bookId: number) {
    return this.http.delete(`https://localhost:7142/api/Cart/DeleteCart/${bookId}`,{ headers: this.staticTokenHeader  });
  }
  
  
   getAllCartApiCall():Observable<any>
   {
     return this.http.get(`https://localhost:7142/api/Cart`,{headers: this.authHeader})
   }
  
   /******************************************** WishList  ****************************************************** */

   getallWishList():Observable<any>
   {
    return this.http.get(`https://localhost:7142/api/WishList`,{headers:this.staticTokenHeader})
   }


   addToWishList(body:{bookId:any})
   {
    return this.http.post(`https://localhost:7142/api/WishList`,body,{ headers: this.staticTokenHeader })
   }

   
  removeToWishList(bookId: number) {
    return this.http.delete(`https://localhost:7142/api/WishList/${bookId}`,{ headers: this.staticTokenHeader  });
  }
 
/** **************************************   address api  ************************************************************ */
  getAllAddress():Observable<any>
  {
    return this.http.get(`https://localhost:7142/api/Address`,{ headers: this.staticTokenHeader  })
  }

  editAddressApiCall(addressId: number,body:AddressObj): Observable<any> {
    return this.http.put(`https://localhost:7142/api/Address/UpdateAddress/${addressId}`, body, { headers: this.staticTokenHeader });
  }
  
  

  addCustomerAddress(address: AddressObj): Observable<any> {
    return this.http.post('https://localhost:7142/api/Address', address, { headers: this.staticTokenHeader  });
  }

  removeCustomerAddress(phoneNumber: number):Observable<any>
  {
    return this.http.delete(`https://localhost:7142/api/Address/${phoneNumber}`,{ headers: this.staticTokenHeader  })
  }
}
