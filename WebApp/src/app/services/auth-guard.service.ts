// Servicio de proteccion de rutas

import { Injectable } from '@angular/core';
import { Router, CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { ProfilesServiceService} from './profiles-service.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  // se requiere del router y de los servicios de firebase
  constructor(public auth: ProfilesServiceService, public router: Router) {}

  // si existe un user logueado, se levanta el bloqueo, sino, solo se puede ingresar a la ruta de logueo.
  canActivate(): boolean {
  this.auth.getUser()
    .subscribe(
      (user) => {
        if (user == null) {
          this.router.navigate(['login']);
          return false;
        }
        else{
          return true;
        }
      }
    );
    return true;
  }
}
