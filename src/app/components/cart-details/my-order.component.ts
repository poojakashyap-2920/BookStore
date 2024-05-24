import { Component, OnInit } from '@angular/core';
import { AddressObj, BookObj } from 'src/assets/type';
import { BackendCartItem } from 'src/assets/type';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { MatDialog } from '@angular/material/dialog';
import { AddressserviceService } from '../service/addressservice/addressservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSignupMainComponent } from '../login-signup-main/login-signup-main.component';

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
  backendItem: BackendCartItem[] = [];
  showAddressForm: boolean = false;
  addressForm: FormGroup;
  customerAddresses: AddressObj[] = [];
  showAddressDetails: boolean = false;
  showOrderSummary: boolean = false;
  showProductDetails: boolean = false;
  isEditing: boolean = false;
  editingAddressId: any;

  constructor(
    private cartService: CartserviceService,
    private dialog: MatDialog,
    private addressService: AddressserviceService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.addressForm = this.fb.group({
      Name: ['', Validators.required],
      MobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      FullAddress: ['', Validators.required],
      City: ['', Validators.required],
      State: ['', Validators.required],
      Type: ['Home', Validators.required],
      HomeAddress: ['']
    });
  }

  ngOnInit(): void {
    this.sendMyOrderDetail = this.cartService.getCartItemsFromStorage();
    this.isLoggedIn = localStorage.getItem('AuthToken') !== null;

    if (this.isLoggedIn) {
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
    if (this.isLoggedIn) {
      if (bookId !== undefined && bookId !== null) {
        this.cartService.removeCartApiCall(bookId).subscribe(
          res => {
            console.log("Item removed from cart:", res);
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
    if (this.isLoggedIn) {
      this.addressService.getAddressApiCall().subscribe(
        res => {
          this.customerAddresses = res;
          console.log(res);
          this.showAddressDetails = true;
        },
        err => {
          console.error(err);
          this.customerAddresses = [];
          this.showAddressDetails = true;
        }
      );
    } else {
      const dialogRef = this.dialog.open(LoginSignupMainComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe(result => {
        if (this.isLoggedIn) {
          dialogRef.close();
        }
      });
    }
  }

  addNewAddress() {
    this.showAddressForm = true;
  }

  handleAddress() {
    if (this.addressForm.valid) {
      const newAddress: AddressObj = this.addressForm.value;
      this.addressService.addCustomerAddressApiCall(newAddress).subscribe(
        response => {
          console.log("New address added:", response);
          this.customerAddresses.push(response);
          this.addressForm.reset();
          this.showAddressForm = false;
        },
        error => {
          console.error("Error adding new address:", error);
        }
      );
    } else {
      Object.keys(this.addressForm.controls).forEach(controlName => {
        this.addressForm.get(controlName)?.markAsTouched();
      });
    }
  }

  toggleAddressForm() {
    this.showAddressForm = !this.showAddressForm;
  }

  removeAddress(address: AddressObj) {
    const phoneNumber = address.MobileNumber;
    console.log(phoneNumber);
    if (this.isLoggedIn && phoneNumber) {
      this.addressService.removeAddressApiCall(phoneNumber).subscribe(
        () => {
          console.log("Address removed successfully:", address);
          this.customerAddresses = this.customerAddresses.filter(a => a.MobileNumber !== phoneNumber);
        },
        error => console.error("Error removing address:", error)
      );
    } else {
      console.log("User is not authenticated or phone number is invalid. Cannot remove address.");
    }
  }

  continueOrder(): void {
    if (this.addressForm.valid) {
      const newAddress: AddressObj = this.addressForm.value;

      if (this.isEditing && this.editingAddressId !== null) {
        this.addressService.editAddressApiCall(this.editingAddressId, newAddress).subscribe(
          res => {
            const index = this.customerAddresses.findIndex(addr => addr.AddressId === this.editingAddressId);
            if (index !== -1) {
              this.customerAddresses[index] = newAddress;
            }
            this.resetAddressForm();
          },
          err => console.error(err)
        );
      } else {
        this.addressService.addCustomerAddressApiCall(newAddress).subscribe(
          res => {
            this.customerAddresses.push(res);
            this.resetAddressForm();
          },
          err => console.error(err)
        );
      }
    }
  }

  resetAddressForm(): void {
    this.showAddressForm = false;
    this.showOrderSummary = true;
    this.showAddressDetails = true;
    this.isEditing = false;
    this.editingAddressId = null;
    this.addressForm.reset();
  }

  editAddress(address: AddressObj): void {
    this.isEditing = true;
    this.editingAddressId = address.AddressId;
    this.showAddressForm = true;
    this.addressForm.patchValue(address);
  }

  continueToProductDetails() {
    this.showOrderSummary = true;
  }

  checkout() {
    console.log("Proceed to checkout");
    // Implementation of checkout method
  }
}
