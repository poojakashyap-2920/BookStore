import { Component, OnInit } from '@angular/core';
import { BookObj, CartObj } from 'src/assets/type';
import { BookServiceService } from '../service/bookService/book-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartserviceService } from '../service/cartService/cartservice.service';
import { Observable } from 'rxjs';
import { HttpServiceService } from '../service/httpService/http-service.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  sendBookDetail!: BookObj;
  addedToBag: boolean = false;
  count: number = 1;
  quantity: any;
  sendMyOrderDetail: BookObj[] = [];
  
  constructor(
    private bookService: BookServiceService,
    private cartService: CartserviceService,
    private rout: Router, 
    private router: ActivatedRoute,
    private httpService:HttpServiceService
  ) {}

  ngOnInit(): void {
    this.bookService.currentStateBookList.subscribe(res1 => {
     this.router.params.subscribe(res2=>{
      this.sendBookDetail= res1.filter(e=>e.BookId==res2['bookId'])[0]
     })
    });
    
// Fetch My Order details
this.cartService.cartItems$.subscribe(items => {
  this.sendMyOrderDetail = items;
  
  console.log(this.sendMyOrderDetail)
  console.log("cart item showing...")
});

    
  }



addToBag() {
  const isBookInLocalCart = this.cartService.isBookInLocalCart(this.sendBookDetail);

  if (localStorage.getItem('AuthToken') !== null) {
    this.cartService.isBookInCart(this.sendBookDetail.BookId || 0).subscribe(isBookInCart => {
      if (isBookInCart) {
        alert("This book is already in your cart.");
      } else {
        this.addedToBag = true;
        // Assuming `count` is defined elsewhere in the component
        const { BookId, Quantity } = this.sendBookDetail;
        this.cartService.addToCartApi({ bookId: this.sendBookDetail.BookId, quantity: this.quantity }).subscribe(res => {
          console.log(res);
        });
        
      }
    });
  } else {
    if (isBookInLocalCart) {
      alert("This book is already in your cart.");
    } else {
      this.addedToBag = true;
      // Assuming `this.bookService.addToCart` method exists
     
       this.cartService.addToCart(this.sendBookDetail)
       console.log("cart added");
       
    }
  }
}




  



 

  increaseCount() {
    this.count++;
    this.cartService.updateQuantity(this.sendBookDetail, this.count);
  }


  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      this.cartService.updateQuantity(this.sendBookDetail, this.count);
    }
  }


  addToWishlist() {
    this.cartService.addToWishlist(this.sendBookDetail);
    this.rout.navigate(['/dashboard/my-wishlist']); // Use router to navigate
  }
  
  
}












