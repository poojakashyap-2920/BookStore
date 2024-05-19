import { Injectable } from '@angular/core';
import { HttpServiceService } from '../httpService/http-service.service';
import { BehaviorSubject } from 'rxjs';

import { BookObj } from 'src/assets/type';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
  removeFromCart(book: BookObj) {
    throw new Error('Method not implemented.');
  }
 
  private booksList = new BehaviorSubject<BookObj[]>([]);
  private bookList:BookObj[]=[]

  bookListState = new BehaviorSubject<BookObj[]>([]);
  currentStateBookList=this.bookListState.asObservable();

changecurrentStateBookList(value:any)
{
  this.bookListState.next(value)
}

  private searchString = new BehaviorSubject('');
  currSearchString = this.searchString.asObservable();

  
   private sendCartDataDetail:BookObj[]=[]
  currBooksList: any;

  updateBooksList(value: BookObj[]) {
    this.booksList.next(value);
  }

  constructor(private httpService: HttpServiceService) { }
  
addToCart(book: BookObj) {
  this.sendCartDataDetail.push(book);
}
 
  updateSearchString(state:string)
  {
    this.searchString.next(state)
  }



}
