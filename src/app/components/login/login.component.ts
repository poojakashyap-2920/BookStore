// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { UserService } from '../service/userService/user.service';


// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   loginForm!: FormGroup; // Use ":" instead of "!=" to define the type correctly

//   constructor(private formBuilder: FormBuilder,private userService:UserService,private router:Router) { }

//   ngOnInit(): void {
//     this.loginForm = this.formBuilder.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   get loginControl() 
//   {
//      return this.loginForm.controls; 
//   }

//   handleLogin(){
//     console.log(this.loginControl);
//      if(this.loginForm.invalid) return
//      const {email, password} = this.loginForm.value

//      this.userService.loginApiCall(email, password).subscribe((res) => {
//        console.log(res)
//        localStorage.setItem("AuthToken", res.data)
      
//     },
//       (err) => console.log(err)
//     )
//   }



 
//   }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/userService/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get loginControl() {
    return this.loginForm.controls;
  }

  // handleLogin() {
  //   if (this.loginForm.invalid) return;

  //   const { email, password } = this.loginForm.value;

  //   this.userService.loginApiCall(email, password).subscribe(
  //     (res) => {
  //          console.log(res);
  //       localStorage.setItem("AuthToken", res.data); 
    
  //     },
  //     (err) => {
  //       console.error("Login failed:", err);
  //       if (err.status === 400 && err.error && err.error.errors) {
  //         const validationErrors = err.error.errors;
  //         this.errorMessage = Object.values(validationErrors).flat().join('\n');
  //       } else {
  //         this.errorMessage = "An unexpected error occurred. Please try again later.";
  //       }
  //     }
  //   );
  // }



  handleLogin() {
    if (this.loginForm.invalid) return;
  
    const { email, password } = this.loginForm.value;
  
    this.userService.loginApiCall(email, password).subscribe(
      (res) => {
        console.log('Login API Response:', res); 
        localStorage.setItem("AuthToken", res.token);   
        console.log(localStorage.getItem('AuthToken')); // Log the token to verify
  
      },
      (err) => {
        console.error("Login failed:", err);
      }
    );
  }
  
}
