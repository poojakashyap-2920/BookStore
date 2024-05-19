import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BookObj } from 'src/assets/type';
import { BookServiceService } from '../service/bookService/book-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  @Input() bookObjList!: BookObj[];
  booksList:BookObj[] =[];
  searchString:string=''

  constructor(private router: Router, private bookService: BookServiceService) { }

  ngOnInit(): void {
    // console.log(this.bookObjList);
    this.bookService.currentStateBookList.subscribe(res=>this.booksList=res)
    console.log(this.booksList);

    
    
    
    }
  

  handleBookDetail(book: BookObj){
    console.log(book.BookId);
    
    // this.bookService.currBooksList(book);
    this.router.navigate(['/dashboard/details',book.BookId]);
  }

}

