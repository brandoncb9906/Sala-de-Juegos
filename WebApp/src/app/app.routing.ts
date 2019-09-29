import {RouterModule, Routes } from '@angular/router';
import {AuthGuardService as authGuard} from './services/auth-guard.service';

// Components
import { BoardComponent } from './board/board.component';
import { PlayViewComponent } from './play-view/play-view.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { ProfileComponent } from './profile/profile.component';


// rutas de nuestra aplicacion
  // othello -> creacion de partida de othello
  // board -> partida de juego
  // matches -> lobby y chat
  // profile -> perfil de user
  // login -> logueo de users
  // register -> registro de nuevos users
  // memoria -> creacion de partida de memoria
  
const APP_ROUTES: Routes = [
  { path: 'othello', component: PlayViewComponent, canActivate:[authGuard] },
  { path: 'board/:id', component: BoardComponent, canActivate:[authGuard]},
  { path: 'matches', component: MatchmakingComponent, canActivate:[authGuard]},
  { path: 'profile', component: ProfileComponent, canActivate:[authGuard]},
  { path: '**', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
