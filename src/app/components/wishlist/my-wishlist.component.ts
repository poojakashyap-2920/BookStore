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

  constructor(private cartService: CartserviceService) {}

  ngOnInit(): void {
    this.wishlistSubscription = this.cartService.wishlistItems$.subscribe(wishlistItems => {
      this.sendMyWishlistDetail = wishlistItems;
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  removeFromCart(book: BookObj) {
    this.cartService.removeFromWishlist(book);
  }
}
