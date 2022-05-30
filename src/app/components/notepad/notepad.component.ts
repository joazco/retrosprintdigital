import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Theme } from "src/app/models/sprint";

@Component({
  selector: "sprint-notepad",
  templateUrl: "./notepad.component.html",
  styleUrls: ["./notepad.component.scss"]
})
export class NotepadComponent implements OnInit {
  @Input() username: string;
  @Input() content: string;
  @Input() theme: number;
  @Input() themes: Theme[] = [];
  @Input() isAdmin: boolean;
  @Output() delete: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  emitDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    this.delete.emit(true);
  }

  ngOnInit() {}

  getType(theme: number) {
    const info: Theme | undefined = this.themes.find(
      themeInThemes => themeInThemes.id === theme
    );
    if (info === undefined) {
      return "notepad-heading-valid";
    }
    if (info.type === "is-danger") {
      return "notepad-heading-danger";
    }
    if (info.type === "is-success") {
      return "notepad-heading-primary";
    }
    if (info.type === "is-valid") {
      return "notepad-heading-valid";
    }
    if (info.type === "is-warning") {
      return "notepad-heading-warning";
    }

    return "notepad-heading-valid";
  }
}
