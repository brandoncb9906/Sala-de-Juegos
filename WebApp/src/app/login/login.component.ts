// componente de logueo
// Jason
import { Component, OnInit } from '@angular/core';
import { ProfilesServiceService } from '../services/profiles-service.service';
import { Profile } from '../interface/profile.interface';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public itemsCollection: AngularFirestoreCollection<Profile>;
  public user: any;
  public name: any;

  // se requiere de los servicios de autentificacion y de firebase
  constructor(private _authService: ProfilesServiceService, 
    private afs: AngularFirestore,
    private _router:Router) {
    this.user = null;
  }

  // se obtiene el user en caso de ya estar logueado, para evitar mostrar datos inncesarios en el html
  ngOnInit() {
    this._authService.getUser()
    .subscribe(
      data => {
        if (data == null) {
          this.user = null;
        }
      }
    );
  }

  // metodo de logueo con google mediante la utilizacion de la autentificacion de firebase
  signInWithGoogle() {
    this._authService.signInWithGoogle()
    .then(
      data => {
        this.user = data.user.displayName;
        this.name = data.user.displayName;
        this.createNewProfile(data.user.uid);
      }
    );
  }
  
  // a la hora de realizar un logueo de un nuevo user se crea un nuevo perfil para este nuevo user
  createNewProfile(uid2: string) {
    // se obtienen los datos necesario del user mediante un subscribe
    this._authService._firebaseAuth.authState.subscribe(user => {
      if (!user) {
        return;
      }
      uid2 = user.uid;
    });

    // se obtiene la collecion de firebase de perfiles de users
    this.itemsCollection = this.afs.collection<Profile>('profiles');

    // en caso de no existir un perfil con el uid del nuevo user logueado, se procede a sumarlo a la colleccion con datos
    // por defecto en firebase
    this.afs.collection<Profile>('profiles', ref => ref.where('uid', '==', uid2))
    .snapshotChanges().subscribe(res => {
      if (res.length > 0 ) {
      console.log('El perfil ya existe');
      } else {
      this.itemsCollection.doc(uid2).set({ name: this.name, empatados: 0, ganados: 0, perdidos: 0, nivel: 'Rook', uid: uid2 });
      }
  });

  }

}
