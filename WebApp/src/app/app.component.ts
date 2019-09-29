import { Component } from '@angular/core';
import { ProfilesServiceService } from './services/profiles-service.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  // utilizacion del servicio de autentificacion para el boton de deslogueo
  constructor( public _authService: ProfilesServiceService, private _router:Router) {

  }
  // funcion que realiza el logout del user actual
  salir() {
    this._router.navigate(["login"])
    .then(()=>{
      this._authService.salir()
    })
    
  }
}
