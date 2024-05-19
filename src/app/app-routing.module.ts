import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookContainerComponent } from './components/book-container/book-container.component';
import { BookDetailsComponent } from './components/book-details/book-details.component';
import { MyWishlistComponent } from './components/wishlist/my-wishlist.component';
import { MyOrderComponent } from './components/cart-details/my-order.component';
//import { MyWishlistComponent } from './components/wishlist/my-wishlist.component';


const routes: Routes = [
  {path:'dashboard',component:DashboardComponent,children:[
    {path:'books',component:BookContainerComponent},
    {path:'details/:bookId',component:BookDetailsComponent},
    // {path:'cartdetails',component:CartDetailsComponent},
     {path:'my-order',component:MyOrderComponent},
     {path:'my-wishlist',component:MyWishlistComponent},
    //  {path:'address-details',component:AddressDetailsComponent}
    ]}
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

