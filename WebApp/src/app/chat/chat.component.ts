// Componente del Chat

import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: []
})

export class ChatComponent implements OnInit {
  mensaje: string;
  elemento: any;

  // se requiere de las funciones del servicio de mensajeria
  constructor( public _cs: ChatService) {
    // se suscribe al servicio para obtener todos los mensajes anteriores dentro del chat
    this._cs.cargarMensajes().subscribe(() => {
            setTimeout(() => {
              this.elemento.scrollTop = this.elemento.scrollHeight;
            }, 20);
    });
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  // funcion que envia al servicio el nuevo mensaje por almacenar en el servicio
  enviarMensaje() {
    if (this.mensaje.length === 0) {
      return;
    }

    this._cs.newMessage(this.mensaje)
      .then(() => this.mensaje = '')
      .catch((err) => console.error('Error al enviar mensaje', err));
  }
}
