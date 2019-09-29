// Componente de Tablero de Juego

import { Component, OnInit, Input } from '@angular/core';
import { BoardServiceService, GameStatus } from '../services/board-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ProfilesServiceService } from '../services/profiles-service.service';
import { Profile } from '../interface/profile.interface';
import { MultiplayerService } from '../services/web-socket.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  // los itemcollections son referencias a los documentos de perfiles de ambos players
  public itemsCollection: AngularFirestoreCollection<Profile>;
  public itemsCollection2: AngularFirestoreCollection<Profile>;
  //public fuckMyLife: Observable<Profile[]>;
  public uidSes: any = {};
  public KO: boolean;

  // se utilizan una serie de servicios para el correcto funcionamiento del componente
  constructor(private sck: MultiplayerService,
    private _dataService: BoardServiceService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: ProfilesServiceService,
    private afs: AngularFirestore) {
    // subscribe para obtener los datos del usuario logueado actual
    this._authService._firebaseAuth.authState.subscribe(user => {
      console.log('US: ', user);
      if (!user) {
        return;
      }
      this.uidSes = user.uid;
    });
    this.KO = false;
  }
  conexion = null;
  mpId;
  accepted = null;
  temporalOponent;

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.state == "EnProceso") {
      this._authService.getUser()
        .subscribe(
          (user) => {
            this.sck.matchLeft(this.mpId, user)
          }
        )
    }
  }

  // en el Oninit se encuentran los métodos necesarios para el funcionamiento del multijugador
  ngOnInit(): void {
    this.id = this._route.snapshot.paramMap.get('id');
    if (this.id == "mp") {
      console.log("estas en una partida multijugador");
      this.state = "MultijugadorEnEspera";

      this.conexion = this.sck.matchCreated().subscribe((data: any) => {
        if (data.evento == "join-refused") {
          this._router.navigate(["matches"])
        }
        if (data.evento == "match-created") {
          data = data.data
          this.writeInfo(data.state);
          this.config = data.config;
          this.mpId = data.id;
          console.log(this.mpId);
          this.state = "EnProceso";
          this.conexion = this.sck.getMoves()
            .subscribe((data: any) => {
              if (data.state == "move") {
                this.writeInfo(data.move)
              }
              if (data.state == "abandon") {
                this.state = "abandono"
              }
            });
        }
        if (data.evento == "oponent-found") {
          this.state = "OponenteEncontrado"
          this.temporalOponent = data.data
          this.afs.collection("profiles").doc(this.temporalOponent.user.uid).ref.get()
          .then((data)=>{
            this.temporalOponent.extraInfo = {
              nivel:data.get("nivel"),
              ganados:data.get("ganados"),
              perdidos:data.get("perdidos"),
              empatados:data.get("empatados")
            }
            console.log(this.temporalOponent.extraInfo)
          })
        }
      });
    }
    else {
      this._dataService.getConfig(this.id)
        .subscribe(
          (data) => {
            this.config = data;
          }
        );
      this.updateScreen();
    }

  }
  // algunos datos por defecto
  currentStatus: GameStatus = {
    status: [],
    score: 200,
    stat: 1,
    win: 0,
    player: 2,
    uids: ["Ernie", "Bert"]
  };

  id: string = "-1";

  state = "EnProceso";

  config: any = {
    gameMode: "1",
    dificultad: 1,
    player1ficha: "../../assets/img/fichas/b.png",
    player2ficha: "../../assets/img/fichas/c.png",
    player1: "Brandon Cruz",
    player1uid: "ABTtsOaH2Le5zsR6Ey5GkDezt8s1",
    player2uid: "AIPlayer",
    player2: "AI Player",
    size: "8",
    bgColor: "green",
  };

  // funcion que toma las coordenadas del click desde el componente html y realiza los requests segun la ocasion
  markPosition(j, k) {
    this.updateScreen();
    // en caso de un juego pvp en linea
    if (this.id == "mp") {
      console.log("Fila " + j + " " + "Columna " + k);
      this.sck.markPosition(j, k, this.mpId);
    } // en casod de pve
    else {
      console.log("Fila " + j + " " + "Columna " + k);
      this._dataService.positionMarked(j, k, this.id)
        .subscribe((res: GameStatus) => this.writeInfo(res));
    }
    if (this.config['gameMode'] == 2) {
      this._dataService.turnoAI(this.id)
        .subscribe((res: GameStatus) => this.writeInfo(res));
    }
    this.updateScreen();
  }

  // funcion que realiza el request para la obtencion del estado actual de juego y con eso los parametros para que
  // el componente html se refresque
  updateScreen() {
    this._dataService.getStatus(this.id)
      .subscribe((data: GameStatus) => this.writeInfo(data));
  }

  // funcion que toma los datos retornados por el request y los ubica en el estado de juego actual en el front
  writeInfo(data: GameStatus) {
    this.currentStatus = {
      status: data['board'],
      score: data['score'],
      stat: data['stat'],
      win: data['win'],
      player: data['player'],
      uids: data['uids']
    };
    // si el stat es 2, quiere decir que se ha acabado el juego, por lo tanto se actualizan los perfiles de los
    // jugadores involucrados en la partida dentro de la base de datos
    if (this.currentStatus['stat'] == 2 && !this.KO) {
      this.updateStats(this.currentStatus.uids[0].toString(), this.currentStatus.uids[1].toString(), this.currentStatus.win);
      this.updateNivel(this.currentStatus.uids[0].toString());
      this.updateNivel(this.currentStatus.uids[1].toString());
      this.KO = true;
    }
  }

  acceptPlayer() {
    this.sck.joinMatch(this.temporalOponent);
  }

  negatePlayer() {
    this.sck.RefuseOponent(this.temporalOponent.user.uid)
    this.state = "MultijugadorEnEspera"
  }

  // funcion que toma los uids de los players, mas el ganador y acutliza los datos en firebase
  updateStats(uidUp1: string, uidUp2: string, winner: number) {
    // se actualizan los datos denpendiendo del ganador
    if (winner == 1) {
      this.itemsCollection.doc(uidUp1).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            ganados: doc.data()['ganados'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
      this.itemsCollection2.doc(uidUp2).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            perdidos: doc.data()['perdidos'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    else if (winner == 2) {
      this.itemsCollection.doc(uidUp1).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            perdidos: doc.data()['perdidos'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
      this.itemsCollection2.doc(uidUp2).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            ganados: doc.data()['ganados'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
    else {
      this.itemsCollection.doc(uidUp1).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            empatados: doc.data()['empatados'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
      this.itemsCollection2.doc(uidUp2).ref.get().then(function (doc) {
        if (doc.exists) {
          doc.ref.update({
            empatados: doc.data()['empatados'] + 1
          });
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });
    }
  }

  // funcion que toma las partidas ganadas contra las perdidas de los players y actualiza su nivel de perfil
  updateNivel(uidUp: string) {
    // se toma el documento del player
    this.itemsCollection = this.afs.collection<Profile>('profiles', ref => ref.where('uid', '==', uidUp));
    this.itemsCollection.doc(uidUp).ref.get().then(function (doc) {
      if (doc.exists) {
        let partidasTot: number = doc.data()['ganados'] + doc.data()['perdidos'] + doc.data()['empatados'];
        let rendimiento: number = doc.data()['ganados'] / doc.data()['perdidos'];
        // si tiene mas de 10 partidas se actualiza por un perfil mas certero
        if (partidasTot > 9) {
          // dependiendo del rendimiento del jugador se actualiza su perfil
          if (rendimiento >= 1 && rendimiento < 1.5) {
            doc.ref.update({
              nivel: "Buen Jugador",
            });
          } else if (rendimiento >= 1.5) {
            doc.ref.update({
              nivel: "Crack",
            });
          } else if (rendimiento < 1 && rendimiento >= 0.5) {
            doc.ref.update({
              nivel: "Malito pero no tanto",
            });
          } else if (rendimiento < 0.5) {
            doc.ref.update({
              nivel: "Salgase solo",
            });
          }
        }

      } else {
        console.log("No such document!");
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });


  }
}
