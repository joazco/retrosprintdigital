import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";
import { UUID } from "angular2-uuid";
import ShortUniqueId from "short-unique-id";
import * as moment from "moment";

import { LUser } from "src/app/models/list-user";
import { ProfileService } from "../profile/profile.service";
import { Sprint, Theme } from "src/app/models/sprint";
import { User, USprint } from "src/app/models/user";
import { _defaultModel } from "src/app/models/models";

@Injectable({
  providedIn: "root"
})
export class CreateSessionService {
  constructor(
    private afDatabase: AngularFireDatabase,
    private profileService: ProfileService
  ) {}

  createSprint(
    label: string,
    guests: LUser[],
    model: Theme[] = null
  ): Promise<Sprint> {
    return new Promise((resolve, reject) => {
      this.initSprint(label, model).then(sprint => {
        guests.forEach(guest => {
          sprint.users[guest.uid] = {
            email: guest.email,
            username: guest.username,
            moderator: false,
            uid: guest.uid
          };
        });
        const table = this.afDatabase.object(`sprints/${sprint.id}`);
        table
          .set(sprint)
          .then(() => {
            resolve(sprint);
            this.appendSprintToUser(sprint);
          })
          .catch(() => reject());
      });
    });
  }

  initSprint(label: string, model: Theme[]): Promise<Sprint> {
    return new Promise((resolve, reject) => {
      const user = this.profileService.user;
      let themes: Theme[] = model;
      const date = new Date();
      const id = this.generateUid(user);

      if (
        user.sprints !== undefined ||
        user.sprints !== null ||
        user.sprints.length !== 0
      ) {
        if (themes !== null) {
          resolve({
            id,
            label,
            themes,
            counterTheme: themes.length,
            users: {
              [user.uid]: {
                username: user.username,
                email: user.email,
                uid: user.uid,
                moderator: true
              }
            },
            createDate: date.toString(),
            createDateString: moment(date).format("DD/MM/YYYY"),
            link: this.createLink(id)
          });
        } else {
          const { sprints } = user;
          let lastSession: USprint = null;
          for (let key in sprints) {
            const usprint: USprint = sprints[key];
            if (usprint.moderator !== undefined && usprint.moderator === true) {
              lastSession = usprint;
            }
          }

          const table = this.afDatabase.object(`sprints/${lastSession.id}`);
          table.valueChanges().subscribe(
            (data: Sprint) => {
              themes = data.themes;
              resolve({
                id,
                label,
                themes,
                counterTheme: themes.length,
                users: {
                  [user.uid]: {
                    username: user.username,
                    email: user.email,
                    uid: user.uid,
                    moderator: true
                  }
                },
                createDate: date.toString(),
                createDateString: moment(date).format("DD/MM/YYYY"),
                link: this.createLink(id)
              });
            },
            _error => {
              resolve({
                id,
                label,
                themes,
                counterTheme: themes.length,
                users: {
                  [user.uid]: {
                    username: user.username,
                    email: user.email,
                    uid: user.uid,
                    moderator: true
                  }
                },
                createDate: date.toString(),
                createDateString: moment(date).format("DD/MM/YYYY"),
                link: this.createLink(id)
              });
            }
          );
        }
      } else {
        resolve({
          id,
          label,
          themes,
          counterTheme: themes.length,
          users: {
            [user.uid]: {
              username: user.username,
              email: user.email,
              uid: user.uid,
              moderator: true
            }
          },
          createDate: date.toString(),
          createDateString: moment(date).format("DD/MM/YYYY"),
          link: this.createLink(id)
        });
      }
    });
  }

  private createLink(sprintId: string): string {
    const uid = new ShortUniqueId();
    const id = `${uid.randomUUID(3)}T${moment(new Date()).format(
      "DDMMYYhmmss"
    )}`;

    const table = this.afDatabase.object(`links/${id}/`);
    table.set({
      sprintId: sprintId,
      createDate: moment(new Date()).format("DD/MM/YYYY"),
      enabled: true
    });

    return id;
  }

  private generateUid(user: User): string {
    const { username } = user;
    let username_to_id: string = "";
    for (let i = 0; i < username.length && i < 4; i++) {
      const chart: string = username.charAt(i).toLocaleLowerCase();
      if (
        chart === "a" ||
        chart === "c" ||
        chart === "f" ||
        chart === "g" ||
        chart === "h" ||
        chart === "j" ||
        chart === "k" ||
        chart === "m" ||
        chart === "o" ||
        chart === "q" ||
        chart === "q" ||
        chart === "r" ||
        chart === "t" ||
        chart === "u" ||
        chart === "w" ||
        chart === "y"
      ) {
        if (i % 2 === 0) {
          username_to_id += "13";
        } else {
          username_to_id += "57";
        }
      } else {
        if (i % 2 === 0) {
          username_to_id += "02";
        } else {
          username_to_id += "46";
        }
      }
    }

    return `${moment(new Date()).format(
      "DDMMYYhmmss"
    )}-${username_to_id}-${UUID.UUID()}`;
  }

  private appendSprintToUser(sprint: Sprint) {
    const user = this.profileService.user;
    const table = this.afDatabase.object(
      `users/${user.uid}/sprints/${sprint.id}`
    );
    table.set({
      id: sprint.id,
      moderator: true,
      createAt: moment(new Date()).format("DD/MM/YYYY")
    });
  }
}
