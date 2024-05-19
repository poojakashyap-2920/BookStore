import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { BooksComponent } from './components/books/books.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginSignupMainComponent } from './components/login-signup-main/login-signup-main.component';
import { PipeservicePipe } from './components/pipe/pipeservice.pipe';
import { MyWishlistComponent } from './components/wishlist/my-wishlist.component';
import { MyOrderComponent } from './components/cart-details/my-order.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BooksComponent,
    BookContainerComponent,
    BookDetailsComponent,
    DashboardComponent,
    LoginComponent,
    SignupComponent,
    LoginSignupMainComponent,
    PipeservicePipe,
    MyOrderComponent, 
    MyWishlistComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
