
// interface que representa el tipo de datos de mensajes dentro del chat
export interface Mensaje {
    nombre: String;
    mensaje: String;
    fecha?: number;
    uid?: String;
}
