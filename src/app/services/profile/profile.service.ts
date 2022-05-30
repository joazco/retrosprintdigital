import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { User, USprint } from "src/app/models/user";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { CreateAccountService } from "../create-account-service.service";
import { Notification } from "src/app/models/notification";
import { Guest } from "src/app/models/guest";
import * as moment from "moment";
import { UrlRedirect } from "src/app/models/url-redirect";

@Injectable({
  providedIn: "root"
})
export class ProfileService implements OnDestroy {
  private _user: User;
  private _uid: string;
  private _is_provider: boolean;
  private _notifications: Notification[];
  private _sub_profile_user: Subscription = null;
  private _sub_notifications: Subscription = null;
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDatabase: AngularFireDatabase,
    private createAccountService: CreateAccountService
  ) {}

  ngOnDestroy() {
    if (this._sub_profile_user) {
      this._sub_profile_user.unsubscribe();
    }
    if (this._sub_notifications) {
      this._sub_notifications.unsubscribe();
    }
  }

  checkLogged(): Promise<string> {
    return new Promise((resolve, _reject) => {
      const sub = this.afAuth.authState.subscribe(res => {
        sub.unsubscribe();
        if (res && res.uid) {
          resolve(res.uid);
        } else {
          this.router.navigate(["connection"]);
        }
      });
    });
  }

  initCurrentUser(urlRedirect?: UrlRedirect): Promise<User> {
    return new Promise((resolve, _reject) => {
      const sub = this.afAuth.authState.subscribe(res => {
        sub.unsubscribe();
        if (res && res.uid) {
          this._uid = res.uid;
          this._is_provider =
            res.providerData[0].providerId !== "password" ? true : false;
          this.listenNotification();
          const table = this.afDatabase.object(`users/${res.uid}`);
          const sub = table.valueChanges().subscribe(
            (data: User) => {
              sub.unsubscribe();
              if (data === null) {
                const user: User = this.createAccountService.initUserFromSso(
                  res
                );
                table
                  .set(user)
                  .then(_onfulfilled => {
                    this._user = user;
                    resolve(this._user);
                    this.listenCurrentUser();
                  })
                  .catch(_onrejected => this.router.navigate(["connection"]));
              } else {
                this._user = data;
                resolve(this._user);
                this.listenCurrentUser();
              }
            },
            _error => this.router.navigate(["connection"])
          );
        } else {
          if (urlRedirect) {
            localStorage.setItem("urlRedirect", JSON.stringify(urlRedirect));
          }
          this.router.navigate(["connection"]);
        }
      });
    });
  }

  listenUser(uid: string): Observable<any> {
    const table = this.afDatabase.object(`users/${uid}`);
    return table.valueChanges();
  }

  private listenCurrentUser(): void {
    this._sub_profile_user = this.listenUser(this._uid).subscribe(
      (data: User) => (this._user = data)
    );
  }

  private listenNotification(): void {
    const table = this.afDatabase.object("notifications");
    this._sub_notifications = table
      .valueChanges()
      .subscribe((data: Notification[]) => {
        this._notifications = data.sort((a: Notification, b: Notification) => {
          const dateA = moment(a.createDate, "DD/MM/YYYY");
          const dateB = moment(b.createDate, "DD/MM/YYYY");
          const diff = dateB.diff(dateA);
          if (diff < 0) {
            return -1;
          } else if (diff > 0) {
            return 1;
          }
          return 0;
        });
      });
  }

  updateCurrentUser(form: FormGroup): Promise<void> {
    const {
      value: { username, name, firstname, business, newsletter, cgu }
    } = form;
    this._user.username = username;
    this._user.name = name;
    this._user.firstname = firstname;
    this._user.business = business;
    this._user.newsletter = newsletter;
    this._user.cgu = cgu;
    const table = this.afDatabase.object(`users/${this._uid}`);
    return table.set(this._user);
  }

  updatePasswordCurrentUser(form: FormGroup): Promise<void> {
    const {
      value: { password }
    } = form;
    return this.afAuth.auth.currentUser.updatePassword(password);
  }

  listSessions(uidUser: string): Observable<any> {
    const table = this.afDatabase.object(`users/${uidUser}/sprints`);
    return table.valueChanges();
  }

  get user(): User {
    return this._user;
  }

  get is_provider(): boolean {
    return this._is_provider;
  }

  get notifications(): Notification[] {
    return this._notifications;
  }
}
