import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Theme, Sprint } from "src/app/models/sprint";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "sprint-session-title-theme",
  templateUrl: "./title-theme.component.html",
  styleUrls: ["./title-theme.component.scss"]
})
export class TitleThemeComponent implements OnInit {
  @Input() sprint: Sprint;
  @Input() theme: Theme;
  @Input() moderator: boolean = false;
  @Output() openModel: EventEmitter<boolean> = new EventEmitter();
  _edit_mode: boolean = false;
  _title: string;
  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService
      .listenTitleTheme(this.sprint.id, this.theme.id)
      .subscribe(title => (this._title = title));
  }

  editTitle() {
    if (!this.moderator) {
      return;
    }
    this._edit_mode = true;
  }

  validTitle(event: any) {
    this._edit_mode = false;
    this.sessionService.editTitleThemeSprint(
      this.sprint.id,
      this.theme.id,
      event.target.value
    );
  }
}
