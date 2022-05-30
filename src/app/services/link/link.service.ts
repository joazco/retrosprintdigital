import { Injectable } from "@angular/core";
import { User } from "src/app/models/user";
import { AngularFireDatabase } from "@angular/fire/database";
import { SUser } from "src/app/models/sprint";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class LinkService {
  constructor(
    private afDatabase: AngularFireDatabase,
    private http: HttpClient
  ) {}

  connectToLink(link: string, user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .get(
          ` https://us-central1-sprint-1bda4.cloudfunctions.net/join?link=${link}&userUid=${user.uid}`
        )
        .subscribe(response => {
          if (response["sprintId"]) {
            resolve(response["sprintId"]);
          } else if (response["error"]) {
            reject(response["error"]);
          }
        });
    });
  }

  updateEnable(link: string) {
    const table = this.afDatabase.object(`links/${link}/enabled`);
    table.set(true);
  }
}
