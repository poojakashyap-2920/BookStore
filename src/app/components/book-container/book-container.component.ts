import { Component, OnInit } from '@angular/core';
import { BookServiceService } from '../service/bookService/book-service.service';
import { BookObj } from 'src/assets/type';

@Component({
  selector: 'app-book-container',
  templateUrl: './book-container.component.html',
  styleUrls: ['./book-container.component.scss']
})
export class BookContainerComponent implements OnInit {

  bookList: BookObj[] = [];
  constructor(private bookService: BookServiceService) { }

  ngOnInit(): void {
    this.bookService.currentStateBookList.subscribe(res=>this.bookList=res)
  }
}
