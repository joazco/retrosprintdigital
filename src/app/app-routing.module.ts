import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateAccountComponent } from "./pages/create-account/create-account.component";
import { ConnectionComponent } from "./pages/connection/connection.component";
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { SessionsComponent } from "./pages/sessions/sessions.component";
import { SessionComponent } from "./pages/sessions/session/session.component";
import { PrintComponent } from "./pages/print/print.component";
import { HomeComponent } from "./pages/home/home.component";
import { LinkComponent } from "./pages/link/link.component";

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "create-account", component: CreateAccountComponent },
  { path: "connection", component: ConnectionComponent },
  { path: "forget-password", component: ForgetPasswordComponent },
  { path: "profile", component: ProfileComponent },
  { path: "sessions", component: SessionsComponent },
  { path: "sessions/:id", component: SessionComponent, pathMatch: "full" },
  { path: "print/:id", component: PrintComponent },
  { path: "join/:id", component: LinkComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
