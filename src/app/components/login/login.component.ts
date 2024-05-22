import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/userService/user.service';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { BookObj } from 'src/assets/type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  private cartService:CartserviceService,// Inject CartService
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get loginControl() {
    return this.loginForm.controls;
  }

  handleLogin() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.userService.loginApiCall(email, password).subscribe(
      (res) => {
        console.log('Login API Response:', res);
        localStorage.setItem("AuthToken", res.token);+
        console.log(localStorage.getItem('AuthToken')); // Log the token to verify

        this.onSuccessfulLogin();
      },
      (err) => {
        console.error("Login failed:", err);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
    //window.location.reload();
  }

  onSuccessfulLogin() {
    this.compareAndUpdateCartData();
    this.compareAndUpdateWishlistData(); // Add method for updating wishlist data
  
    if (this.checkCartDataMatch() && this.checkCartQuantitiesMatch() && this.checkWishlistDataMatch()) {
      this.navigateToAddressSummary();
    } else {
      console.error('Cart or Wishlist data does not match.');
    }
  }
  
  // onSuccessfulLogin() {
  //   this.compareAndUpdateCartData();

  //   if (this.checkCartDataMatch() && this.checkCartQuantitiesMatch()) {
  //     this.navigateToAddressSummary();
  //   } else {
  //   }
  // }


  checkCartDataMatch(): boolean {
    const backendItems = this.cartService.getCartItemsFromStorage();
    const localItems = this.cartService.getCartItemsFromStorage();
    return backendItems.length === localItems.length;
  }

  checkCartQuantitiesMatch(): boolean {
    const backendItems = this.cartService.getCartItemsFromStorage();
    const localItems = this.cartService.getCartItemsFromStorage();
    for (const localItem of localItems) {
      const backendItem = backendItems.find(item => item.BookId === localItem.BookId);
      if (!backendItem || backendItem.Quantity !== localItem.Quantity) {
        return false;
      }
    }
    return true;
  }


  compareAndUpdateCartData() {
    this.cartService.getAllCartApi().subscribe(
      (backendItems) => {
        const localItems = this.cartService.getCartItemsFromStorage();
  
        localItems.forEach(localItem => {
          const backendItemIndex = backendItems.findIndex((item: { BookId: number | undefined; }) => item.BookId === localItem.BookId);
          if (backendItemIndex !== -1) {
            backendItems[backendItemIndex].Quantity = localItem.Quantity;
            this.cartService.updateCartQuantityApiCall(localItem.BookId!, localItem.Quantity!).subscribe(
              () => {
                console.log("Quantity updated in backend for BookId:", localItem.BookId);
              },
              (error) => {
                console.error("Error updating quantity in backend for BookId:", localItem.BookId, error);
              }
            );
          } else {
            // Item doesn't exist in backend, add it
            backendItems.push(localItem);
            // Add item to backend via API
            this.cartService.addToCartApi({ bookId: localItem.BookId, quantity: localItem.Quantity }).subscribe(
              () => {
                console.log("Item added to backend:", localItem);
              },
              (error) => {
                console.error("Error adding item to backend:", localItem, error);
              }
            );
          }
        });
  
        this.cartService.saveCartItemsToStorage(backendItems);
      },
      (error) => {
        console.error('Error fetching cart items from backend:', error);
      }
    );
  }
  

  compareAndUpdateWishlistData() {
    this.cartService.getAllWishListApi().subscribe(
      (backendResponse) => {
        const backendItems = backendResponse.data;
        const localItems = this.cartService.getWishlistItemsFromStorage();
  
        localItems.forEach((localItem: any) => {
          const backendItemIndex = backendItems.findIndex(
            (item: { BookId: number | undefined }) => item.BookId === localItem.BookId
          );
          if (backendItemIndex === -1) {
            this.cartService.addToWishlistApiCall({ bookId: localItem.BookId }).subscribe(
              () => {
                console.log("Item added to wishlist in backend:", localItem);
              },
              (error) => {
                console.error("Error adding item to wishlist in backend:", localItem, error);
              }
            );
          } else {
            console.log("Item already in wishlist in backend:", localItem);
          }
        });
  
        // Add items from the backend to local storage if they don't exist in local storage
        backendItems.forEach((backendItem: any) => {
          const localItemIndex = localItems.findIndex(
            (item: { BookId: number | undefined }) => item.BookId === backendItem.BookId
          );
          if (localItemIndex === -1) {
            // Item doesn't exist in local storage, add it
            localItems.push(backendItem);
          } else {
            console.log("Item already in wishlist in local storage:", backendItem);
          }
        });
  
        // Save updated local items to local storage
        this.cartService.saveWishlistItemsToStorage(localItems);
      },
      (error) => {
        console.error('Error fetching wishlist items from backend:', error);
      }
    );
  }
  
  
  checkWishlistDataMatch(): boolean {
    const backendItems = this.cartService.getWishlistItemsFromStorage();
    const localItems = this.cartService.getWishlistItemsFromStorage();
    return backendItems.length === localItems.length;
  }
  
  

  navigateToAddressSummary() {
    this.router.navigate(['/address-summary']);
  }
}

/********************************************************************************************************************************************************* */

