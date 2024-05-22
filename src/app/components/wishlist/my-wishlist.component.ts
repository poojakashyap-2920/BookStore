import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BookObj } from 'src/assets/type';
import { CartserviceService } from '../service/cartService/cartservice.service';

@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.scss']
})
export class MyWishlistComponent implements OnInit, OnDestroy {
  sendMyWishlistDetail: BookObj[] = [];
  wishlistSubscription!: Subscription;
  isLoggedIn: boolean = false;

  constructor(private cartService: CartserviceService) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('AuthToken') !== null;

    if (this.isLoggedIn) {
      this.cartService.getAllWishListApi().subscribe(
        res => {
          this.sendMyWishlistDetail = res.data; // Update this line to access the `data` field
          this.cartService.saveWishlistItemsToStorage(this.sendMyWishlistDetail);
        },
        err => console.log(err)
      );
    } else {
      this.wishlistSubscription = this.cartService.wishlistItems$.subscribe(wishlistItems => {
        this.sendMyWishlistDetail = wishlistItems;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  removeFromWishlist(book: BookObj) {
    if (this.isLoggedIn) {
      this.cartService.removeWishListApiCall(book.BookId!).subscribe(
        () => {
          this.cartService.removeFromWishlist(book);
          this.updateWishlistDetail();
          console.log('Item removed from backend and local wishlist:', book);
        },
        err => {
          console.error('Error removing item from wishlist:', err);
          if (err.status === 401) {
          } else if (err.status === 404) {
            console.error('Wishlist item not found in backend');
          }
        }
      );
    } else {
      this.cartService.removeFromWishlist(book);
      this.updateWishlistDetail();
      console.log('Item removed from local wishlist:', book);
    }
  }

  updateWishlistDetail() {
    this.sendMyWishlistDetail = this.cartService.getWishlistItemsFromStorage();
  }
  
}
