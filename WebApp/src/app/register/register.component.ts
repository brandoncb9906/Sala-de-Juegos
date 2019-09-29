
// Componente de registro

import { Component, OnInit } from '@angular/core';
import { ProfilesServiceService } from '../services/profiles-service.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  // se requiere del servicio de autentificacion
  constructor(private authService: ProfilesServiceService) { }

  ngOnInit() {
  }

  errorMessage="";
  successMessage="";

  // funcion que realiza el registro de un nuevo user
  tryRegister(value){
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

}
