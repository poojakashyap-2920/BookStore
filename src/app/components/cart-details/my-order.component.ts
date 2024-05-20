import { Component, OnInit } from '@angular/core';
import { BookObj } from 'src/assets/type';
import { BackendCartItem } from 'src/assets/type';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { Subscription } from 'rxjs';
import { LoginSignupMainComponent } from '../login-signup-main/login-signup-main.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {
  addedToBag: boolean = false;
  count: number = 1;
  sendMyOrderDetail: BookObj[] = [];
  isLoggedIn: boolean = false;
  backendItem: BackendCartItem[] =[];
  showAddressSummary = false;
 

  constructor(private cartService: CartserviceService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.sendMyOrderDetail = this.cartService.getCartItemsFromStorage();
    this.isLoggedIn = localStorage.getItem('AuthToken') !== null;

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
    const currentQuantity = item.Quantity !== undefined ? item.Quantity : 1; 
    const newQuantity = action === 'increment' ? currentQuantity + 1 : currentQuantity - 1;
  
    if (newQuantity > 0) {
      if (isLoggedIn) {
        this.cartService.updateCartQuantityApiCall(item.BookId!, newQuantity).subscribe(
          res => {
            console.log("Quantity updated via API:", res);
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

  

  removeFromCart(item: BookObj) {
    const bookId = item.BookId;
    if (localStorage.getItem('AuthToken') !== null) {
      if (bookId !== undefined && bookId !== null) {
        this.cartService.removeCartApiCall(bookId).subscribe(
          res => {
            console.log(res);
            console.log("Item removed from cart:", item);
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
    }
  }

  placeOrder() {
    if (localStorage.getItem('AuthToken') !== null) {
      this.showAddressSummary = true;
    }
   else {
      const dialogRef = this.dialog.open(LoginSignupMainComponent, {
        width: '600px', 
        disableClose: true, 
        autoFocus: false, 
      });
      this.showAddressSummary = true;
  
      
    }
  }
  

  openAddressDetails() {
    
  }




  handleContinue(){}
}

