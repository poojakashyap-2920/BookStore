import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/userService/user.service';
import { CartserviceService } from '../service/cartService/cartservice.service';

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
        localStorage.setItem("AuthToken", res.token);
        console.log(localStorage.getItem('AuthToken')); // Log the token to verify

        this.onSuccessfulLogin();
      },
      (err) => {
        console.error("Login failed:", err);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    );
  }

  onSuccessfulLogin() {
    this.compareAndUpdateCartData();

    if (this.checkCartDataMatch() && this.checkCartQuantitiesMatch()) {
      this.navigateToAddressSummary();
    } else {
    }
  }


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
  
  

  navigateToAddressSummary() {
    this.router.navigate(['/address-summary']);
  }
}
