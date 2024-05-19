
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginSignupMainComponent } from '../login-signup-main/login-signup-main.component';
import { BookServiceService } from '../service/bookService/book-service.service';
import { BookObj } from 'src/assets/type';
import { HttpServiceService } from '../service/httpService/http-service.service';
import { CART_ICON, LOGOUT_ICON, PROFILE_ICON, SEARCH_ICON } from 'src/assets/svg-icons';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginclick = false;
  sendOrderDetail!: BookObj;
  searchString: string = '';
  cartItemCount: number = 0;
  cartItems: BookObj[] = [];
  private cartSubscription: Subscription | undefined;

 

  constructor(
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry,
    private dialog: MatDialog,
    private bookService: BookServiceService,
    private router: Router,
    private httpService: HttpServiceService,
    private cartService: CartserviceService
  ) { 
    matIconRegistry.addSvgIconLiteral("search-icon", domSanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    matIconRegistry.addSvgIconLiteral("cart-icon", domSanitizer.bypassSecurityTrustHtml(CART_ICON));
    matIconRegistry.addSvgIconLiteral("profile-icon", domSanitizer.bypassSecurityTrustHtml(PROFILE_ICON));
    matIconRegistry.addSvgIconLiteral("logout-icon", domSanitizer.bypassSecurityTrustHtml(LOGOUT_ICON));
  }

  ngOnInit(): void {
    this.httpService.getAllBook().subscribe(res => {
      // Store the book data in local storage
      localStorage.setItem('books', JSON.stringify(res));
      // Update the book list in the BookService
      this.bookService.changecurrentStateBookList(res);
    });

    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.length;
    });
    
  }

  

  login() {
    const dialogRef = this.dialog.open(LoginSignupMainComponent, { width: '720px', height: '480px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.loginclick = !this.loginclick;
  }

  handleSerachString() {
    this.bookService.updateSearchString(this.searchString);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['dashboard']);
  }


  myorder(sendOrderDetail: any): void {
    console.log('Navigating to My Orders with detail:', sendOrderDetail);
    this.router.navigate(['/dashboard/my-order']);
  }

  // Method to navigate to the Wishlist page
  wishlist(sendOrderDetail: any): void {
    console.log('Navigating to Wishlist with detail:', sendOrderDetail);
    this.router.navigate(['/dashboard/my-wishlist']);
  }

  cartevent()
  {
    this.router.navigate(['/dashboard/my-order']);
  }
}
