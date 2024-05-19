import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-signup-main',
  templateUrl: './login-signup-main.component.html',
  styleUrls: ['./login-signup-main.component.scss']
})
export class LoginSignupMainComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LoginSignupMainComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
login=true;
goToLogin(){
 this.login=true;
}
goToSignUp(){
 this.login=false;
}

}
