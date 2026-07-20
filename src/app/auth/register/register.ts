import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
   imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  user = {
    username:'',
    email:'',
    password:''
  };

  constructor(private auth:AuthService){}

  register(){

    this.auth.register(this.user).subscribe({

      next:(res)=>{

        alert("Registration Successful");

      },

      error:(err)=>{

        alert(err.error);

      }

    });

  }

}
export class Register {}
