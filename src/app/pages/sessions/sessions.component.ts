import { Component, OnInit, OnDestroy } from "@angular/core";
import * as moment from "moment";
import { ProfileService } from "src/app/services/profile/profile.service";
import { Guest } from "src/app/models/guest";
import { Router } from "@angular/router";
import { USprint } from "src/app/models/user";
import { SessionService } from "src/app/services/session/session.service";
import { Subscription } from "rxjs";
import { Sprint } from "src/app/models/sprint";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "sprint-sessions",
  templateUrl: "./sessions.component.html",
  styleUrls: ["./sessions.component.scss"]
})
export class SessionsComponent implements OnInit, OnDestroy {
  _loadingPage: boolean = true;
  _guests: Guest[] = [];
  _last_session: Sprint = null;
  _sessions: {
    uid: string;
    label: string;
    participants: string;
    createDate: string;
  }[] = [];
  private _sub_list_user: Subscription = null;
  constructor(
    private router: Router,
    private titleService: Title,
    private profileService: ProfileService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.profileService.initCurrentUser().then(user => {
      this.titleService.setTitle("Retro Sprint Digital");
      this._loadingPage = false;
      const lastSession = localStorage.getItem("lastsession");
      if (null !== lastSession) {
        this.sessionService
          .findSprint(lastSession)
          .then(onfulfilled => (this._last_session = onfulfilled));
      }
      this._sub_list_user = this.profileService
        .listSessions(user.uid)
        .subscribe(usprints => {
          this._sessions = [];
          for (let key in usprints) {
            this.sessionService.findSprint(key).then(sprint =>
              this._sessions.push({
                uid: sprint.id,
                label: sprint.label,
                participants: this.userToParticipantsString(sprint.users),
                createDate: sprint.createDateString
              })
            );
          }
        });
    });
  }

  ngOnDestroy() {
    if (this._sub_list_user) {
      this._sub_list_user.unsubscribe();
    }
  }

  userToParticipantsString(users: any) {
    let participants = "";
    for (let key in users) {
      if (users[key].username && users[key].username !== "") {
        participants += `${users[key].username}, `;
      } else {
        participants += `${users[key].email}, `;
      }
    }
    return participants.substring(0, participants.length - 2);
  }

  orderByDate() {
    let sortedDates = this._sessions.sort(function(left, right) {
      const val = moment(left.createDate, "DD/MM/YYYY").diff(
        moment(right.createDate, "DD/MM/YYYY")
      );
      if (val < 0) {
        return -1;
      } else if (val > 0) {
        return 1;
      } else {
        return 0;
      }
    });
    return sortedDates.reverse();
  }
}
