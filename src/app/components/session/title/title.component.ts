import { Component, OnInit, Input } from "@angular/core";
import { Sprint } from "src/app/models/sprint";
import { SessionService } from "src/app/services/session/session.service";

@Component({
  selector: "sprint-session-title",
  templateUrl: "./title.component.html",
  styleUrls: ["./title.component.scss"]
})
export class TitleComponent implements OnInit {
  @Input() sprint: Sprint;
  @Input() moderator: boolean = false;
  _title: string = null;
  _edit_mode: boolean = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit() {
    this.sessionService
      .listenTitle(this.sprint.id)
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
    this.sessionService.editTitleSprint(this.sprint.id, event.target.value);
  }
}
