// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Injectable } from '@angular/core';
// // import { Observable, throwError } from 'rxjs';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class HttpServiceService {
 
// //   private authHeader = new HttpHeaders({
// //     // 'Accept': "application/json",
// //     Authorization: `Bearer ${localStorage.getItem('AuthToken')}`
// //   })

  
// //   constructor(private http:HttpClient) { }



// //   loginApi(email: string, password: string): Observable<any> {
// //     return this.http.post(`https://localhost:7142/api/User/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,{})
// //   }
  
  
// //   signupApi(body:object): Observable<any>
// //   {
// //     return this.http.post(`https://localhost:7142/api/User`,body)
// //   }

// //   getAllBook(): Observable<any>
// //   {
// //      return this.http.get(`https://localhost:7142/api/Book/GetAll`)
// //   }



// //   addToCartApiCall(cartEntity: any): Observable<any> {
// //     const authToken = localStorage.getItem('AuthToken');
// //     if (authToken) {
// //       const authHeader = new HttpHeaders({
// //         'Content-Type': 'application/json',
// //         Authorization: `Bearer ${authToken}`
// //       });

// //       return this.http.post('https://localhost:7142/api/Cart', cartEntity, { headers: authHeader });
// //     } else {
// //       console.error('Authentication token is missing.');
// //       // You can handle the error here or propagate it to the caller
// //       return throwError('Authentication token is missing.');
// //     }
// //   }

// //   updateCartQuantity(userId: number, bookId: number, quantity: number): Observable<any> {
// //     if (userId && bookId && quantity) {
// //       return this.http.put(`https://localhost:7142/api/Cart/UpdateQuantity/${userId}/${bookId}`, { quantity });
// //     } else {
// //       console.error('Invalid input parameters. Please provide valid userId, bookId, and quantity.');
// //       return throwError('Invalid input parameters. Please provide valid userId, bookId, and quantity.');
// //     }
// //   }
// // }



// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpServiceService {

//   constructor(private http: HttpClient) { }

//   loginApi(email: string, password: string): Observable<any> {
//     return this.http.post(`https://localhost:7142/api/User/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {});
//   }

//   signupApi(body: object): Observable<any> {
//     return this.http.post(`https://localhost:7142/api/User`, body);
//   }

//   getAllBook(): Observable<any> {
//     return this.http.get(`https://localhost:7142/api/Book/GetAll`);
//   }

//   addToCartApiCall(cartEntity: any): Observable<any> {
//     const authToken = localStorage.getItem('AuthToken');
//     if (authToken) {
//       const authHeader = new HttpHeaders({
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${authToken}`
//       });

//       return this.http.post('https://localhost:7142/api/Cart', cartEntity, { headers: authHeader });
//     } else {
//       console.error('Authentication token is missing.');
//       // You can handle the error here or propagate it to the caller
//       return throwError('Authentication token is missing.');
//     }
//   }

//   updateCartQuantity(userId: number, bookId: number, quantity: number): Observable<any> {
//     if (userId && bookId && quantity) {
//       return this.http.put(`https://localhost:7142/api/Cart/UpdateQuantity/${userId}/${bookId}`, { quantity });
//     } else {
//       console.error('Invalid input parameters. Please provide valid userId, bookId, and quantity.');
//       return throwError('Invalid input parameters. Please provide valid userId, bookId, and quantity.');
//     }
//   }
// }



// HttpService.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private authHeader = new HttpHeaders({
   
    Authorization: `Bearer ${localStorage.getItem('AuthToken')}`
  }) 
 constructor(private http: HttpClient) { }

  loginApi(email: string, password: string): Observable<any> {
    return this.http.post(`https://localhost:7142/api/User/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {});
  }

  signupApi(body: object): Observable<any> {
    return this.http.post(`https://localhost:7142/api/User`, body);
  }

  getAllBook(): Observable<any> {
    return this.http.get(`https://localhost:7142/api/Book/GetAll`);
  }



  addToCartApiCall(body:{bookId:any,quantity:any}): Observable<any> {
    return this.http.post('https://localhost:7142/api/Cart', body, { headers: this.authHeader })
      
  }
  updateCartQuantity(bookId: number, quantity: number): Observable<any> {
    return this.http.patch(`https://localhost:7142/api/Cart/UpdateQuantity/${bookId}?quantity=${quantity}`, {}, { headers: this.authHeader });
  }
  
  
 
  removeToCartApiCall(bookId: number) {
    return this.http.delete(`https://localhost:7142/api/Cart/DeleteCart/${bookId}`,{ headers: this.authHeader });
  }
  
  //  getAllCartApiCall(endpoint:string):Observable<any>
  //  {
  //    return this.http.get(`https://localhost:7142/api/Cart`,{headers: this.authHeader})
  //  }

   getAllCartApiCall():Observable<any>
   {
     return this.http.get(`https://localhost:7142/api/Cart`,{headers: this.authHeader})
   }
  
}
