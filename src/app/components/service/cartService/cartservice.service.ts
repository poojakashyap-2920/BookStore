

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookObj } from 'src/assets/type';
import { HttpServiceService } from '../httpService/http-service.service';

@Injectable({
  providedIn: 'root'
})
export class CartserviceService {
  private cartItems: BookObj[] = [];
  private cartItemsSubject = new BehaviorSubject<BookObj[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private wishlistItems: BookObj[] = [];
  private wishlistItemsSubject = new BehaviorSubject<BookObj[]>([]);
  wishlistItems$ = this.wishlistItemsSubject.asObservable();


  constructor(private http:HttpServiceService) {
    const storedCartItems = localStorage.getItem('cartItems');
    const storedWishlistItems = localStorage.getItem('wishlistItems');

    if (storedCartItems) {
      this.cartItems = JSON.parse(storedCartItems);
      this.cartItemsSubject.next(this.cartItems);
    }

    if (storedWishlistItems) {
      this.wishlistItems = JSON.parse(storedWishlistItems);
      this.wishlistItemsSubject.next(this.wishlistItems);
    }
  }


  getCartItemsFromStorage(): BookObj[] {
    // Retrieve cart items from local storage
    const cartItemsStr = localStorage.getItem('cartItems');
    return cartItemsStr ? JSON.parse(cartItemsStr) : [];
  }
  addToCart(book: BookObj) {
    const existingItem = this.cartItems.find(item => item.BookId === book.BookId);
    if (existingItem) {
      existingItem.Quantity = (existingItem.Quantity || 0) + 1;
    } else {
      this.cartItems.push({ ...book, Quantity: 1 });
      console.log(this.cartItems);
      
    }
    this.saveCartItemsToLocalStorage();
}

  updateQuantity(book: BookObj, quantity: number) {
    const item = this.cartItems.find(item => item.BookId === book.BookId);
    if (item) {
      item.Quantity = quantity;
      this.saveCartItemsToLocalStorage();
    }
  }


  isBookInLocalCart(book: BookObj): boolean {
    return this.cartItems.some(item => item.BookId === book.BookId);
  }

  
  addToCartApi(data:{bookId: any,quantity: any}) {
    return this.http.addToCartApiCall(data);
  }


  updateCartQuantityApiCall(bookId: number, quantity: number): Observable<any> {
    return this.http.updateCartQuantity(bookId, quantity);
}


  removeCartApiCall(bookId:number)
  {
    return this.http.removeToCartApiCall(bookId);
  }
 

  getAllCartApi()
  {
    return this.http.getAllCartApiCall();
  }
  
  isBookInCart(bookId: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAllCartApi().subscribe(res => {
        const bookInCart = res.some((item: { BookId: number }) => item.BookId === bookId);
        observer.next(bookInCart);
        observer.complete();
      }, err => {
        observer.error(err);
      });
    });
  }

  removeItem(book: BookObj) {
    this.cartItems = this.cartItems.filter(item => item.BookId !== book.BookId);
    this.saveCartItemsToLocalStorage();
  }

  addToWishlist(book: BookObj) {
    const existingItem = this.wishlistItems.find(item => item.BookId === book.BookId);
    if (!existingItem) {
      this.wishlistItems.push(book);
      this.saveWishlistItemsToLocalStorage();
      console.log(existingItem)
    }
  }

  

  // Get wishlist items from storage
getWishlistItemsFromStorage() {
  const items = localStorage.getItem('wishlistItems');
  return items ? JSON.parse(items) : [];
}
  removeFromWishlist(book: BookObj) {
    this.wishlistItems = this.wishlistItems.filter(item => item.BookId !== book.BookId);
    this.saveWishlistItemsToLocalStorage();
  }

  private saveCartItemsToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }

  private saveWishlistItemsToLocalStorage() {
    localStorage.setItem('wishlistItems', JSON.stringify(this.wishlistItems));
    this.wishlistItemsSubject.next(this.wishlistItems);
  }


  //******************************** */

  saveCartItemsToStorage(cartItems: BookObj[]) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    this.cartItemsSubject.next(cartItems);
  }

  /******************************   wishlist  ********************************** */ 



  // Save wishlist items to storage
saveWishlistItemsToStorage(items: any[]) {
  localStorage.setItem('wishlistItems', JSON.stringify(items));
}



  addToWishlistApiCall(data:{bookId: any}) {
    return this.http.addToWishList(data);
  }


  
  removeWishListApiCall(bookId:number)
  {
    return this.http.removeToWishList(bookId);
  }


  getAllWishListApi()
  {
    return this.http.getallWishList();
  }
}
/********************************************************************************************************************************** */

