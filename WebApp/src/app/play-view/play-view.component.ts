// Componente de Creacion de Partida


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BoardServiceService } from '../services/board-service.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ProfilesServiceService } from '../services/profiles-service.service';
import { MultiplayerService } from '../services/web-socket.service';

@Component({
  selector: 'app-play-view',
  templateUrl: './play-view.component.html',
  styleUrls: ['./play-view.component.css']
})
export class PlayViewComponent implements OnInit {

  // representacion de los distintos sprites de eleccion para el user
  letters = [
    ["Trebol", "../../assets/img/fichas/a.png"],
    ["Diamante", "../../assets/img/fichas/b.png"],
    ["Corazon", "../../assets/img/fichas/c.png"],
    ["Pica", "../../assets/img/fichas/d.png"]
  ];

  player1M = "";
  player2M = "";

  started: boolean;

  // configuracion por defecto de partida
  public gameConfig = {
  gameMode: 1,
  dificultad: 1,
  player1ficha:'../../assets/img/fichas/a.png',
  player2ficha:'../../assets/img/fichas/a.png',
  player1:'player 1',
  player1uid:'id',
  player2uid:'En Espera',
  player2:'Jugador Invitado',
  size:'6',
  bgColor:'white'
};

connection;

// se requiere de la utilizacion de ciertos servicios como lo son el de multiplayer, router, autenficiacion, etc
  constructor(private sck: MultiplayerService , private _router: Router, private _dataService: BoardServiceService,
    private _authService: ProfilesServiceService, private afs: AngularFirestore) {
      // se obtienen los datos del user mediante un subscribe
      this._authService._firebaseAuth.authState.subscribe(user => {

        if (!user) {
          return;
        }
        this.gameConfig.player1uid = user.uid;
        this.gameConfig.player1 = user.displayName;
      });
     }

  ngOnInit() {
    this.started = false;
  }

// los onchange dependen de las opciones del user, uno por opcion de juego

// cambio de fichas
onChange(player, route) {
  if (player == 1) {
    this.gameConfig.player1ficha = route;
  }
  else
  {
    this.gameConfig.player2ficha = route;
  }
}

// cambio de dimension de tablero
onChangeBs(boardSize) {
  this.gameConfig.size = boardSize;
}

// cambio de color de tablero
onChangeBg(backgroundColor) {
  this.gameConfig.bgColor = backgroundColor;
}

// cambio de modo de juego
onChangeGM(gamemode) {
  this.gameConfig.gameMode = gamemode;
  if (gamemode == 2) {
    this.gameConfig.player2 = 'AI Dificultad Facil';
    this.gameConfig.player2uid = 'AIPlayer';
  } else{
    this.gameConfig.player2 = 'Jugador 2';
    this.gameConfig.player2uid = 'Jugador 2';
  }

}

// cambio de dificultad, en caso de que sea modo de juego PVE
onChangeDif(dificultad) {
  this.gameConfig.dificultad = dificultad;
  if (this.gameConfig.gameMode == 2) {
    if (this.gameConfig.dificultad == 1) {
        this.gameConfig.player2 = 'AI Dificultad Facil';
    } else if (this.gameConfig.dificultad == 2) {
      this.gameConfig.player2 = 'AI Dificultad Normal';
    } else if (this.gameConfig.dificultad == 3) {
      this.gameConfig.player2 = 'AI Dificultad Dificl';
    }
    this.gameConfig.player2uid = 'AIPlayer';
  }
}

// si todos los datos son correctos, se inicia un request para el inicio de juego
startGame() {
  if (this.gameConfig.gameMode == 3) { // online
  this.sck.createMatch(this.gameConfig); // llama al servicio de web socket
  this._router.navigate(["board","mp"]); // mp = multiplayer
  } else {
  console.log("MODO DE JUEGO>>>> " + this.gameConfig.gameMode);
  // modo de juego 1 -> jugador vs jugador
  // mode de juego 2 -> jugador vs IA 
  this._dataService.createNewGame({'config': this.gameConfig}).subscribe((data) => { 
    this._router.navigate(["board", data['id']]);
   });
  }
}



}
