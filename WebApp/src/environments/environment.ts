// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyAs6AiyovaSFJ-LmSU5mkYsvch4kHtUrq8",
    authDomain: "proyecto-sala-de-juegos.firebaseapp.com",
    databaseURL: "https://proyecto-sala-de-juegos.firebaseio.com",
    projectId: "proyecto-sala-de-juegos",
    storageBucket: "proyecto-sala-de-juegos.appspot.com",
    messagingSenderId: "385766391092",
  },
  ws_url: /*"http://localhost:3000/" */ "https://proyecto-sala-de-juegos.herokuapp.com/"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
