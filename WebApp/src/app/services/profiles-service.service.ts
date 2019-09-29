
// Servicio de Auntentificacion

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfilesServiceService {

  private static user: firebase.auth.UserCredential;

  // se requiere de los servicios de autentificacion de firebase
  constructor(
    public _firebaseAuth: AngularFireAuth
  ) { }

  // se realiza un metodo de logueo con firebase para google
  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  // funcion para retornar el usuario actual
  getUser() {
    return this._firebaseAuth.user;
  }

  get currentUserObservable(): any {
    return this._firebaseAuth.auth;
  }

  // funcion para retornar el estado del usuario actual
  getAuthState(): boolean {
    return this._firebaseAuth.authState !== null;
  }

  // funcion para registrar un nuevo usuario mediante firebase
  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }

  // funcion para logout mediante firebase
  salir() {
    return this._firebaseAuth.auth.signOut();
  }

}
