import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import * as moment from "moment";

import { User } from "../models/user";

@Injectable({
  providedIn: "root"
})
export class CreateAccountService {
  constructor(
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase
  ) {}

  createAccount(form: FormGroup): Promise<void> {
    return new Promise((resolve, reject) => {
      const {
        value: { email, password }
      } = form;

      this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(value => {
          this.afAuth.auth.currentUser.sendEmailVerification();
          const user = this.createUserFromForm(form, value.user.uid);
          this.insertUserFromModel(user, value.user.uid)
            .then(_onfulfilled => resolve())
            .catch(reason => reject(reason));
        })
        .catch(reason => reject(reason));
    });
  }

  createUserFromForm(form: FormGroup, uid: string): User {
    const {
      value: { username, email, name, business, firstname, newsletter, cgu }
    } = form;

    return {
      username,
      email,
      name,
      business,
      firstname,
      newsletter,
      cgu,
      account: { type: "free" },
      createdAt: moment().format("DD/MM/YYYY"),
      lastConnectionAt: moment().format("DD/MM/YYYY"),
      uid
    };
  }

  initUserFromSso(res: {
    email: string;
    displayName?: string;
    uid: string;
  }): User {
    return {
      email: res.email,
      username: res.displayName ? res.displayName : res.email,
      account: { type: "free" },
      newsletter: true,
      cgu: false,
      createdAt: moment().format("DD/MM/YYYY"),
      lastConnectionAt: moment().format("DD/MM/YYYY"),
      uid: res.uid
    };
  }

  insertUserFromModel(user: User, uid: string): Promise<void> {
    const table = this.afDatabase.object(`users/${uid}`);
    return table.set(user);
  }
}
