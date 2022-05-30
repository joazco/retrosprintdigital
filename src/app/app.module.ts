import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {
  RECAPTCHA_V3_SITE_KEY,
  RecaptchaV3Module,
  RECAPTCHA_LANGUAGE,
} from "ng-recaptcha";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environmentFirebase } from "./env";
import { CreateAccountComponent } from "./pages/create-account/create-account.component";
import { LogoComponent } from "./components/logo/logo.component";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { ConnectionComponent } from "./pages/connection/connection.component";
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { HeaderConnectedComponent } from "./components/header-connected/header-connected.component";
import { ModalEditProfilComponent } from "./components/modal-edit-profil/modal-edit-profil.component";
import { ModalEditPasswordComponent } from "./components/modal-edit-password/modal-edit-password.component";
import { ButtonsSessionComponent } from "./components/buttons-session/buttons-session.component";
import { ModalCreateSessionComponent } from "./components/modal-create-session/modal-create-session.component";
import { SessionsComponent } from "./pages/sessions/sessions.component";
import { SessionComponent } from "./pages/sessions/session/session.component";
import { ChipComponent } from "./components/chip/chip.component";
import { ModalAppendInfoComponent } from "./components/modal-append-info/modal-append-info.component";
import { ModalAppendUserFromSessionComponent } from "./components/modal-append-user-from-session/modal-append-user-from-session.component";
import { NotepadComponent } from "./components/notepad/notepad.component";
import { PrintComponent } from "./pages/print/print.component";
import { HomeComponent } from "./pages/home/home.component";
import { TitleComponent } from "./components/session/title/title.component";
import { TitleThemeComponent } from "./components/session/title-theme/title-theme.component";
import { CguComponent } from "./components/cgu/cgu.component";
import { AutofocusDirective } from "./directive/autofocus.directive";
import { LinkComponent } from "./pages/link/link.component";
import { ModalLinkSessionComponent } from "./components/modal-link-session/modal-link-session.component";
import { ModalAppendColumnComponent } from "./components/modal-append-column/modal-append-column.component";
import { ModalMinusColumnComponent } from "./components/modal-minus-column/modal-minus-column.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    CreateAccountComponent,
    LogoComponent,
    ConnectionComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    LoadingComponent,
    HeaderConnectedComponent,
    ModalEditProfilComponent,
    ModalEditPasswordComponent,
    ButtonsSessionComponent,
    ModalCreateSessionComponent,
    SessionsComponent,
    SessionComponent,
    ChipComponent,
    ModalAppendInfoComponent,
    ModalAppendUserFromSessionComponent,
    NotepadComponent,
    PrintComponent,
    TitleComponent,
    TitleThemeComponent,
    HomeComponent,
    CguComponent,
    AutofocusDirective,
    LinkComponent,
    ModalLinkSessionComponent,
    ModalAppendColumnComponent,
    ModalMinusColumnComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environmentFirebase.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RecaptchaV3Module,
    HttpClientModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: "6LfVC7YUAAAAAMaSAb0i1jFY0ucm1tpxcIM5zHYA",
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "fr", // use French language
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
