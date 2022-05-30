import {
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProfileService } from "src/app/services/profile/profile.service";
import { SessionService } from "src/app/services/session/session.service";
import { Sprint, Theme, SUser } from "src/app/models/sprint";
import { User, Info } from "src/app/models/user";
import { Subscription } from "rxjs";
import { Title } from "@angular/platform-browser";

export type CardInfos = {
  name: string;
  userUid: string;
  subcriber: any;
  infos: Array<{ id: any } & Info>;
}[];

export type ModalEdit = {
  uidUser: string;
  uidSprint: string;
  info: { id: any } & Info;
};

@Component({
  selector: "sprint-session",
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.scss"],
})
export class SessionComponent implements OnInit, OnDestroy, AfterViewChecked {
  _loadingPage: boolean = true;
  _sprint: Sprint = null;
  _im_admin: boolean = false;
  _list_user_selected: SUser[] = [];
  _modal_info: {
    show: boolean;
    edit?: ModalEdit;
    themeSelected: Theme;
  } = {
    show: false,
    themeSelected: null,
  };
  _modal_show_link: { show: boolean } = { show: false };
  _modal_append_column: { show: boolean } = { show: false };
  _modal_minus_column: { show: boolean } = { show: false };
  _list_user: SUser[] = [];
  _list_item: Theme[] = [];
  _card_infos: CardInfos = [];
  _width: number = 500;

  private _sub_list_user: Subscription = null;
  private _sub_theme: Subscription = null;
  private _init_curr_user: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    public profileService: ProfileService,
    private sessionService: SessionService
  ) {}

  ngOnInit() {
    this.profileService.initCurrentUser().then((user) => {
      this.route.params.subscribe((params) => {
        const uid = params.id;
        localStorage.setItem("lastsession", uid);
        this.sessionService.findSprint(uid).then((sprint) => {
          this._sprint = sprint;
          this.titleService.setTitle(sprint.label);
          this._loadingPage = false;
          this.usersInSession(user);
          this.themeInSession();
          this.initImAdmin(user);
        });
      });
    });
  }

  ngOnDestroy() {
    this.titleService.setTitle("RetroSprint Digital");
    if (this._sub_list_user) {
      this._sub_list_user.unsubscribe();
    }
    if (this._sub_theme) {
      this._sub_theme.unsubscribe();
    }
    this._card_infos.forEach((cardInfo) => cardInfo.subcriber.unsubscribe());
  }

  ngAfterViewChecked() {
    this._width = this.getWidth();
  }

  @HostListener("window:resize", ["$event"])
  onResize(_event) {
    this._width = this.getWidth();
  }

  initImAdmin(currUser: User) {
    for (let key in this._sprint.users) {
      const user = this._sprint.users[key];
      if (user.moderator && user.uid === currUser.uid) {
        this._im_admin = true;
      }
    }
  }

  usersInSession(currUser: User) {
    this._sub_list_user = this.sessionService
      .listenUserInSession(this._sprint.id)
      .subscribe((data) => {
        for (let key in data) {
          const user = data[key];
          let exist: boolean = false;
          this._list_user.forEach((listuser) => {
            if (listuser.uid === user.uid) {
              exist = true;
            }
          });
          if (exist) continue;
          this._list_user.push(user);
          if (user.uid === currUser.uid && !this._init_curr_user) {
            this._init_curr_user = true;
            this.selectUser(user);
          }
        }
      });
  }

  themeInSession() {
    this._sub_theme = this.sessionService
      .listenThemeInSession(this._sprint.id)
      .subscribe((data) => {
        this._list_item = [];
        if (data === null) {
          return;
        }

        if (data instanceof Array) {
          data.forEach((item) => (item ? this._list_item.push(item) : null));
        } else {
          Object.keys(data).forEach((key) => {
            this._list_item.push(data[key]);
          });
        }
      });
  }

  selectOneOrMultipleUser(e: MouseEvent, user: SUser) {
    const { metaKey, ctrlKey } = e;
    if (metaKey || ctrlKey) {
      this.selectUser(user);
    } else {
      this._card_infos.forEach((cardInfo, i) => {
        cardInfo.subcriber.unsubscribe();
      });
      this._card_infos = [];
      this._list_user_selected = [];
      this.selectUser(user);
    }
  }

  selectAll() {
    if (this._list_user_selected.length === this._list_user.length) {
      this._card_infos.forEach((cardInfo, i) => {
        cardInfo.subcriber.unsubscribe();
      });
      this._card_infos = [];
      this._list_user_selected = [];
    } else {
      this._card_infos.forEach((cardInfo, i) => {
        cardInfo.subcriber.unsubscribe();
      });
      this._card_infos = [];
      this._list_user_selected = [];
      this._list_user.forEach((user) => this.selectUser(user));
    }
  }

  selectUser(user: SUser) {
    if (this._list_user_selected.includes(user)) {
      this._card_infos.forEach((cardInfo, i) => {
        if (cardInfo.name === user.username) {
          cardInfo.subcriber.unsubscribe();
          this._card_infos.splice(i, 1);
        }
      });
      const index = this._list_user_selected.indexOf(user);
      this._list_user_selected.splice(index, 1);
    } else {
      this._list_user_selected.push(user);
      const subscriber = this.sessionService
        .listenUserInfo(user.uid, this._sprint.id)
        .subscribe((data) => {
          let cardInfo = this._card_infos.find(
            (cardInfo) => cardInfo.name === user.username
          );
          const infos: Array<{ id: any } & Info> = [];
          for (let id in data) {
            infos.push({
              id,
              content: data[id].content,
              theme: Number(data[id].theme),
            });
          }
          if (cardInfo === undefined) {
            cardInfo = {
              name: user.username,
              userUid: user.uid,
              subcriber: subscriber,
              infos,
            };
            this._card_infos.push(cardInfo);
          } else {
            cardInfo.infos = infos;
          }
        });
    }
  }

  listUsersUid() {
    const uids: string[] = [];
    for (let key in this._sprint.users) {
      uids.push(this._sprint.users[key].uid);
    }
    return uids;
  }

  deleteInfo(uidUser: string, idInfo: number) {
    this.sessionService.deleteInfo(uidUser, this._sprint.id, idInfo);
  }

  getWidth() {
    try {
      const heightbody = window.innerHeight;
      const heightmenu = document.getElementsByClassName("navbar")[0]
        .scrollHeight;
      const heightsessiontitle = document.getElementsByClassName(
        "content-session-title"
      )[0].scrollHeight;
      const total = heightbody - (heightmenu + heightsessiontitle) - 50;
      return total;
    } catch (e) {
      return 500;
    }
  }
}
