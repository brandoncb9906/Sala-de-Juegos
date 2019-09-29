import { Injectable } from '@angular/core';
import { Observable } from 'rxjs-compat';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';
 
@Injectable()
export class MultiplayerService { 
  private socket;

  newConnection(uid) {
    this.socket.emit("new-connection", uid);
  }

  createMatch(config:any){
    this.socket = io(environment.ws_url)
    this.socket.emit("create-match",config)
  }

  joinMatch(user){
    this.socket.emit("join-match",user)
  }

  acceptPlayer(user) {
    this.socket = io(environment.ws_url);
    this.socket.emit("start-match", user);
  }

  getPendingMatches() {
    this.socket = io(environment.ws_url);
    let observable = new Observable(observer => {
      this.socket.emit("get-matches");
      this.socket.on('pendingMatches', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  matchLeft(id,user){
    this.socket.emit("match-left",{id:id,user:user});
  }

  getMoves() {
    let observable = new Observable(observer => {
      this.socket.on('match-left',()=>{
        console.log("tu compañero abandonó la partida")
        observer.next({state:"abandon"})
      })
      this.socket.on('moved', (data) => {
        observer.next({state:"move",move:data});    
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  tryJoin(data){
    this.socket = io(environment.ws_url)
    this.socket.emit("try-join",data)
  }

  RefuseOponent(oponent){
    this.socket.emit("join-refused",oponent)
  }



  markPosition(i, j, id) {
    this.socket.emit("played", {row: i, column: j, id: id});
  }

  matchCreated() {
    let observable = new Observable(observer => {
      this.socket.on('match-created', (data) => {
        observer.next({data:data, evento:"match-created"});
      });
      this.socket.on('oponent-found', (data) => {
        observer.next({data:data, evento:"oponent-found"});
      });
      this.socket.on("join-refused",()=>{
        observer.next({evento:"join-refused"})
      })
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}

