// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';



// Rutas
import { APP_ROUTING } from './app.routing';

// Services
import {BoardServiceService} from './services/board-service.service';
import { ChatService } from './services/chat.service';
import {MultiplayerService} from './services/web-socket.service'


// Components
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { PlayViewComponent } from './play-view/play-view.component';
import { LoginComponent } from './login/login.component';
import {environment} from '../environments/environment';
import { RegisterComponent } from './register/register.component';
import { ProfilesServiceService } from './services/profiles-service.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ChatComponent } from './chat/chat.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    PlayViewComponent,
    LoginComponent,
    RegisterComponent,
    MatchmakingComponent,
    ChatComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    APP_ROUTING,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [
    BoardServiceService,
    ChatService,
    AngularFireAuth,
    ProfilesServiceService,
    AuthGuardService,
    MultiplayerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
