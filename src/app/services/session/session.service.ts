import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Sprint, SUser } from "src/app/models/sprint";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  constructor(private afDatabase: AngularFireDatabase) {}

  findSprint(uid: string): Promise<Sprint> {
    return new Promise((resolve, reject) => {
      const table = this.afDatabase.object(`sprints/${uid}`);
      const sub = table.valueChanges().subscribe((data: Sprint) => {
        sub.unsubscribe();
        if (data === null || data === undefined) {
          reject();
        } else {
          resolve(data);
        }
      });
    });
  }

  editTitleSprint(uidSession: string, title: string) {
    const table = this.afDatabase.object(`sprints/${uidSession}/label`);
    table.set(title);
  }

  editTitleThemeSprint(uidSession: string, themeId: number, title: string) {
    const table = this.afDatabase.object(
      `sprints/${uidSession}/themes/${themeId}/title`
    );
    table.set(title);
  }

  listenUserInSession(uidSession: string): Observable<any> {
    const table = this.afDatabase.object(`sprints/${uidSession}/users`);
    return table.valueChanges();
  }

  listenThemeInSession(uidSession: string): Observable<any> {
    const table = this.afDatabase.object(`sprints/${uidSession}/themes`);
    return table.valueChanges();
  }

  listenUserInfo(uidUser: string, uidSession: string): Observable<any> {
    const table = this.afDatabase.object(
      `users/${uidUser}/sprints/${uidSession}/infos`
    );
    return table.valueChanges();
  }

  listenTitle(uidSession: string): Observable<any> {
    const table = this.afDatabase.object(`sprints/${uidSession}/label`);
    return table.valueChanges();
  }

  listenTitleTheme(uidSession: string, themeId: number): Observable<any> {
    const table = this.afDatabase.object(
      `sprints/${uidSession}/themes/${themeId}/title`
    );
    return table.valueChanges();
  }

  deleteInfo(
    uidUser: string,
    uidSession: string,
    idInfo: number
  ): Promise<any> {
    const table = this.afDatabase.object(
      `users/${uidUser}/sprints/${uidSession}/infos/${idInfo}`
    );
    return table.remove();
  }

  appendTheme(
    sprint: Sprint,
    column: {
      type: string;
      title: string;
    }
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const table = this.afDatabase.object(`sprints/${sprint.id}`);
      const sub = table.valueChanges().subscribe((currentSprint: Sprint) => {
        sub.unsubscribe();
        const tableCounterTheme = this.afDatabase.object(
          `sprints/${sprint.id}/counterTheme`
        );
        const tableNewTheme = this.afDatabase.object(
          `sprints/${sprint.id}/themes/${currentSprint.counterTheme}`
        );
        tableNewTheme
          .set({
            type: column.type,
            title: column.title,
            id: currentSprint.counterTheme
          })
          .then(resolver => resolve(resolver))
          .catch(rejecter => reject(rejecter));
        tableCounterTheme.set(currentSprint.counterTheme + 1);
      });
    });
  }
  removeTheme(sprint: Sprint, theme: string): Promise<void> {
    const table = this.afDatabase.object(
      `sprints/${sprint.id}/themes/${theme}`
    );
    return table.remove();
  }
}
