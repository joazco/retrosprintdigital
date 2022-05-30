import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup } from "@angular/forms";
import * as firebase from "firebase/app";
import { Router } from "@angular/router";
import { UrlRedirect } from "src/app/models/url-redirect";

@Injectable({
  providedIn: "root",
})
export class ConnectionService {
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  checkLogged(): Promise<void> {
    return new Promise((_resolve, reject) => {
      const sub = this.afAuth.authState.subscribe((res) => {
        sub.unsubscribe();
        if (res && res.uid) {
          console.log(res);
          const urlRedirect = this.getUrlRedirect();
          if (urlRedirect === null) {
            this.router.navigate(["profile"]);
          } else {
            this.router.navigate([
              `/${urlRedirect.component}/${urlRedirect.id}`,
            ]);
          }
        } else {
          reject();
        }
      });
    });
  }

  connectionWithEmailAndPassword(form: FormGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      const {
        value: { email, password },
      } = form;
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then((onfullfilled) => {
          const {
            user: { emailVerified },
          } = onfullfilled;
          if (!emailVerified) {
            reject("email unverified");
          } else {
            resolve();
          }
        })
        .catch((_onrejected) => reject(null));
    });
  }

  connectWithMicrosoft(): Promise<void> {
    const provider = new firebase.auth.OAuthProvider("microsoft.com");
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  connectWithGithub(): Promise<void> {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  connectWithGoogle(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithRedirect(provider);
  }

  resendVerificationMail(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.afAuth.auth.currentUser) {
        reject();
        return;
      }
      this.afAuth.auth.currentUser
        .sendEmailVerification()
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  sendResetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  disconnect(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  getUrlRedirect(): UrlRedirect | null {
    const val = localStorage.getItem("urlRedirect");
    localStorage.removeItem("urlRedirect");
    if (null !== val) {
      return JSON.parse(val);
    }
    return null;
  }
}
