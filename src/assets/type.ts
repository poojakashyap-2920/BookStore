export interface BookObj {
    BookId?: number;
    BookImage?: string;
    BookName?: string;
    Description?: string;
    AuthorName?: string;
    Price?: number;
    Quantity?: number;
}



export interface CartObj {
    cartId: number
    UserId:number
    BookId:number
    CurrentDateTime:Date
    Quantity:number
    bookImage?: string;
    bookName?: string;
    description?: string;
    authorName?: string;
    price?: number;
}
  
  
  