
// interface que representa el tipo de datos de perfiles dentro de firebase
export interface Profile {
    ganados: number;
    perdidos: number;
    empatados: number;
    nivel: String;
    uid?: String;
}
