import { Component, OnInit } from '@angular/core';
import { AddressObj, BookObj } from 'src/assets/type';
import { BackendCartItem } from 'src/assets/type';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { Subscription } from 'rxjs';
import { LoginSignupMainComponent } from '../login-signup-main/login-signup-main.component';
import { MatDialog } from '@angular/material/dialog';
import { AddressserviceService } from '../service/addressservice/addressservice.service';
import { log } from 'console';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

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
  showAddressForm: boolean = false;
 
  addressForm: FormGroup;
 
  customerAddresses: AddressObj[] = [];
  showAddressDetails: boolean = false;  // Add this flag to control address display

  constructor(private cartService: CartserviceService,private dialog: MatDialog,private addressService:AddressserviceService, private fb: FormBuilder,private router:Router) { 
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      FullAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['Home', Validators.required],
      homeAddress: ['']
    });

  }

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

  /*********************************************address ************************************************ */
 

  placeOrder() {
    if (this.isLoggedIn) {
      this.addressService.getAddressApiCall().subscribe(
        res => {
          this.customerAddresses = res;
          console.log(res)
          this.showAddressDetails = true;  // Set the flag to true to show address details
          console.log(res)
        },
        err => {
          console.error(err);
          this.customerAddresses = [];
          this.showAddressDetails = true;  // Set the flag to true even if there are no addresses
        }
      );
    } else {
      const dialogRef = this.dialog.open(LoginSignupMainComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result=>{
        if(this.isLoggedIn){dialogRef.close()}
     } )
    }
  }

  
  
  

  addNewAddress()
  {
    this.showAddressForm = true; // Show the address form

  }
  editAddress(address:AddressObj)
  {

  }
  

  handleaddress() {
    if (this.addressForm.valid) {
      const newAddress: AddressObj = this.addressForm.value;
      this.addressService.addCustomerAddressApiCall(newAddress).subscribe(
        (response: any) => {
          
          console.log("New address added:", response);
          
          this.addressForm.reset(); 
          this.addressService.getAddressApiCall().subscribe(
            (response:any)=>{
              
            }
          );
          // Reset the form after successful submission
        },
        (error: any) => {
          console.error("Error adding new address:", error);

        }
      );
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.addressForm.controls).forEach(controlName => {
        this.addressForm.get(controlName)?.markAsTouched();
      });
    }
  }

  toggleAddressForm() {
    // Toggle the visibility of the address form
    this.showAddressForm = !this.showAddressForm;
  }






  removeAddress(address: AddressObj) {
    const phoneNumber = address.mobileNumber; // Assuming mobileNumber corresponds to phoneNumber
    console.log(phoneNumber);
    if (this.isLoggedIn && phoneNumber !== undefined && phoneNumber !== null) {
      this.addressService.removeAddressApiCall(phoneNumber).subscribe(
        () => {
          
          console.log("Address removed successfully:", address);
          // Update the local list of addresses
          this.customerAddresses = this.customerAddresses.filter(a => a.mobileNumber !== phoneNumber);

        },
        error => console.error("Error removing address:", error)
      );
    } else {
      console.log("User is not authenticated or phone number is invalid. Cannot remove address.");
    }
  }
  
  
}

