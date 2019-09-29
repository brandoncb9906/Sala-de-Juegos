// Componetne de Sesiones de Juego

import { Component} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable, Subject } from 'rxjs';
import { MultiplayerService } from '../services/web-socket.service';
import { ProfilesServiceService } from '../services/profiles-service.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Profile } from '../interface/profile.interface';


@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent {

  notifications: Subject<any>;
  public connection;
  public matches = [];
  public playerData = [];
  public fuckMyLife: Array<Observable<Profile[]>>;
  public itemsCollection: AngularFirestoreCollection<Profile>;

  // se requiere de las funcionalidades de ciertos servicios como el de chat, multijugador y perfiles
  constructor(public _cs: ChatService, private sck: MultiplayerService,
    private _profiles: ProfilesServiceService, private _router: Router, private afs: AngularFirestore) {
      // se obtienen las sesiones a la espera de players mediante un subscribe
      this.fuckMyLife = new Array<Observable<Profile[]>>();
      this.connection = this.sck.getPendingMatches().subscribe((matches: any) => {
        this.matches = matches.matches;
        for (let index = 0; index < this.matches.length; index++) {
          this.itemsCollection = this.afs.collection<Profile>('profiles', ref => ref.where('uid', '==', this.matches[index].player1uid));
          this.fuckMyLife.push(this.itemsCollection.valueChanges());
        }
      });
      this._profiles.getUser().subscribe(
        (response) => {
          this.sck.newConnection(response.uid);
        }
      );
  }


  ngOnInit() {
  }

  // funcion para unirse a una partida a la espera de jugadores
  joinMatch(id) {
    this._profiles.getUser()
    .subscribe((user) => {
      this.sck.tryJoin({id: id, user: user});
      this._router.navigate(["board","mp"]);
    });
  }
}
