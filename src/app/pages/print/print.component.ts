import { Component, OnInit, OnDestroy } from "@angular/core";
import { CardInfos } from "../sessions/session/session.component";
import { ProfileService } from "src/app/services/profile/profile.service";
import { ActivatedRoute } from "@angular/router";
import { SessionService } from "src/app/services/session/session.service";
import { Sprint } from "src/app/models/sprint";
import { User, Info } from "src/app/models/user";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "sprint-print",
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.scss"]
})
export class PrintComponent implements OnInit, OnDestroy {
  _sprint: Sprint = null;
  _card_infos: CardInfos = [];
  _content: any = [];

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private profileService: ProfileService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.profileService.initCurrentUser().then(_user => {
      this.route.params.subscribe(params => {
        const uid = params.id;
        this.sessionService.findSprint(uid).then(sprint => {
          this._sprint = sprint;
          this.titleService.setTitle(sprint.label);
          this.selectAllUser(sprint);

          const timer = setInterval(() => {
            let countUsers: number = 0;
            for (let key in this._sprint.users) {
              countUsers++;
            }
            if (this._card_infos.length === countUsers) {
              clearInterval(timer);
              Object.keys(this._sprint.themes).forEach(key => {
                const theme = this._sprint.themes[key];
                for (let cardInfo of this._card_infos) {
                  for (let info of cardInfo.infos) {
                    if (info.theme === theme.id) {
                      let currContent = this._content.find(
                        content => content.id === theme.id
                      );
                      if (this._content[theme.id] === undefined) {
                        currContent = {
                          id: theme.id,
                          title: theme.title,
                          type: theme.type,
                          infos: []
                        };
                        this._content.push(currContent);
                      }
                      currContent.infos.push({
                        user: cardInfo.name,
                        text: info.content
                      });
                    }
                  }
                }
              });
              setTimeout(() => {
                window.print();
                window.close();
              }, 2000);
            }
          }, 1000);
        });
      });
    });
  }

  ngOnDestroy() {
    this._card_infos.forEach(cardInfo => cardInfo.subcriber.unsubscribe());
  }

  selectAllUser(sprint: Sprint) {
    for (let key in sprint.users) {
      const user: User = sprint.users[key];
      const subscriber = this.sessionService
        .listenUserInfo(user.uid, this._sprint.id)
        .subscribe(data => {
          let cardInfo = this._card_infos.find(
            cardInfo => cardInfo.name === user.username
          );
          const infos: Array<{ id: any } & Info> = [];
          for (let id in data) {
            infos.push({
              id,
              content: data[id].content,
              theme: data[id].theme
            });
          }
          if (cardInfo === undefined) {
            cardInfo = {
              name: user.username,
              userUid: user.uid,
              subcriber: subscriber,
              infos
            };
            this._card_infos.push(cardInfo);
          } else {
            cardInfo.infos = infos;
          }
        });
    }
  }
}
