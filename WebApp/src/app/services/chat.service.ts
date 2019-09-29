
// Servicio de Chat

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { ProfilesServiceService } from './profiles-service.service';

@Injectable()
export class ChatService {

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  public chats: Mensaje[] = [];
  public usuario: any = {};

  // se utilizan los servicios de firebase y autentificacion
  constructor( private _authService: ProfilesServiceService,
  private afs: AngularFirestore ) {
      // se obtienen los datos del user actual
      this._authService._firebaseAuth.authState.subscribe(user => {
        console.log('US: ', user);
        if (!user) {
          return;
        }

        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
      });
  }

  // funcion que carga los mensajes de la collecion de firebase de chats
  cargarMensajes() {

    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha', 'desc').limit(20));

    return this.itemsCollection.valueChanges()
        .pipe(map((mensajes: Mensaje[]) => {
          console.log( mensajes );
          this.chats = [];

          for (let mensaje of mensajes) {
            this.chats.unshift(mensaje);
          }
          return this.chats;
        }));
  }

  // funcion que suma un nuevo mensaje a la collecion de firebase
  newMessage( texto: string) {
    let message: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    };

    return this.itemsCollection.add( message );
  }

}
