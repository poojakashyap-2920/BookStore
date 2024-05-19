import { Component, OnInit } from '@angular/core';
import { BookObj } from 'src/assets/type';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  addedToBag: boolean = false;
  count: number = 1;
  sendMyOrderDetail: BookObj[] = [];

  
 

  constructor(private cartService: CartserviceService) { }

  ngOnInit(): void {
    this.sendMyOrderDetail = this.cartService.getCartItemsFromStorage();

    if (localStorage.getItem('AuthToken') !== null) {
      this.cartService.getAllCartApi().subscribe(
        res => {
          this.sendMyOrderDetail = res;
          console.log(this.sendMyOrderDetail);
        },
        err => console.log(err)
      );
    } else {
      this.cartService.cartItems$.subscribe(items => {
        this.sendMyOrderDetail = items;
        console.log("Local Cart Items:", items);
      });

     
    }
  }





  handleCartQuantity(item: BookObj, action: string) {
    const isLoggedIn = localStorage.getItem('AuthToken') !== null;
    const newQuantity = action === 'increment' ? (item.Quantity || 1) + 1 : (item.Quantity || 1) - 1;

    if (newQuantity > 0) {
      if (isLoggedIn) {
        this.cartService.updateCartQuantityApiCall(item.BookId!, newQuantity).subscribe(
          res => {
            console.log("Quantity updated via API:", res);
            // Refresh cart items from API after update
            this.cartService.getAllCartApi().subscribe(
              cartItems => {
                this.sendMyOrderDetail = cartItems;
              },
              error => {
                console.error("Error fetching cart items after update:", error);
              }
            );
          },
          err => console.error("Error updating quantity via API:", err)
        );
      } else {
        this.cartService.updateQuantity(item, newQuantity);
      }
    }
  }




  placeOrder() {
    // Implement order placement logic
  }

  
  
  removeFromCart(item: BookObj) {
    const bookId = item.BookId; // Accessing bookId directly from the item object
    console.log("Item:", item); // Log the item object to inspect its structure

    console.log("bookId:", bookId); 
  console.log("bookId:", bookId); 
  if (localStorage.getItem('AuthToken') !== null) {
    if (bookId !== undefined && bookId !== null) {
      this.cartService.removeCartApiCall(bookId).subscribe(
        res => {
          console.log(res);
          console.log("Item removed from cart:", item);
          // Refresh cart items from API after removal
          this.cartService.getAllCartApi().subscribe(
            cartItems => {
              this.sendMyOrderDetail = cartItems;
            },
            error => {
              console.error("Error fetching cart items after removal:", error);
            }
          );
        },
        err => console.error("Error removing item from cart:", err)
      );
    }
  } else {
    this.cartService.removeItem(item);
    // Update cart items after removing book
    // this.sendMyOrderDetail = this.cartService.getCartItems(); // Assuming you have a method to retrieve local cart items
  }
}



}



