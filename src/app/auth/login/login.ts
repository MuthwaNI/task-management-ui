import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector:'app-login',
   imports: [FormsModule], 
  templateUrl:'./login.html'
})
export class LoginComponent{

user={

username:'',
password:''

};

constructor(

private auth:AuthService,
private router:Router

){}

login(){

this.auth.login(this.user)

.subscribe({

next:(res)=>{

this.auth.saveToken(res.token);

this.router.navigate(['/dashboard']);

},

error:()=>{

alert("Invalid Login");

}

});

}

}
export class Login {}
