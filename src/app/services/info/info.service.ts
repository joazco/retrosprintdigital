import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { Info } from "src/app/models/user";

@Injectable({
  providedIn: "root",
})
export class InfoService {
  constructor(private afDatabase: AngularFireDatabase) {}

  appendInfo(uidUser: string, uidSprint: string, info: Info): Promise<any> {
    return new Promise((resolve, reject) => {
      const table = this.afDatabase.object(
        `users/${uidUser}/sprints/${uidSprint}/infos`
      );
      const sub = table.valueChanges().subscribe((data: Info[]) => {
        sub.unsubscribe();
        if (null === data) {
          table.set([info]).then(resolve).catch(reject);
        } else {
          data.push(info);
          table.set(data).then(resolve).catch(reject);
        }
      });
    });
  }

  editInfo(
    uidUser: string,
    uidSprint: string,
    idInfo: string,
    info: Info
  ): Promise<any> {
    const table = this.afDatabase.object(
      `users/${uidUser}/sprints/${uidSprint}/infos/${idInfo}`
    );
    return table.set({
      content: info.content,
      theme: info.theme,
    });
  }
}
